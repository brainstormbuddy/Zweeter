export const idlFactory = ({ IDL }) => {
  const User = IDL.Record({ 'id' : IDL.Text, 'name' : IDL.Text });
  const Tweet = IDL.Record({
    'id' : IDL.Text,
    'postedAt' : IDL.Int,
    'content' : IDL.Text,
    'user' : User,
    'liked' : IDL.Int,
  });
  const DataFilter = IDL.Record({
    'contains' : IDL.Opt(IDL.Text),
    'startsWith' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'delTweet' : IDL.Func([IDL.Text], [], []),
    'delUser' : IDL.Func([IDL.Text], [], []),
    'getTweet' : IDL.Func([IDL.Text], [IDL.Opt(Tweet)], ['query']),
    'getUser' : IDL.Func([IDL.Text], [IDL.Opt(User)], ['query']),
    'listTweets' : IDL.Func(
        [IDL.Opt(DataFilter)],
        [IDL.Vec(IDL.Tuple(IDL.Text, Tweet))],
        ['query'],
      ),
    'listUsers' : IDL.Func(
        [IDL.Opt(DataFilter)],
        [IDL.Vec(IDL.Tuple(IDL.Text, User))],
        ['query'],
      ),
    'setTweet' : IDL.Func([IDL.Text, Tweet], [], []),
    'setUser' : IDL.Func([IDL.Text, User], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
