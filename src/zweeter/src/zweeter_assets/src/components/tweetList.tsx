import {
  Avatar,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React = require("react");
import { useNavigate } from "react-router-dom";

export default function TweetList(props) {
  const tweets = props.tweets;
  return (
    <Container maxWidth="md">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {tweets.map(([id, tweet]) => {
          return (
            <div key={tweet.id + "cont"}>
              <ListItem alignItems="flex-start" key={tweet.id}>
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
              <Divider variant="inset" component="li" />
            </div>
          );
        })}
      </List>
    </Container>
  );
}
