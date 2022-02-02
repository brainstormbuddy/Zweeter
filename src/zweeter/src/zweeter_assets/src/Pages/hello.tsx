import { useState } from "react";
import { zweeter } from "../../../declarations/zweeter";
import React = require("react");
import { Button, Container, Grid, TextField, Typography } from "@mui/material";

export default function Hello() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  async function doGreet() {
    const greeting = await zweeter.greet(name);
    setMessage(greeting);
  }

  return (
    <>
      <Container maxWidth="xs">
        <Grid container spacing={2} direction="row">
          <Grid item xs={12}>
            <TextField
              type="text"
              placeholder="Your Name"
              margin="none"
              onChange={(ev) => setName(ev.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{ margin: "10px 0px" }}
              variant="contained"
              size="large"
              color="primary"
              onClick={doGreet}
            >
              Get Greeting!
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h4"}>{message}</Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
