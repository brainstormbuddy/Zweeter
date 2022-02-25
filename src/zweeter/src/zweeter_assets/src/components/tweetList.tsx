import {
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
  Tooltip,
  Typography,
} from "@mui/material";
import React = require("react");
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { AppContext } from "../App";
import { useContext, useEffect } from "react";
export default function TweetList(props) {
  const tweets = props.tweets;
  const { actor, invoiceActor, principal } = useContext(AppContext);
  const likeTweet = async (tweetID: string, userid: string) => {
    await actor?.likeTweet(tweetID, userid);
    props.updateTweets();
  };
  const dislikeTweet = async (tweetID: string, userid: string) => {
    await actor?.dislikeTweet(tweetID, userid);
    props.updateTweets();
  };

  const transferBalance = async () => {
    let balance = await invoiceActor.get_balance({
      token: {
        symbol: "ICP",
      },
    });
    if ("ok" in balance) {
      let amount = balance.ok.balance;
      if (amount > 0) {
        // Transfer full balance back to the balance holder
        let result = await invoiceActor.transfer({
          amount,
          token: {
            symbol: "ICP",
          },
          destination: {
            text: "cd60093cef12e11d7b8e791448023348103855f682041e93f7d0be451f48118b",
          },
        });
        return result;
      }
    }
  };

  const tipTweet = async () => {
    const balance = await invoiceActor.get_balance({
      token: {
        symbol: "ICP",
      },
    });

    console.log(balance);
    const accountIdentifier = await invoiceActor.get_account_id();

    console.log(accountIdentifier);
  };
  return (
    <Container maxWidth="md">
      {props.loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "5vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Button onClick={tipTweet}>Tip Test</Button>
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
                    spacing={1}
                    sx={{ mt: 0, pt: 0 }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{ mt: 0, mx: "20px", padding: 0 }}
                      justifyContent={"space-around"}
                    >
                      <Typography
                        variant={"body2"}
                        sx={{ textAlign: "center" }}
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
                    <Grid item xs={12}>
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
