import React from "react";
import Header from "./layout/Header";
import { useRoutes } from "react-router-dom";
import Routes from "./router/routes";
import "../index.css";

export default function Main() {
  const element = useRoutes(Routes);
  return (
    <>
      <Header />
      {element}
    </>
  );
}
