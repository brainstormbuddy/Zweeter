import { Button, Container, TextField } from "@mui/material";
import React = require("react");
import { zweeter } from "../../../declarations/zweeter";
import { useAppSelector } from "../store/hooks";
import { v4 } from "uuid";
import { useState } from "react";

export default function PostTweet(props) {
  const userId = useAppSelector((state) => state.authReducer.id);
  const userName = useAppSelector((state) => state.authReducer.name);
  const [tweetContent, setTweetContent] = useState("");

  async function handleClick() {
    const tweetID = userName + "_" + v4();
    await zweeter.setTweet(tweetID, {
      id: v4(),
      postedAt: BigInt(Date.now()),
      content: tweetContent,
      user: { id: userId, name: userName },
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
