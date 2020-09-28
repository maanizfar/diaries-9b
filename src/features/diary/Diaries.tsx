import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../services/api";
import { Diary } from "../../interfaces/diary.interface";
import { addDiary } from "./diariesSlice";
import Swal, { SweetAlertResult } from "sweetalert2";
import { setUser } from "../auth/userSlice";
import DiaryTile from "./DiaryTile";
import { User } from "../../interfaces/user.interface";
import { useAppDispatch } from "../../store";
import dayjs from "dayjs";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: "white",
  },
  toolBarWrapper: {
    background: "linear-gradient(to right,#4b525b,#363c42)",
    padding: theme.spacing(2),
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

const Diaries: FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: RootState) => state.diaries);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchDiaries = async () => {
      if (user) {
        http.get<null, Diary[]>(`diaries/${user.id}`).then((data) => {
          if (data && data.length > 0) {
            const sortedByUpdatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortedByUpdatedAt));
          }
        });
      }
    };

    fetchDiaries();
  }, [dispatch, user]);

  const createDiary = async () => {
    const result: SweetAlertResult = await Swal.mixin({
      input: "text",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2"],
    }).queue([
      {
        titleText: "Diary title",
        input: "text",
      },
      {
        titleText: "Private or public diary?",
        input: "radio",
        inputOptions: {
          private: "Private",
          public: "Public",
        },
        inputValue: "private",
      },
    ]);
    if (result.value) {
      const { value } = result;
      const { diary, user: _user } = await http.post<
        Partial<Diary>,
        { diary: Diary; user: User }
      >("/diaries/", {
        title: value[0],
        type: value[1],
        userId: user?.id,
      });
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));

        return Swal.fire({
          titleText: "All done!",
          confirmButtonText: "OK!",
        });
      }
    }
    Swal.fire({
      titleText: "Cancelled",
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.toolBarWrapper}>
        <Container className={classes.toolBar}>
          <Typography component="p" variant="body1">
            Displaying {diaries.length} diaries
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={createDiary}
            style={{ maxWidth: "200px" }}
          >
            Create New
          </Button>
        </Container>
      </div>

      <Grid container spacing={2} style={{ padding: "12px" }}>
        {diaries.map((diary, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <DiaryTile diary={diary} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Diaries;
