import { Box, Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
  flexDirection: "row",
  overflow: "hidden",
  height: "100%",
}));

const StyledMain = styled("main")(({ theme, isSidebarVisible }) => ({
  height: "100%",
  flex: 1,
  overflow: "auto",
  paddingTop: "65px",
  paddingBottom: "6rem",
  backgroundColor: "rgb(241, 239, 241)",
  // Use calc for width to handle sidebar visibility
  width: isSidebarVisible ? "calc(100% - 300px)" : "100%",
  marginLeft: isSidebarVisible ? "300px" : "0px",
  transition: "margin-left 0.3s ease, width 0.3s ease", // Add width transition for smooth adjustment
}));

export const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsSidebarVisible(window.innerWidth > 1024);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function once to set initial state
    return () => window.removeEventListener("resize", handleResize); // Clean up event listener
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <OuterContainer>
      <InnerContainer>
        <Header onToggleSidebar={toggleSidebar} />
        {isSidebarVisible && <SideBar />}
        {/* Pass isSidebarVisible as a prop to StyledMain */}
        <StyledMain
          id="main"
          isSidebarVisible={isSidebarVisible}
          className="overflow-visible"
        >
          <Card className="border-0 p-2 overflow-visible">
            <Outlet />
          </Card>
        </StyledMain>
      </InnerContainer>
    </OuterContainer>
  );
};
