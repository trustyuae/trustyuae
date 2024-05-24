import React from "react";
import ReactLoader from "react-js-loader";
import { Color } from "../theme/Color";
import { styled } from "styled-components";

const Loader = () => {
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  return (
    <Container>
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
    </Container>
  );
};

export default Loader;
