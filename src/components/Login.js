import React, {useState } from "react";
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
import { loginUser } from "../redux/actions/UserActions";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    setUserName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(loginUser({ username, password }));
  };
  
  const data = useSelector(
    (state) => state?.loginUser
  );
   if (data?.data?.data?.user_data?.user_role === 'subscriber') {
      navigate("/ordersystem");
    } else {
      console.log('error while login')
    }

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol col="10" md="6">
          <MDBCardImage
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            class="img-fluid"
            alt="Phone image"
          />
        </MDBCol>
        <MDBCol col="4" md="4" className="align-items-center">
          <MDBInput
            wrapperClass="mb-4"
            placeholder="Enter username..."
            value={username}
            id="formControlLg"
            type="text"
            size="lg"
            style={{ fontSize: "15px" }}
            onChange={handleUsername}
          />
          <MDBInput
            wrapperClass="mb-4"
            placeholder="Enter password..."
            value={password}
            id="formControlLg"
            type="password"
            size="lg"
            style={{ fontSize: "15px"}}
            onChange={handlePassword}
          />
          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox
              name="flexCheck"
              value={""}
              id="flexCheckDefault"
              label="Remember me"
              labelClass="custom-label-style1"
            />
          </div>
          <Button
            className="w-100"
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          >
            <strong>Sign In</strong>
          </Button>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
