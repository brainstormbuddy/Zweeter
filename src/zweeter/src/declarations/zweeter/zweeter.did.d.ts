import type { Principal } from '@dfinity/principal';
export interface DataFilter {
  'contains' : [] | [string],
  'startsWith' : [] | [string],
}
export interface Tweet {
  'id' : string,
  'postedAt' : bigint,
  'content' : string,
  'user' : User,
  'liked' : bigint,
}
export interface User { 'id' : string, 'name' : string }
export interface _SERVICE {
  'delTweet' : (arg_0: string) => Promise<undefined>,
  'delUser' : (arg_0: string) => Promise<undefined>,
  'getTweet' : (arg_0: string) => Promise<[] | [Tweet]>,
  'getUser' : (arg_0: string) => Promise<[] | [User]>,
  'listTweets' : (arg_0: [] | [DataFilter]) => Promise<Array<[string, Tweet]>>,
  'listUsers' : (arg_0: [] | [DataFilter]) => Promise<Array<[string, User]>>,
  'setTweet' : (arg_0: string, arg_1: Tweet) => Promise<undefined>,
  'setUser' : (arg_0: string, arg_1: User) => Promise<undefined>,
}
