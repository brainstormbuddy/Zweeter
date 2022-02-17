import { Button, Container, TextField } from "@mui/material";
import React = require("react");
import { v4 } from "uuid";
import { useState, useContext } from "react";
import { AppContext } from "../App";

export default function PostTweet(props) {
  const [tweetContent, setTweetContent] = useState("");
  const { actor, actorName } = useContext(AppContext);
  async function handleClick() {
    let id = v4();
    await actor?.setTweet(id, {
      id: id,
      postedAt: BigInt(Date.now()),
      content: tweetContent,
      user: actorName,
      userid: "",
      liked: BigInt(0),
    });
    props.updateTweets();
    setTweetContent("");
  }

  return (
    <Container maxWidth="md">
      <TextField
        multiline
        rows={4}
        fullWidth
        value={tweetContent}
        placeholder="What's Happening?"
        onChange={(event) => {
          setTweetContent(event.target.value);
        }}
      />
      <Button
        sx={{ margin: "10px 0px" }}
        variant="contained"
        fullWidth
        onClick={handleClick}
      >
        Tweet
      </Button>
    </Container>
  );
}
