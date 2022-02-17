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
import PostTweet from "../components/postTweet";
export default function AllTweets() {
  const [tweetsWithLike, setTweetsWithLike] = useState<
    [String, Boolean, Tweet][]
  >([]);
  const [loading, setLoading] = useState(true);
  const { actor, hasLoggedIn } = useContext(AppContext);
  const unifyTweets = (
    tweetList: [String, Tweet][],
    likedTweetList: [String, LikedUserTweet][]
  ) => {
    const list: [String, Boolean, Tweet][] = [];
    const collection = new Map(likedTweetList);
    tweetList.map((tweet) => {
      if (collection.get(tweet[0])) {
        list.push([tweet[0], true, tweet[1]]);
      } else {
        list.push([tweet[0], false, tweet[1]]);
      }
    });
    setTweetsWithLike(
      list.sort((a, b) => Number(b[2].postedAt) - Number(a[2].postedAt))
    );
  };
  const updateTweets = useCallback(async () => {
    setLoading(true);
    let [tweetList, likedTweetList] = await Promise.all([
      actor?.listMyTweets(),
      actor?.listMyLikedTweets(),
    ]);
    console.log(likedTweetList, tweetList);
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
      <PostTweet updateTweets={updateTweets} />
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
