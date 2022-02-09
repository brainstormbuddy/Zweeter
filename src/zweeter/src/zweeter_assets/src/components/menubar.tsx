import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import React = require("react");
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { login, logout } from "../store/authenticationSlice";
import { AccountCircle, Login } from "@mui/icons-material/";
import { AuthClient } from "@dfinity/auth-client";
import handleAuthenticated from "../utils/auth";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/whoami/whoami.did";
const useStyles = makeStyles(() => ({
  toolbar: {
    height: 64,
    marginBottom: "20px",
  },
  profile: {
    "justify-content": "flex-end",
    display: "flex",
    flexGrow: 1,
  },
}));
const pagesInit = [{ title: "Home", link: "/" }];

export default function MenuBar() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [pages, setPages] = useState(pagesInit);
  const [authC, setAuthC] = useState<AuthClient>();
  const [authActor, setAuthActor] = useState<ActorSubclass<_SERVICE>>();
  //const principal = useAppSelector((state) => state.authReducer.principal);

  const loggedIn = useAppSelector((state) => state.authReducer.loggedIn);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleAuth = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authC.login({
      onSuccess: async () => {
        handleAuthenticated(authC).then((authed) => {
          setAuthActor(authed);
          navigate("/home");
        });
      },
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/#authorize"
          : process.env.LOCAL_II_CANISTER,
      // Maximum authorization expiration is 8 days
      maxTimeToLive: days * hours * nanoseconds,
    });
  };

  useEffect(() => {
    AuthClient.create().then((res) => {
      setAuthC(res);
      res.isAuthenticated().then((authed) => {
        if (authed)
          handleAuthenticated(res).then((actor) => {
            setAuthActor(actor);
            navigate("/");
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
    <>
      <AppBar>
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ mx: 4 }}>
            Zweeter
          </Typography>
          {pages.map((page) => (
            <Button
              sx={{ color: "white" }}
              key={page.title}
              onClick={() => navigate(page.link)}
            >
              {page.title}
            </Button>
          ))}
          <div className={classes.profile}>
            {loggedIn && (
              <Tooltip title={"Logout"}>
                <IconButton size="large" onClick={handleLogout} color="inherit">
                  <AccountCircle
                    sx={{
                      color: "#FFF",
                      fontSize: "1.2em",
                      marginRight: "10px",
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
      <Outlet />
    </>
  );
}
