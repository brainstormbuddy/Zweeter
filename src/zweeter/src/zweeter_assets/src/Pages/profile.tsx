import { Container } from "@mui/material";
import React = require("react");
import { zweeter } from "../../../declarations/zweeter";
import { Tweet } from "../../../declarations/zweeter/zweeter.did";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TweetList from "../components/tweetList";

export default function Profile() {
  const [tweets, setTweets] = useState<[String, Tweet][]>([]);
  const navigate = useNavigate();
  const urlParams = useParams();
  const profileName = urlParams.profileName || "";
  const updateTweets = useCallback(async () => {
    const tweetList = await zweeter.listMyTweets();
    setTweets(
      tweetList.sort((a, b) => Number(b[1].postedAt) - Number(a[1].postedAt))
    );
  }, []);

  useEffect(() => {
    if (profileName === "") navigate("/home");
    else {
      updateTweets();
    }
  }, [updateTweets, profileName]);

  return (
    <Container maxWidth="xs">
      <TweetList tweets={tweets} />
    </Container>
  );
}
