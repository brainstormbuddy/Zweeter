import { Card, CardHeader, Container } from "@mui/material";
import React = require("react");

export default function Tweet() {
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Tweet"} />
      </Card>
    </Container>
  );
}
