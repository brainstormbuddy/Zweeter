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
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { v4 } from "uuid";
import { login, setInfo } from "../store/authenticationSlice";
import handleAuthenticated from "../utils/auth";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/zweeter/zweeter.did";

export default function Authenticate() {
  const [authC, setAuthC] = useState<AuthClient>();
  const navigate = useNavigate();
  const principal = useAppSelector((state) => state.authReducer.principal);
  const name = useAppSelector((state) => state.authReducer.name);
  const [authActor, setAuthActor] = useState<ActorSubclass<_SERVICE>>();
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState("");
  const handleAuth = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    if (principal) {
      dispatch(setInfo({ name: userName, id: v4() }));
      navigate("/home");
    } else {
      await authC.login({
        onSuccess: async () => {
          handleAuthenticated(authC).then((authed) => {
            dispatch(setInfo({ name: userName, id: v4() }));
            setAuthActor(authed);
            navigate("/home");
          });
        },
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app/#authorize"
            : process.env.LOCAL_II_CANISTER,
        // Maximum authorization expiration is 8 days
        maxTimeToLive: days * hours * nanoseconds,
      });
    }
  };

  useEffect(() => {
    if (principal !== "" && name !== "") {
      navigate("/home");
    } else {
      AuthClient.create().then((res) => {
        setAuthC(res);
      });
    }
  }, []);

  useEffect(() => {
    // authActor?.whoami().then((res) => {
    //   const principal = res.toString();
    //   dispatch(login({ principal }));
    // });
  }, [authActor]);
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Authenticate"} />
        <CardContent>
          <TextField
            label="Username"
            fullWidth
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          />
          <Button
            sx={{ margin: "10px 0px" }}
            variant="contained"
            fullWidth
            disabled={userName === ""}
            onClick={handleAuth}
          >
            Authenticate
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
