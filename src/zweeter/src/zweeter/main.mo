import Iter "mo:base/Iter";
import Int = "mo:base/Int";
import Time = "mo:base/Time";
import DataStore "./store";

// https://levelup.gitconnected.com/a-simple-keyval-store-implemented-in-motoko-f8ba5af43618
// this will be the basis for our data model.
// the key will always start with the current userId and then a random identifier should be added
// for example we set the user with setUser("wr2vh-ou7gv-cq623-6oxpi-2x3bp-k3hbl-5zhvf-66p3h-upq62-pcmde-fqe_abbcddeff", USERDATA)
// and then we can use the listUsers method to query user data by keyStartsWith(USERID)

actor Zweeter {

    // user store
    type User = {
        name: Text;
        id: Text;
    };
    private let userStore: DataStore.DataStore<User> = DataStore.DataStore<User>();
    private stable var userEntries : [(Text, User)] = [];

    public query func getUser(key: Text) : async (?User) {
        let entry: ?User = userStore.get(key);
        return entry;
    };

    public func setUser(key: Text, data: User) : async () {
        userStore.put(key, data);
    };

    public func delUser(key: Text) : async () {
        let entry: ?User = userStore.del(key);
    };

    public query func listUsers(filter: ?DataStore.DataFilter) : async [(Text, User)] {
        let results: [(Text, User)] = userStore.list(filter);
        return results;
    };

    // end of user store

    // Tweet store

    type Tweet = {
        content: Text;
        id: Text;
        userid: Text;
        liked: Int;
        postedAt: Int;
    };
    private let tweetStore: DataStore.DataStore<Tweet> = DataStore.DataStore<Tweet>();
    private stable var tweetEntries : [(Text, Tweet)] = [];

    public query func getTweet(key: Text) : async (?Tweet) {
        let entry: ?Tweet = tweetStore.get(key);
        return entry;
    };

    public func setTweet(key: Text, data: Tweet) : async () {
        tweetStore.put(key, data);
    };

    public func delTweet(key: Text) : async () {
        let entry: ?Tweet = tweetStore.del(key);
    };

    public query func listTweets(filter: ?DataStore.DataFilter) : async [(Text, Tweet)] {
        let results: [(Text, Tweet)] = tweetStore.list(filter);
        return results;
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
