import { Button, Container, TextField } from "@mui/material";
import React = require("react");
import { zweeter } from "../../../declarations/zweeter";
import { useAppSelector } from "../store/hooks";
import { v4 } from "uuid";
import { useState } from "react";

export default function PostTweet() {
  const userId = useAppSelector((state) => state.authReducer.id);
  const userName = useAppSelector((state) => state.authReducer.name);
  const [tweetContent, setTweetContent] = useState("");

  async function handleClick() {
    await zweeter.setTweet(userName, {
      id: v4(),
      postedAt: BigInt(2),
      content: tweetContent,
      userid: userId,
      liked: BigInt(0),
    });
    let list1 = await zweeter.listTweets([]);
    console.log(list1);
  }

  return (
    <Container maxWidth="xs">
      <TextField
        multiline
        rows={4}
        fullWidth
        placeholder="What's on your mind?"
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
