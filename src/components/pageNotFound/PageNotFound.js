import React from "react";
import styled from "styled-components";
import Img404 from "../../assets/404_img.webp";
import { Font } from "../../theme/Font";
import { Color } from "../../theme/Color";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Section80 className="404page-sec d-flex align-items-center">
      <>
        <div className="container">
          <div className="row align-items-center flex-md-row flex-column-reverse">
            <div className="col-md-5 d-flex flex-wrap justify-content-md-start justify-content-center">
              <Title
                className="mb-3 text-md-start text-center"
                style={{ color: "#686882" }}
              >
                Oh no!
                <br /> This page disappeared
              </Title>
              <Content className="mb-4 text-md-start text-center">
                The page you are looking for doesn’t exist or has been moved
              </Content>
              <Button to="/" className="">
                Go back to home page
              </Button>
            </div>
            <div className="offset-md-1 col-md-6">
              <Image src={Img404} className="w-100" alt="404" />
            </div>
          </div>
        </div>
      </>
    </Section80>
  );
};

export default PageNotFound;

const Section80 = styled.section`
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 80px;
  @media (max-width: 767px) {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`;

const Title = styled.div`
  font-size: 32px;
  font-family: ${Font.bold};
  color: #686882;
  font-weight: 700;
  @media (max-width: 767px) {
    font-size: 28px;
  }
`;

const Content = styled.p`
  font-size: 24px;
  color: ${Color.lighterGrey};
  font-family: ${Font.roboto};
  width: 75%;
  @media (max-width: 767px) {
    width: 100%;
    font-size: 20px;
  }
`;

const Image = styled.img`
  // max-width: 518px;
`;

const Button = styled(Link)`
  font-size: 20px;
  font-family: ${Font.roboto};
  color: ${Color.white};
  background-color: ${Color.theme_first};
  font-weight: 500;
  border: 1px solid;
  border-color: ${Color.theme_first};
  padding: 10px 20px;
  text-decoration: none;
  display: inline-block;
  &:hover {
    background-color: ${Color.white};
    color: ${Color.theme_first};
  }
  @media (max-width: 767px) {
    font-size: 16px;
  }
`;
