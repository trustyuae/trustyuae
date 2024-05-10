import { Box, Card } from "@mui/material";
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
  height: "100%",
  flex: 1,
  overflow: "auto",
  width: "100%",
  paddingTop: "65px",
  paddingBottom: "6rem",
  backgroundColor: 'rgb(241, 239, 241)'
}));

export const Layout = () => {
  return (
    <OuterContainer>
      <InnerContainer>
        {/* <Dashboard /> */}
        <Header />
        <SideBar />
        <StyledMain id="main" className="overflow-visible">
          <Card className="border-0 p-2 overflow-visible">
            <Outlet />
          </Card>
        </StyledMain>
      </InnerContainer>
    </OuterContainer>
  );
};
