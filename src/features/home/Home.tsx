import React, { FC } from "react";
import Diaries from "../diary/Diaries";
import NavBar from "../nav/NavBar";

const Home: FC = () => {
  return (
    <>
      <NavBar />
      <Diaries />
    </>
  );
};

export default Home;
