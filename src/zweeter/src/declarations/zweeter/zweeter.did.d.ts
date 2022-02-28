import type { Principal } from '@dfinity/principal';
export interface LikedUserTweet { 'userid' : string, 'tweetid' : string }
export interface Tweet {
  'id' : string,
  'postedAt' : bigint,
  'content' : string,
  'userid' : string,
  'user' : string,
  'liked' : bigint,
  'userAccountId' : string,
}
export interface User { 'id' : string, 'accountid' : string, 'name' : string }
export interface _SERVICE {
  '_constructTweetId' : (arg_0: Principal, arg_1: string) => Promise<string>,
  '_constructTweetIdByText' : (arg_0: string, arg_1: string) => Promise<string>,
  '_getTweetById' : (arg_0: string) => Promise<[] | [Tweet]>,
  '_listTweets' : (arg_0: [] | [string]) => Promise<Array<[string, Tweet]>>,
  'delTweet' : (arg_0: string) => Promise<undefined>,
  'delUser' : () => Promise<undefined>,
  'dislikeTweet' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'getTweet' : (arg_0: string) => Promise<[] | [Tweet]>,
  'getUser' : () => Promise<[] | [User]>,
  'getUserById' : (arg_0: string) => Promise<[] | [User]>,
  'likeTweet' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'listAllTweets' : () => Promise<Array<[string, Tweet]>>,
  'listMyLikedTweets' : () => Promise<Array<[string, LikedUserTweet]>>,
  'listMyTweets' : () => Promise<Array<[string, Tweet]>>,
  'setTweet' : (arg_0: string, arg_1: Tweet) => Promise<undefined>,
  'setUser' : (arg_0: User) => Promise<undefined>,
}
