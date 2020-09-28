import React, { FC, useState } from "react";
import { Diary } from "../../interfaces/diary.interface";
import http from "../../services/api";
import { updateDiary } from "./diariesSlice";
import {
  setCanEdit,
  setActiveDiaryId,
  setCurrentlyEditing,
} from "../entry/editorSlice";
import { showAlert } from "../../util";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import ListIcon from "@material-ui/icons/List";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: theme.spacing(2),
    margin: theme.spacing(1),
    overflow: "hidden",
    minHeight: "260px",
  },

  binding: {
    background: "linear-gradient(to right,#4b525b,#363c42)",
  },

  cover: {
    background: "linear-gradient(120deg,#1abd9c,#1697a1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(6),
    position: "relative",

    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2),
    },
  },

  controlsContainer: {
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },

  buttonRoot: {
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    borderRadius: 0,
    boxShadow: "none",
  },

  titleContainer: {
    border: `0px solid ${theme.palette.divider}`,
    borderBottomWidth: "2px",
  },

  addEntryButton: {
    border: `0px solid ${theme.palette.divider}`,
    borderRightWidth: "2px",
  },

  entries: {
    position: "absolute",
    bottom: 5,
    right: "50%",
    transform: "translate(50%, 0)",
  },
}));

interface Props {
  diary: Diary;
}

const DiaryTile: FC<Props> = (props) => {
  const classes = useStyles();

  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const totalEntries = props.diary?.entryIds?.length;

  const saveChanges = () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiary(diary));
          showAlert("Saved!", "success");
        }
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <Grid container className={classes.container}>
      <Grid xs={1} className={classes.binding} item />
      <Grid xs={11} item className={classes.cover}>
        <Grid container className={classes.controlsContainer}>
          <Grid item xs={12} className={classes.titleContainer}>
            <Typography
              component="h3"
              variant="h3"
              align="center"
              color="textSecondary"
              className="title"
              title="Click to edit"
              onClick={() => setIsEditing(true)}
              style={{
                cursor: "pointer",
              }}
            >
              {isEditing ? (
                <input
                  value={diary.title}
                  onChange={(e) => {
                    setDiary({
                      ...diary,
                      title: e.target.value,
                    });
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      saveChanges();
                    }
                  }}
                />
              ) : (
                <span>{diary.title}</span>
              )}
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sm={9}
            className={classes.addEntryButton}
            onClick={() => {
              dispatch(setCanEdit(true));
              dispatch(setActiveDiaryId(diary.id as string));
              dispatch(setCurrentlyEditing(null));
            }}
          >
            <Tooltip title="Add entry" aria-label="add entry">
              <Button
                startIcon={<EditIcon />}
                classes={{
                  root: classes.buttonRoot,
                }}
              >
                <Hidden xsDown>Add Entry</Hidden>
              </Button>
            </Tooltip>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Link to={`diary/${diary.id}`} style={{ width: "100%" }}>
              <Tooltip title="View entries" aria-label="view entries">
                <IconButton
                  classes={{
                    root: classes.buttonRoot,
                  }}
                >
                  <ListIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>

        <Typography
          component="h4"
          variant="subtitle2"
          color="textSecondary"
          align="center"
          className={classes.entries}
        >
          {totalEntries ?? "0"} entries
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DiaryTile;
