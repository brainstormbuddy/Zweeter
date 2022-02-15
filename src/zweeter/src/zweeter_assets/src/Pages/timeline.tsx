import { Container } from "@mui/material";
import React = require("react");
import { zweeter } from "../../../declarations/zweeter";
import { _SERVICE, Tweet } from "../../../declarations/zweeter/zweeter.did";
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
    const tweetList = await zweeter.listMyTweets();
    setTweets(
      tweetList.sort((a, b) => Number(b[1].postedAt) - Number(a[1].postedAt))
    );
    console.log(tweetList);
  }, []);
  useEffect(() => {
    if (userName === "") navigate("/");
    else {
      // AuthClient.create().then((res) => {
      //   test(res);
      // });
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