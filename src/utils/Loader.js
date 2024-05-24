import React from "react";
import ReactLoader from "react-js-loader";
import { Color } from "../theme/Color";
import { styled } from "styled-components";

const Loader = () => {
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  `;
  return (
    <Container>
      <ReactLoader
        type='spinner-default'
        bgColor={Color.theme_first}
        size={50}
      />
    </Container>
  );
};

export default Loader;
