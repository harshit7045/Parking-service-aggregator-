import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";

export default function App() {
  return (
    <>
      <Header />
      <Outlet /> {/* This is where the routed components will be rendered */}
      <Footer />
    </>
  );
}
