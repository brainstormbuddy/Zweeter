import { adaptV4Theme, Button, Container } from "@mui/material";
import React = require("react");
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
import { zweeter } from "../../../declarations/zweeter";
import { User, DataFilter } from "../../../declarations/zweeter/zweeter.did";
import PostTweet from "../components/postTweet";
import { v4 } from "uuid";

export default function Timeline() {
  async function handleClick() {
    let user: User = {
      name: "Achilles",
      id: "123test",
    };
    await zweeter.setUser("Muriel", user);

    var list = await zweeter.listUsers([]);
    console.log(list);
    var list1 = await zweeter.listTweets([]);
    console.log(list1);
    await zweeter.setTweet(user.name, {
      id: v4(),
      postedAt: BigInt(2),
      content: "Test Tweet",
      userid: user.id,
      liked: BigInt(0),
    });
    list1 = await zweeter.listTweets([]);
    console.log(list1);
    let filter: DataFilter = {
      contains: ["e"],
      startsWith: [],
    };

    var filtered = await zweeter.listUsers([filter]);
    console.log(filtered);
  }

  return (
    <Container maxWidth="xs">
      <PostTweet />
      <Button
        sx={{ margin: "10px 0px" }}
        variant="contained"
        fullWidth
        onClick={handleClick}
      >
        Test
      </Button>
    </Container>
  );
}
