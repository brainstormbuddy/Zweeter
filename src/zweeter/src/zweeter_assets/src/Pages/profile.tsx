import { Container } from "@mui/material";
import React = require("react");
import { zweeter } from "../../../declarations/zweeter";
import { Tweet } from "../../../declarations/zweeter/zweeter.did";
import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TweetList from "../components/tweetList";
import { AppContext } from "../App";

export default function Profile() {
  const [tweets, setTweets] = useState<[String, Tweet][]>([]);
  const navigate = useNavigate();
  const urlParams = useParams();
  const { actor } = useContext(AppContext);
  const profileName = urlParams.profileName || "";
  const updateTweets = useCallback(async () => {
    const tweetList = await actor?.listMyTweets();
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
