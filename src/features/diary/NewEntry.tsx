import React, { FC } from "react";
import Editor from "../entry/Editor";
import DiaryEntriesList from "./DiaryEntriesList";

const Home: FC = () => {
  return (
    <div className="two-cols">
      <div className="left">
        <DiaryEntriesList />
      </div>
      <div className="right">
        <Editor />
      </div>
    </div>
  );
};

export default Home;
