import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
} from "@mui/material";
import React = require("react");
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [authC, setAuthC] = useState<AuthClient>();
  const navigate = useNavigate();

  const handleAuth = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authC.login({
      onSuccess: async () => {
        navigate("/authed");
      },
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : process.env.LOCAL_II_CANISTER,
      // Maximum authorization expiration is 8 days
      maxTimeToLive: days * hours * nanoseconds,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("ic-delegation")) {
      navigate("/authed");
    } else {
      AuthClient.create().then((res) => {
        setAuthC(res);
      });
    }
  }, []);

  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Internet Identity"} />
        <CardContent sx={{ textAlign: "center" }}>
          <>
            <Typography variant={"h6"}>You are not authenticated</Typography>
            <Button
              sx={{ margin: "10px 0px" }}
              variant="contained"
              fullWidth
              onClick={handleAuth}
            >
              Authenticate
            </Button>
          </>
        </CardContent>
      </Card>
    </Container>
  );
}
