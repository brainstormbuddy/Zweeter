import { Container, Typography } from "@mui/material";
import React = require("react");
import {
  _SERVICE,
  Tweet,
  LikedUserTweet,
} from "../../../declarations/zweeter/zweeter.did";
import { useCallback, useContext, useEffect, useState } from "react";
import TweetList from "../components/tweetList";
import { AppContext } from "../App";
export default function AllTweets() {
  const [tweetsWithLike, setTweetsWithLike] = useState<
    [string, Tweet, Boolean][]
  >([]);
  const [loading, setLoading] = useState(true);
  const { actor, hasLoggedIn } = useContext(AppContext);
  const unifyTweets = (
    tweetList: [string, Tweet][],
    likedTweetList: [string, LikedUserTweet][]
  ) => {
    const tweetsWithLike: [string, Tweet, Boolean][] = [];
    const collection = new Map(likedTweetList.map((i) => [i[1].tweetid, i[0]]));
    tweetList.map((tweet) => {
      tweetsWithLike.push([...tweet, !!collection.get(tweet[0])]);
    });
    setTweetsWithLike(
      tweetsWithLike.sort(
        (a, b) => Number(b[1].postedAt) - Number(a[1].postedAt)
      )
    );
  };
  const updateTweets = useCallback(async () => {
    setLoading(true);
    let [tweetList, likedTweetList] = await Promise.all([
      actor?.listAllTweets(),
      actor?.listMyLikedTweets(),
    ]);
    unifyTweets(tweetList, likedTweetList);
    setLoading(false);
  }, [actor]);
  useEffect(() => {
    if (actor) {
      updateTweets();
    }
  }, [updateTweets, actor, hasLoggedIn]);
  return (
    <Container maxWidth="xs">
      {tweetsWithLike ? (
        <TweetList
          tweets={tweetsWithLike}
          updateTweets={updateTweets}
          loading={loading}
        />
      ) : (
        <Typography>No Tweets Found</Typography>
      )}
    </Container>
  );
}
