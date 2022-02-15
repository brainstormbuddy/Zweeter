import { AuthClient } from "@dfinity/auth-client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import React = require("react");
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { _SERVICE } from "../../../declarations/zweeter/zweeter.did";
import { AppContext } from "../App";

export default function Authenticate() {
  const navigate = useNavigate();
  const { hasLoggedIn, login, actorName, setName, actor } =
    useContext(AppContext);
  const [username, setUsername] = useState("");
  const [searched, setSearched] = useState(false);

  const getUser = async () => {
    const user = await actor?.getUser();
    if (user[0]) {
      setName(user[0].name);
      navigate("/home");
    }
    setSearched(true);
  };
  const setUser = () => {
    if (username !== "") {
      const id = v4();
      actor?.setUser({ name: username, id }).then(() => {
        setName(username);
        navigate("/home");
      });
    }
  };

  useEffect(() => {
    if (hasLoggedIn) {
      getUser();
    }
  }, [hasLoggedIn, actorName]);
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader
          sx={{ textAlign: "center" }}
          title={hasLoggedIn && !searched ? "Authenticating" : "Authenticate"}
        />
        <CardContent>
          {hasLoggedIn ? (
            searched ? (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <Button
                  sx={{ margin: "10px 0px" }}
                  variant="contained"
                  fullWidth
                  onClick={setUser}
                >
                  Set Username
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            )
          ) : (
            <Button
              sx={{ margin: "10px 0px" }}
              variant="contained"
              fullWidth
              onClick={login}
            >
              Authenticate
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
