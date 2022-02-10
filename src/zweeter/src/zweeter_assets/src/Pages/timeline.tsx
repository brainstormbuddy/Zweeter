import { Container } from "@mui/material";
import React = require("react");
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
import { zweeter } from "../../../declarations/zweeter";
import { Tweet } from "../../../declarations/zweeter/zweeter.did";
import PostTweet from "../components/postTweet";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import TweetList from "../components/tweetList";

export default function Timeline() {
  const [tweets, setTweets] = useState<[String, Tweet][]>([]);
  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.authReducer.name);
  const updateTweets = useCallback(async () => {
    const tweetList = await zweeter.listTweets([
      {
        contains: [],
        startsWith: [],
      },
    ]);
    setTweets(
      tweetList.sort((a, b) => Number(b[1].postedAt) - Number(a[1].postedAt))
    );
  }, []);

  useEffect(() => {
    if (userName === "") navigate("/");
    else {
      updateTweets();
    }
  }, [updateTweets, userName]);

  return (
    <Container maxWidth="xs">
      <PostTweet updateTweets={updateTweets} />
      <TweetList tweets={tweets} />
    </Container>
  );
}
