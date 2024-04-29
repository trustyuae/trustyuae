import React from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBCheckbox,
  MDBCardImage
}
from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';

const Login = () => {
  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className='d-flex justify-content-center align-items-center'>
        <MDBCol col='10' md='6'>
          <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone image" />
        </MDBCol>
        <MDBCol col='4' md='4' className='align-items-center'>
          <MDBInput wrapperClass='mb-4' label='Email address' placeholder='enter your email' id='formControlLg' type='email' size="lg" style={{fontSize: '18px'}} labelClass="custom-label-style"/>
          <MDBInput wrapperClass='mb-4' label='Password' placeholder='enter your password' id='formControlLg' type='password' size="lg" style={{fontSize: '18px'}} labelClass="custom-label-style"/>
          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' labelClass="custom-label-style1"/>
            <a href="!#">Forgot password?</a>
          </div>
          <Button className='w-100' variant="primary"><strong>Sign In</strong></Button>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;