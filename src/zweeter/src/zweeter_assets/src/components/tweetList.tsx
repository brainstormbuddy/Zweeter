import {
  Avatar,
  Box,
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
  useEffect(() => {}, [tweets]);

  const { actor } = useContext(AppContext);

  const likeTweet = async (tweetID: string, userid: string) => {
    console.log(tweetID, userid);
    await actor?.likeTweet(tweetID, userid);
    props.updateTweets();
  };
  const dislikeTweet = async (tweetID: string, userid: string) => {
    await actor?.dislikeTweet(tweetID, userid);
    props.updateTweets();
  };
  return (
    <Container maxWidth="md">
      {props.loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: "5vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {tweets.map(([id, liked, tweet]) => {
            return (
              <div key={tweet.id + "cont"}>
                <ListItem alignItems="flex-start" key={tweet.id} sx={{ pb: 0 }}>
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
      )}
    </Container>
  );
}
