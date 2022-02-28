import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React = require("react");
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

export default function MyAccount() {
  const { actorName, principal, accountId, invoiceActor } =
    useContext(AppContext);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const getBalance = useCallback(() => {
    setLoadingBalance(true);
    invoiceActor
      ?.get_balance({
        token: {
          symbol: "ICP",
        },
      })
      .then((balance) => {
        if ("ok" in balance) setBalance(Number(balance.ok.balance));
        setLoadingBalance(false);
      });
  }, []);

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <Container maxWidth="sm">
      <Card sx={{ textAlign: "center" }}>
        <CardHeader title={actorName} />
        <CardContent>
          <Typography>Principal ID</Typography>
          <Typography variant={"body2"} color="text.secondary">
            {principal?.toString()}
          </Typography>
          <Typography>Account ID</Typography>
          <Typography variant={"body2"} color="text.secondary">
            {accountId}
          </Typography>
          <Typography>Balance</Typography>
          {loadingBalance ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: "5px" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant={"body2"} color="text.secondary">
                {`${String(balance).replace(/(.)(?=(\d{3})+$)/g, "$1,")} e8s`}
                <IconButton
                  color="primary"
                  onClick={getBalance}
                  sx={{ padding: 0, mx: "5px" }}
                >
                  <RefreshIcon />
                </IconButton>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
