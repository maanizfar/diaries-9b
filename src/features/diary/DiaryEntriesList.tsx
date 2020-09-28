import React, { FC, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../services/api";
import { Entry } from "../../interfaces/entry.interface";
import { setEntries } from "../entry/entriesSlice";
import {
  setCurrentlyEditing,
  setCanEdit,
  setActiveDiaryId,
} from "../entry/editorSlice";
import dayjs from "dayjs";
import { useAppDispatch } from "../../store";

import Typography from "@material-ui/core/Typography";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

const DiaryEntriesList: FC = () => {
  const { entries } = useSelector((state: RootState) => state);
  const { currentlyEditing: activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );

  const dispatch = useAppDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id != null) {
      http
        .get<null, { entries: Entry[] }>(`/diaries/entries/${id}`)
        .then(({ entries: _entries }) => {
          if (_entries) {
            const sortByLastUpdated = _entries.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(setEntries(sortByLastUpdated));
          }
        });
    }
  }, [id, dispatch]);

  return (
    <div className="entries">
      <header>
        <Link to="/">
          <h3>&larr; Go Back</h3>
        </Link>
      </header>
      <ul>
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={
              (entry.id as string) === activeDiaryId?.id ? "active-entry" : ""
            }
            onClick={() => {
              dispatch(setCurrentlyEditing(entry));
              dispatch(setActiveDiaryId(entry.id as string));
              dispatch(setCanEdit(true));
            }}
          >
            <Typography component="p" variant="body1">
              {entry.title}
            </Typography>
            <Typography component="p" variant="caption" color="textSecondary">
              <CalendarTodayIcon fontSize="small" />{" "}
              {dayjs(entry.updatedAt).format("ddd, DD/MM/YYYY")}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryEntriesList;
