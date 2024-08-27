import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardBody, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
const Login = () => {
  const [showOtpAndPassword, setShowOtpAndPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('EmailRequired'),
    password: Yup.string().min(4, 'Password must be at least 4 characters').required('Password Required'),
    //  otp: Yup.string() .length(6, 'OTP must be 6 digits') .required('Required'),
  });
  const verifyOtp = async (values) => {
    if (values.otp == null || values.otp == "") {
      setErrorMessage('Please Enter OTP.');
    } else {
      // Send login data to your backend API
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
      axios.post('http://localhost:3005/user/api/bec/verifyotp', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if(response.status==200){
          Swal.fire("Logged in Sucessfully")
          console.log('Login successful!');
          navigate('/dashboard');
        }
       
      }).catch((error) => {
       console.log(error)
        Swal.fire({
          type: "error",
          title: "error",
          icon: "error",
          text: error.response.data.message
        })
        setErrorMessage('Incorrect OTP.');
      })
    }
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values)
    if (showOtpAndPassword) {
      verifyOtp(values)
    }
    else {
      axios.post('http://localhost:3005/user/api/bec/user/authenticate', values, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response);
        if(response.status==200){
          Swal.fire("OTP sent to your mail")
          localStorage.setItem('token',response.data.token)
          localStorage.setItem('fullName',response.data.user.fullName)
        setShowOtpAndPassword(true);
        }
      }).catch((error) => {
        console.log(error)
        Swal.fire({
          type: "error",
          title: "error",
          icon: "error",
          text: error.response.data.message
        })
        setErrorMessage('Invalid Credentials.');
      })
    }
  };
  return (
    <Card className="mt-5" style={{ maxWidth: '500px', margin: 'auto' }}>
      <CardBody>
        <CardTitle tag="h5" style={{textAlign:'center'}}>Login Form</CardTitle>
        <Formik
          initialValues={{ email: '', password: '', otp: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </FormGroup>
              {showOtpAndPassword && (
                <FormGroup>
                  <Label for="otp">OTP</Label>
                  <Field name="otp" type="text" className="form-control" />
                  <ErrorMessage name="otp" component="div" className="text-danger" />
                </FormGroup>
              )}
              {errorMessage && <div className="error" style={{color:'red'}}>{errorMessage}</div>}
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {!showOtpAndPassword ? "Login" : "Validate"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
      <span style={{fontSize: "13px", margin: "16px"}}>Don't you have an Account &#8594; <Link to="/register">Register</Link></span>
    </Card>
  );
};
export default Login;
