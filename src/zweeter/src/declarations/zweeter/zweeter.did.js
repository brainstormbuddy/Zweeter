export const idlFactory = ({ IDL }) => {
  const Tweet = IDL.Record({
    'id' : IDL.Text,
    'postedAt' : IDL.Int,
    'content' : IDL.Text,
    'user' : IDL.Text,
    'liked' : IDL.Int,
  });
  const User = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const Zweeter = IDL.Service({
    '_constructTweetId' : IDL.Func([IDL.Principal, IDL.Text], [IDL.Text], []),
    '_getTweetById' : IDL.Func([IDL.Text], [IDL.Opt(Tweet)], ['query']),
    '_listTweets' : IDL.Func(
        [IDL.Opt(IDL.Text)],
        [IDL.Vec(IDL.Tuple(IDL.Text, Tweet))],
        ['query'],
      ),
    'delTweet' : IDL.Func([IDL.Text], [], []),
    'delUser' : IDL.Func([], [], []),
    'getTweet' : IDL.Func([IDL.Text], [IDL.Opt(Tweet)], []),
    'getUser' : IDL.Func([], [IDL.Opt(User)], []),
    'getUserById' : IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'listAllTweets' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Tweet))], []),
    'listMyTweets' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, Tweet))], []),
    'setTweet' : IDL.Func([IDL.Text, Tweet], [], []),
    'setUser' : IDL.Func([User], [], []),
  });
  return Zweeter;
};
export const init = ({ IDL }) => { return []; };
