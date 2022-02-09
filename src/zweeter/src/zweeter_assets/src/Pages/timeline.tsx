import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React = require("react");
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
import handleAuthenticated from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { zweeter } from "../../../declarations/zweeter";
import { User, DataFilter } from "../../../declarations/zweeter/zweeter.did";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, logout } from "../store/authenticationSlice";
import PostTweet from "../components/postTweet";

export default function Timeline() {
  const [authActor, setAuthActor] = useState<ActorSubclass<_SERVICE>>();
  const [authC, setAuthC] = useState<AuthClient>();
  const principal = useAppSelector((state) => state.authReducer.principal);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    authC.logout().then(() => {
      dispatch(logout());
      navigate("/authenticate");
    });
  };

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
      id: "adasd",
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

  useEffect(() => {
    AuthClient.create().then((res) => {
      setAuthC(res);
      res.isAuthenticated().then((authed) => {
        if (authed)
          handleAuthenticated(res).then((authed) => {
            setAuthActor(authed);
          });
      });
    });
  }, []);

  useEffect(() => {
    authActor?.whoami().then((res) => {
      const principal = res.toString();
      dispatch(login({ principal }));
    });
  }, [authActor]);

  return (
    <Container maxWidth="xs">
      <PostTweet />
    </Container>
  );
}
