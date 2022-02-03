import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { makeStyles } from "@material-ui/styles";

import React = require("react");
const useStyles = makeStyles(() => ({
  toolbar: {
    height: 64,
    marginBottom: "20px",
  },
}));
const pagesInit = [{ title: "Home", link: "/" }];

export default function MenuBar() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [pages, setPages] = useState(pagesInit);

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
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
      <Outlet />
    </>
  );
}
