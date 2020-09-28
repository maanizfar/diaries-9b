import React, { FC } from "react";
import Diaries from "../diary/Diaries";
import NavBar from "../nav/NavBar";
import { useLocation } from "react-router-dom";

const Home: FC = () => {
  const loc = useLocation();

  console.log(loc);

  return (
    <>
      <NavBar />
      <Diaries />
    </>
  );
};

export default Home;
