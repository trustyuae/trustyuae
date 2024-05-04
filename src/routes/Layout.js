import { Box } from "@mui/material";
import React from "react";
import styled from "styled-components";
import Dashboard from "../components/Dashboardd";
import { Outlet } from "react-router-dom";
import Header from "../navbar/Header";
import SideBar from "../navbar/Sidebar";

const OuterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FCFCFC",
  display: "flex",
  overflow: "hidden",
  height: "inherit",
  flexDirection: "column",
  minHeight: "100vh",
  fontFamily: "Montserrat, sans-serif",
}));

const InnerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FCFCFC",
  display: "flex",
  flex: 1,
  flexdirection: "row",
  overflow: "hidden",
  height: "100%",
}));

const StyledMain = styled("main")(({ theme }) => ({
  //backgroundColor: theme.palette.primary.light,
  //   height: "calc(100vh - 64px)",
  height: "100%",
  flex: 1,
  overflow: "auto",
  width: "100%",
  paddingTop: "65px",
  paddingBottom: "6rem",
}));

export const Layout = () => {
  return (
    <OuterContainer>
      <InnerContainer>
        {/* <Dashboard /> */}
        <Header/>
        <SideBar/>
        <StyledMain id="main">
          <Outlet/>
        </StyledMain>
      </InnerContainer>
    </OuterContainer>
  );
};
