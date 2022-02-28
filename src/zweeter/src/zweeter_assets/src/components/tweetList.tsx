import {
  Alert,
  AlertColor,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React = require("react");
import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AppContext } from "../App";
import { useContext, useEffect, useState } from "react";

const DEFAULT_TRANSFER_AMOUNT = 110000; //Transfer of 100000 + 10000 tip.
export default function TweetList(props) {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState<AlertColor>("success");
  const [message, setMessage] = React.useState("");

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const tweets = props.tweets;
  const { actor, invoiceActor } = useContext(AppContext);
  const [transfering, setTransfering] = useState(false);
  const likeTweet = async (tweetID: string, userid: string) => {
    await actor?.likeTweet(tweetID, userid);
    props.updateTweets();
  };
  const dislikeTweet = async (tweetID: string, userid: string) => {
    await actor?.dislikeTweet(tweetID, userid);
    props.updateTweets();
  };

  const displaySnackbar = (severity, message) => {
    setMessage(message);
    setSeverity(severity);
    setSnackbarOpen(true);
  };

  const tipTweet = async (accountId: string) => {
    if (!transfering) {
      setTransfering(true);
      let balance = await invoiceActor?.get_balance({
        token: {
          symbol: "ICP",
        },
      });
      if ("ok" in balance) {
        let result = await invoiceActor?.transfer({
          amount: BigInt(DEFAULT_TRANSFER_AMOUNT),
          token: {
            symbol: "ICP",
          },
          destination: {
            text: accountId,
          },
        });
        if ("ok" in result)
          displaySnackbar(
            "success",
            `Transfer successful. Current balance is ${
              Number(balance.ok.balance) - DEFAULT_TRANSFER_AMOUNT
            }`
          );
        else displaySnackbar("error", result.err.message);
      } else displaySnackbar("error", "Something went wrong!");
      setTransfering(false);
    } else displaySnackbar("warning", "You can only tip one zweet at a time!");
  };

  return (
    <Container maxWidth="md">
      <Snackbar
        key={message}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      {props.loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "5vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {tweets.map(([id, tweet, liked]) => {
              return (
                <div key={tweet.id + "cont"}>
                  <ListItem
                    alignItems="flex-start"
                    key={tweet.id}
                    sx={{ pb: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
                        {tweet.user.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" color="text.primary">
                          {tweet.user}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {tweet.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    sx={{ mt: 0, pt: 0 }}
                    justifyContent="space-around"
                  >
                    <Grid item xs={2} sx={{ ml: "20px", padding: 0 }}>
                      <Typography
                        variant={"body2"}
                        sx={{ textAlign: "center", padding: 0 }}
                        component={"span"}
                      >
                        {Number(tweet.liked)}
                      </Typography>
                      {liked ? (
                        <Tooltip title="Remove Like">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              dislikeTweet(tweet.id, tweet.userid);
                            }}
                            sx={{ padding: 0 }}
                          >
                            <FavoriteIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Like">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              likeTweet(tweet.id, tweet.userid);
                            }}
                            sx={{ padding: 0 }}
                          >
                            <FavoriteBorderIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Grid>
                    <Grid item xs={2} sx={{ pt: "0px" }}>
                      <Tooltip title="Tip!">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            tipTweet(tweet.userAccountId);
                          }}
                          sx={{ padding: 0 }}
                        >
                          <VolunteerActivismIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sx={{ pt: "0px" }}>
                      <Divider variant="middle" component="li" />
                    </Grid>
                  </Grid>
                </div>
              );
            })}
          </List>
        </>
      )}
    </Container>
  );
}
