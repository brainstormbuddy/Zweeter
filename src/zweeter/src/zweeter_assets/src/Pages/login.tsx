import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
} from "@mui/material";
import React = require("react");

export default function Login() {
  return (
    <Container maxWidth="xs">
      <Card>
        <CardHeader sx={{ textAlign: "center" }} title={"Log In"} />
        <CardContent>
          <TextField
            fullWidth
            type="text"
            placeholder="Internet Identity"
            margin="none"
          />
          <Button
            sx={{ margin: "10px 0px" }}
            variant="contained"
            size="large"
            color="primary"
            fullWidth
          >
            Authenticate
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
