import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBCheckbox,
  MDBCardImage,
} from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginUserWithToken } from "../redux/actions/UserActions";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../utils/validation";
import styled from "styled-components";
import { Box, CardContent } from "@mui/material";
import { Card, Col, Row } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUsername = (e) => {
    setUserName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    let isValid = true;

    if (!username) {
      setUserNameError("Username is required");
      isValid = false;
    } else if (!isValidEmail(username)) {
      setUserNameError("Please enter a valid Username");
      isValid = false;
    } else {
      setUserNameError("");
    }

    if (!password) {
      setPasswordError("Please enter valid password");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      dispatch(loginUser({ username, password }, navigate));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(loginUserWithToken(navigate, token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = useSelector((state) => state.loginUser.loading);

  return (
    <MDBContainer style={{ height: "100vh" }} className="p-3">
      <Row className="d-flex justify-content-center align-items-center h-100">
        <Col md={10}>
          <Card className="mb-0 px-3">
            <CardContent>
              <Row className="justify-content-center align-items-center">
                <Col md={6}>
                  <Box sx={{ height: "350px", width: "100%" }}>
                    {/* <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                      className="h-100 w-100"
                      alt="Phone"
                    /> */}
                    <img
                      src={require("../assets/access-control-system.webp")}
                      className="h-100 w-100"
                      style={{ objectFit: "cover" }}
                      alt="Phone"
                    />
                  </Box>
                </Col>
                <Col md={5}>
                  <Box
                    className="mb-3"
                    sx={{
                      width: "150px",
                    }}
                  >
                    <img
                      className="h-100 w-100"
                      style={{ objectFit: "contain" }}
                      src={require("../assets/logo-large-main.webp")}
                      alt="logo"
                    />
                  </Box>
                  <MDBInput
                    // wrapperClass="mb-4"
                    placeholder="Enter username..."
                    value={username}
                    id="formControlLg"
                    type="text"
                    size="lg"
                    style={{ fontSize: "15px" }}
                    onChange={handleUsername}
                  />
                  {usernameError && <Error>{usernameError}</Error>}
                  <MDBInput
                    wrapperClass="mt-4"
                    placeholder="Enter password..."
                    value={password}
                    id="formControlLg"
                    type="password"
                    size="lg"
                    style={{ fontSize: "15px" }}
                    onChange={handlePassword}
                  />
                  {passwordError && <Error>{passwordError}</Error>}
                  <div className="d-flex justify-content-between mx-4 mt-3 mb-4">
                    <MDBCheckbox
                      name="flexCheck"
                      value={""}
                      id="flexCheckDefault"
                      label="Remember me"
                      labelClass="custom-label-style1"
                    />
                  </div>
                  {loading ? (
                    <Button
                      className="w-100"
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                      disabled
                    >
                      <strong>{loading ? "Signing In..." : "Sign In"}</strong>
                    </Button>
                  ) : (
                    <Button
                      className="w-100"
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      <strong>{"Sign In"}</strong>
                    </Button>
                  )}
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </MDBContainer>
  );
};

export default Login;

const Error = styled.p`
  font-size: 16px;
  color: red;
  fontweight: 400;
`;
