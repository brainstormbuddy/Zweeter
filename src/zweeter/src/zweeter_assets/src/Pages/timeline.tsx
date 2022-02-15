import { Container } from "@mui/material";
import React = require("react");
import { _SERVICE, Tweet } from "../../../declarations/zweeter/zweeter.did";
import PostTweet from "../components/postTweet";
import { useCallback, useContext, useEffect, useState } from "react";
import TweetList from "../components/tweetList";
import { AppContext } from "../App";
export default function Timeline() {
  const [tweets, setTweets] = useState<[String, Tweet][]>([]);
  const { actor, hasLoggedIn } = useContext(AppContext);
  const updateTweets = useCallback(async () => {
    const tweetList = await actor?.listMyTweets();
    setTweets(
      tweetList.sort((a, b) => Number(b[1].postedAt) - Number(a[1].postedAt))
    );
  }, [actor]);
  useEffect(() => {
    if (actor) {
      updateTweets();
    }
  }, [updateTweets, actor, hasLoggedIn]);
  return (
    <Container maxWidth="xs">
      <PostTweet updateTweets={updateTweets} />
      {tweets && <TweetList tweets={tweets} />}
    </Container>
  );
}
