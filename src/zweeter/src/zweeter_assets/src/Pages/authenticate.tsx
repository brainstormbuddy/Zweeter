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
  const { hasLoggedIn, login, actorName, setName, actor, invoiceActor } =
    useContext(AppContext);
  const [username, setUsername] = useState("");

  const setUser = async () => {
    if (username !== "") {
      const id = v4();
      var accountId = await invoiceActor.get_account_id();
      console.log(accountId);
      actor?.setUser({ name: username, id, accountid: accountId }).then(() => {
        setName(username);
        navigate("/home");
      });
    }
  };

  useEffect(() => {
    if (hasLoggedIn && actorName !== "" && actorName) {
      navigate("/home");
    }
  }, [hasLoggedIn, actorName]);
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Authenticate"} />
        <CardContent>
          {hasLoggedIn ? (
            actorName === "" ? (
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
