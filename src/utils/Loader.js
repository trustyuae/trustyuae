import React from "react";
import ReactLoader from "react-js-loader";
import { Color } from "../theme/Color";
import { keyframes, styled } from "styled-components";
import { Box, Typography } from "@mui/material";

const loaderAnimation = keyframes`
  100% {
    background-position: left;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  background: linear-gradient(90deg, #000 50%, #0000 0) right/200% 100%;
  animation: ${loaderAnimation} 2s infinite linear;
`;

const Loader = () => {
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  return (
    <>
      {/* <Container>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReactLoader
            type="spinner-default"
            bgColor={Color.theme_first}
            size={40}
            title={
              <span style={{ color: "black", margin: "0" }}>just a moment ...!</span>
            }
          />
        </div>
      </Container> */}
      {/* <Box className="d-flex align-items-center justify-content-center">
        <LoaderContainer>
          <Typography variant="h5" className="text-white fw-semibold">
            Loading...
          </Typography>
        </LoaderContainer>
      </Box> */}
      <div class="cssload-container">
        <div class="cssload-speeding-wheel"></div>
      </div >
    </>

  );
};

export default Loader;
