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
import { useState, useContext, useEffect } from "react";
import { AccountCircle } from "@mui/icons-material/";
import { _SERVICE } from "../../../declarations/zweeter/zweeter.did";
import { AppContext } from "../App";
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
const pagesInit = [
  { title: "Home", link: "/home" },
  { title: "All Zweets", link: "/timeline" },
  { title: "My Account", link: "/account" },
];

export default function MenuBar() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [pages, setPages] = useState([]);
  const { hasLoggedIn, logout, actorName } = useContext(AppContext);
  const handleLogout = () => {
    logout();
    setPages([]);
    navigate("/");
  };

  useEffect(() => {
    if (actorName && actorName !== "") setPages(pagesInit);
  }, [actorName]);

  useEffect(() => {
    if (!hasLoggedIn) {
      navigate("/");
    }
  }, [hasLoggedIn]);
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
            {hasLoggedIn && (
              <>
                <Typography
                  sx={{ marginTop: "20px" }}
                  onClick={() => navigate("/account")}
                >
                  {actorName}
                </Typography>
                <Tooltip title="logout">
                  <IconButton
                    size="large"
                    onClick={handleLogout}
                    color="inherit"
                  >
                    <AccountCircle
                      sx={{
                        color: "#FFF",
                        fontSize: "1.2em",
                        marginRight: "10px",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
      <Outlet />
    </>
  );
}
