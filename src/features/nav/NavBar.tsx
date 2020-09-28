import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },

  logo: {
    textDecoration: "none",
    color: "white",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.user);

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar className={classes.container}>
          <Link to="/">
            <Typography className={classes.logo} variant="h6">
              Dear Diary!
            </Typography>
          </Link>
          <Typography variant="h6">
            Welcome, {isLoggedIn && user?.username}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
