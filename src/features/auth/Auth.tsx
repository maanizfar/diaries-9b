import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../interfaces/user.interface";
import * as Yup from "yup";
import http from "../../services/api";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./userSlice";
import { AuthResponse } from "../../services/mirage/routes/user";
import { useAppDispatch } from "../../store";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(/images/diaries.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const schema = Yup.object().shape({
  username: Yup.string()
    .required("What? No username?")
    .max(16, "Username cannot be longer than 16 characters"),
  password: Yup.string().required('Without a password, "None shall pass!"'),
  email: Yup.string().email("Please provide a valid email address (abc@xy.z)"),
});

const Auth: FC = () => {
  const classes = useStyles();

  const { handleSubmit, register, errors } = useForm<User>({
    validationSchema: schema,
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? "/auth/login" : "/auth/signup";
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Box mb={5}>
            <Typography
              component="h1"
              variant="h4"
              color="secondary"
              gutterBottom
            >
              DEAR DIARY!
            </Typography>
          </Box>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Sign in" : "Create Account"}
          </Typography>
          <form onSubmit={handleSubmit(submitForm)} className="signin-form">
            <div className="inputWrapper">
              <input ref={register} name="username" placeholder="Username" />
              {errors && errors.username && (
                <p className="error">{errors.username.message}</p>
              )}
            </div>

            <div className="inputWrapper">
              <input
                ref={register}
                name="password"
                type="password"
                placeholder="Password"
              />
              {errors && errors.password && (
                <p className="error">{errors.password.message}</p>
              )}
            </div>

            {!isLogin && (
              <div className="inputWrapper">
                <input
                  ref={register}
                  name="email"
                  placeholder="Email (optional)"
                />
                {errors && errors.email && (
                  <p className="error">{errors.email.message}</p>
                )}
              </div>
            )}

            <div className="inputWrapper">
              <Button
                type="submit"
                disabled={loading}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {isLogin ? "Login" : "Create account"}
              </Button>
            </div>
            <Link href="#" variant="body2" onClick={() => setIsLogin(!isLogin)}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account?"}
            </Link>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
