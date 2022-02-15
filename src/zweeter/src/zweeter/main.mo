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
        liked: Int;
        postedAt: Int;
    };
    private let tweetStore: DataStore.DataStore<Tweet> = DataStore.DataStore<Tweet>();
    private stable var tweetEntries : [(Text, Tweet)] = [];

    public shared (message) func getTweet(key: Text) : async (?Tweet) {
        let id = await _constructTweetId(message.caller, key);
        return await _getTweetById(id);
    };

    public shared (message) func setTweet(key: Text, data: Tweet) : async () {
        let id = await _constructTweetId(message.caller, key);
        tweetStore.put(id, data);
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

    // end of tweet store

    system func preupgrade() {
        userEntries := Iter.toArray(userStore.preupgrade().entries());
        tweetEntries := Iter.toArray(tweetStore.preupgrade().entries());
    };

    system func postupgrade() {
        userStore.postupgrade(userEntries);
        userEntries := [];
        tweetStore.postupgrade(tweetEntries);
        tweetEntries := [];
    };
};
