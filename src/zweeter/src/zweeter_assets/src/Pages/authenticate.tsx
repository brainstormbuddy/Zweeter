import { AuthClient } from "@dfinity/auth-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import React = require("react");
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function Authenticate() {
  const [authC, setAuthC] = useState<AuthClient>();
  const navigate = useNavigate();
  const principal = useAppSelector((state) => state.authReducer.principal);

  const handleAuth = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authC.login({
      onSuccess: async () => {
        navigate("/home");
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
    if (principal) {
      //navigate("/home");
    } else {
      AuthClient.create().then((res) => {
        setAuthC(res);
      });
    }
  }, []);
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Authenticate"} />
        <CardContent>
          <TextField label="Username" />
          <Button
            sx={{ margin: "10px 0px" }}
            variant="contained"
            fullWidth
            onClick={handleAuth}
          >
            Authenticate
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
