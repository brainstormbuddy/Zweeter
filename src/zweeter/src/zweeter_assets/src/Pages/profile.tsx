import { Card, CardHeader, Container } from "@mui/material";
import React = require("react");

export default function Profile() {
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Profile"} />
      </Card>
    </Container>
  );
}