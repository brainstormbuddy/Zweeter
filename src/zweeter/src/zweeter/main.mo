import Int = "mo:base/Int";
import Iter "mo:base/Iter";
import Time = "mo:base/Time";
import Principal "mo:base/Principal";
import DataStore "./store";
// https://levelup.gitconnected.com/a-simple-keyval-store-implemented-in-motoko-f8ba5af43618
// this will be the basis for our data model.
// the key will always start with the current userId and then a random identifier should be added
// for example we set the user with setUser("wr2vh-ou7gv-cq623-6oxpi-2x3bp-k3hbl-5zhvf-66p3h-upq62-pcmde-fqe_abbcddeff", USERDATA)
// and then we can use the listUsers method to query user data by keyStartsWith(USERID)
actor class Zweeter() {
    // user store
    type User = {
        name: Text;
        id: Text;
    };
    private let userStore: DataStore.DataStore<User> = DataStore.DataStore<User>();
    private stable var userEntries : [(Text, User)] = [];
    public shared (message) func getUser() : async (?User) {
        let id = Principal.toText(message.caller);
        return await getUserById(id);        
    };
    public shared (message) func delUser() : async () {
        let id = Principal.toText(message.caller);
        let entry: ?User =userStore.del(id);
    };
    public shared (message) func setUser(data: User) : async () {
        let id = Principal.toText(message.caller);
        userStore.put(id, data);
    };
    // those should be private but it is not yet supported
    public query func getUserById(id: Text) : async (?User) {
        let entry: ?User = userStore.get(id);
        return entry;
    };
    // end of user store
    // Tweet store
    type Tweet = {
        content: Text;
        id: Text;
        user: Text;
        userid: Text;
        liked: Int;
        postedAt: Int;
    };
    private let tweetStore: DataStore.DataStore<Tweet> = DataStore.DataStore<Tweet>();
    private stable var tweetEntries : [(Text, Tweet)] = [];
    public shared (message) func getTweet(key: Text) : async (?Tweet) {
        let id = await _constructTweetId(message.caller, key);
        return await _getTweetById(id);
    };
    public shared (message) func setTweet(key: Text, tweet: Tweet) : async () {
        let id = await _constructTweetId(message.caller, key);
        let updatedTweet: Tweet = {
                        content = tweet.content;
                        id = tweet.id;
                        user = tweet.user;
                        userid = Principal.toText(message.caller);
                        liked = 0;
                        postedAt = tweet.postedAt;
                    };
        tweetStore.put(id, updatedTweet);
    };
    public shared (message) func delTweet(key: Text) : async () {
        let id = await _constructTweetId(message.caller, key);
        let entry: ?Tweet = tweetStore.del(id);
    };
    public func _constructTweetId(caller: Principal, key: Text): async Text {
        let id = Principal.toText(caller);
        let temp = "" # id # "-" # key # "";
        return temp;
    };
    public func _constructTweetIdByText(user: Text, key: Text): async Text {
        let temp = "" # user # "-" # key # "";
        return temp;
    };
    public query func _getTweetById(id: Text) : async (?Tweet) {
        let entry: ?Tweet = tweetStore.get(id);
        return entry;
    };
    public query func _listTweets(filter: ?Text) : async [(Text, Tweet)] {
        let results: [(Text, Tweet)] = tweetStore.list(filter);
        return results;
    };
    public shared (message) func listMyTweets() : async [(Text, Tweet)] {
        let id = Principal.toText(message.caller);
        return await _listTweets(?id);
    };
    public shared (message) func listAllTweets() : async [(Text, Tweet)] {
        return await _listTweets(null);
    };
    // end of tweet store
    // liked tweets store
    type LikedUserTweet = {
        userid: Text;
        tweetid: Text;
    };
    private let LikedUserTweetStore: DataStore.DataStore<LikedUserTweet> = DataStore.DataStore<LikedUserTweet>();
    private stable var LikedUserTweetEntries : [(Text, LikedUserTweet)] = [];
    public shared (message) func listMyLikedTweets() : async [(Text, LikedUserTweet)] {
        let id = Principal.toText(message.caller);
        let results: [(Text, LikedUserTweet)] = LikedUserTweetStore.list(?id);
        return results;
    };
    public shared (message) func likeTweet(key: Text, userid: Text) : async () {
        let id = await _constructTweetIdByText(userid, key);
        let tweet: ?Tweet = tweetStore.get(id);
        switch (tweet) {
                case null {
                    return;
                };
                case (?tweet) {
                    let updatedTweet: Tweet = {
                        content = tweet.content;
                        id = tweet.id;
                        user = tweet.user;
                        userid = tweet.userid;
                        liked = tweet.liked + 1;
                        postedAt = tweet.postedAt;
                    };                    
                    tweetStore.put(id, updatedTweet);
                    let likedTweet : LikedUserTweet = {
                        userid = Principal.toText(message.caller);
                        tweetid = id;
                    };
                    let callerTwitterId = await _constructTweetId(message.caller, key);
                    LikedUserTweetStore.put(callerTwitterId, likedTweet);
                };
            };
    };
    public shared (message) func dislikeTweet(key: Text, userid: Text) : async () {
        let id = await _constructTweetIdByText(userid, key);
        let tweet: ?Tweet = tweetStore.get(id);
        switch (tweet) {
                case null {
                    return;
                };
                case (?tweet) {
                    let updatedTweet: Tweet = {
                        content = tweet.content;
                        id = tweet.id;
                        user = tweet.user;
                        userid = tweet.userid;
                        liked = tweet.liked - 1;
                        postedAt = tweet.postedAt;
                    };
                    tweetStore.put(id, updatedTweet);
                    let callerTwitterId = await _constructTweetId(message.caller, key);
                    let entry: ?LikedUserTweet = LikedUserTweetStore.del(callerTwitterId);
                };
            };
    };
    // end of liked user tweets store
    system func preupgrade() {
        userEntries := Iter.toArray(userStore.preupgrade().entries());
        tweetEntries := Iter.toArray(tweetStore.preupgrade().entries());
        LikedUserTweetEntries := Iter.toArray(LikedUserTweetStore.preupgrade().entries());
    };
    system func postupgrade() {
        userStore.postupgrade(userEntries);
        userEntries := [];
        tweetStore.postupgrade(tweetEntries);
        tweetEntries := [];
        LikedUserTweetStore.postupgrade(LikedUserTweetEntries);
        LikedUserTweetEntries := [];
    };
};