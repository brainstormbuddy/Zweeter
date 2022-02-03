import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React = require("react");
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
import handleAuthenticated from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Authed() {
  const [authActor, setAuthActor] = useState<ActorSubclass<_SERVICE>>();
  const [authC, setAuthC] = useState<AuthClient>();
  const [auth, setAuth] = useState<string>();
  const navigate = useNavigate();

  const handleLogout = () => {
    authC.logout().then(() => {
      navigate("/");
    });
  };
  useEffect(() => {
    AuthClient.create().then((res) => {
      setAuthC(res);
      res.isAuthenticated().then((authed) => {
        if (authed)
          handleAuthenticated(res).then((authed) => {
            setAuthActor(authed);
          });
      });
    });
  }, []);

  useEffect(() => {
    authActor?.whoami().then((res) => {
      setAuth(res.toString());
    });
  }, [authActor]);

  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Internet Identity"} />
        <CardContent sx={{ textAlign: "center" }}>
          <>
            <Typography variant={"h6"}>You are authenticated</Typography>
            {auth ? (
              <>
                <Typography variant={"h6"}>{"With the ID: " + auth}</Typography>
                <Button
                  sx={{ margin: "10px 0px" }}
                  variant="contained"
                  fullWidth
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <CircularProgress />
            )}
          </>
        </CardContent>
      </Card>
    </Container>
  );
}
