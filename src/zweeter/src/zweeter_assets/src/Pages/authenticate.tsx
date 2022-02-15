import { AuthClient } from "@dfinity/auth-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import React = require("react");
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { v4 } from "uuid";
import { setInfo } from "../store/authenticationSlice";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/zweeter/zweeter.did";
import { AppContext } from "../App";

export default function Authenticate() {
  const navigate = useNavigate();
  const principal = useAppSelector((state) => state.authReducer.principal);
  const name = useAppSelector((state) => state.authReducer.name);
  const [authActor, setAuthActor] = useState<ActorSubclass<_SERVICE>>();
  const { hasLoggedIn, login } = useContext(AppContext);
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (hasLoggedIn) {
      dispatch(setInfo({ name: userName, id: v4() }));
      navigate("/home");
    }
  }, [hasLoggedIn]);
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
            onClick={login}
          >
            Authenticate
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
