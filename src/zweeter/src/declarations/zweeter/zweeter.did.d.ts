import type { Principal } from '@dfinity/principal';
export interface LikedUserTweet { 'userid' : string, 'tweetid' : string }
export interface Tweet {
  'id' : string,
  'postedAt' : bigint,
  'content' : string,
  'user' : string,
  'liked' : bigint,
}
export interface User { 'id' : string, 'name' : string }
export interface Zweeter {
  '_constructTweetId' : (arg_0: Principal, arg_1: string) => Promise<string>,
  '_getTweetById' : (arg_0: string) => Promise<[] | [Tweet]>,
  '_listTweets' : (arg_0: [] | [string]) => Promise<Array<[string, Tweet]>>,
  'delTweet' : (arg_0: string) => Promise<undefined>,
  'delUser' : () => Promise<undefined>,
  'dislikeTweet' : (arg_0: string) => Promise<undefined>,
  'getTweet' : (arg_0: string) => Promise<[] | [Tweet]>,
  'getUser' : () => Promise<[] | [User]>,
  'getUserById' : (arg_0: string) => Promise<[] | [User]>,
  'likeTweet' : (arg_0: string) => Promise<undefined>,
  'listAllTweets' : () => Promise<Array<[string, Tweet]>>,
  'listMyLikedTweets' : () => Promise<Array<[string, LikedUserTweet]>>,
  'listMyTweets' : () => Promise<Array<[string, Tweet]>>,
  'setTweet' : (arg_0: string, arg_1: Tweet) => Promise<undefined>,
  'setUser' : (arg_0: User) => Promise<undefined>,
}
export interface _SERVICE extends Zweeter {}
