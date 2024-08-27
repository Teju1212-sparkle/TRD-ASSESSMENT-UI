import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardBody, CardTitle, FormGroup, Label, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string() .min(4, 'Password must be at least 4 characters') .required('Required'),
  });
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    console.log("register", values);
    let obj = {
      email: values.email,
      password: values.password,
      fullName: values.name
    }
    axios.post('http://localhost:3005/user/api/bec/create/user', obj, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log("success", response)
      navigate('/login');
    }).catch((e) => {
      console.log("err", e)
    })
    setSubmitting(false);
  }
  return (
    <Card className="mt-5" style={{ maxWidth: '500px', margin: 'auto' }}>
      <CardBody>
        <CardTitle tag="h5">Register Form</CardTitle>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Field name="name" type="text" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </FormGroup>
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
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
export default Register;
