import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardBody, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Login = () => {
  const [showOtpAndPassword, setShowOtpAndPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(4, 'Password must be at least 4 characters').required('Required'),
    //  otp: Yup.string() .length(6, 'OTP must be 6 digits') .required('Required'),
  });
  const handleEmailVerification = async (email) => {
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const data = await response.json();
      if (data.isRegistered) {
        setRegisteredEmail(email);
        setShowOtpFields(true);
        setErrorMessage('');
      }
      else {
        setErrorMessage('Email is not registered. Please register.');
        // Redirect to registration screen
        navigate('/register');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };
  const handleSendOTP = async (values) => {
    console.log("I am in OTP")
    if (values.otp == null || values.otp == "") {
      setErrorMessage('Please Enter OTP.');
    } else if (values.otp == '123456') {
      console.log('Login successful!');
      navigate('/dashboard');
      // Send login data to your backend API
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email: registeredEmail, password: values.password }),
      // });
      // if (response.ok) {
      //   console.log('Login successful!');
      //   navigate('/dashboard'); 
      // } 
    } else {
      setErrorMessage('Incorrect OTP.');
    }
    //     try {
    //       const response = await fetch(`/api/check-email?email=${email}`);
    //       const data = await response.json();
    //       if (data.isRegistered) {
    //         // Send OTP (call your /api/send-otp endpoint here)
    //         // ... 
    //         setRegisteredEmail(email);
    //         setErrorMessage('');
    //       } else {
    //         setErrorMessage('Enter valid registered email ID');
    //       }
    //     } catch (error) {
    // console.error('Error checking email:', error);
    //       setErrorMessage('An error occurred. Please try again later.');
    //     }
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    setShowOtpAndPassword(true);
    console.log("I am in submit");
    console.log(values)
    if (showOtpAndPassword) {
      handleSendOTP(values)
    }
    else {
      try {
        // Verify OTP (in a real scenario, compare with the OTP sent to the email)
      } catch (error) {
        console.error('Error during login:', error);
        setErrorMessage('An error occurred. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    }
  };
  return (
    <Card className="mt-5" style={{ maxWidth: '500px', margin: 'auto' }}>
      <CardBody>
        <CardTitle tag="h5">Login Form</CardTitle>
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
              {errorMessage && <div className="error">{errorMessage}</div>}
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {!showOtpAndPassword ? "Login" : "Validate"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
      Don't you have Account &#8594; <Link to="/register">Register</Link>
    </Card>
  );
};
export default Login;
