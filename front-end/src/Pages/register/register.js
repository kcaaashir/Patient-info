import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LOGIN } from "../../Constants/Routes";
import { API_URL } from "../../config/config";

const Register = (props) => {
  const [formValues] = useState({
    email: "",
    password: "",
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("You have entered an invalid email address."),
    password: Yup.string().required("Required"),
  });

  const navigate = useNavigate();

  const onSubmit = (userObject) => {
    axios
      .post(`${API_URL}/user/signup`, userObject)
      .then((response) => {
        if (response.status === 201) {
          navigate(LOGIN);
        } else Promise.reject();
      })
      .catch((err) => alert("Could not register."));
  };

  const signIn = () => {
    navigate(LOGIN);
  };

  return (
    <div className="sign-in-container">
      <Formik
        {...props}
        validationSchema={validationSchema}
        initialValues={{ formValues }}
        onSubmit={onSubmit}
      >
        <Form>
          <h3>Register</h3>
          <FormGroup className="mb-3">
            <label>Email:</label>
            <Field name="email" type="text" className="form-control" />
            <ErrorMessage
              name="email"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <label>Password:</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage
              name="password"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <Button variant="primary" size="lg" block="block" type="submit">
            {props.children} Sign Up
          </Button>
        </Form>
      </Formik>
      <u className="forgot-password text-right" onClick={signIn}>
        Already registered?
      </u>
    </div>
  );
};

export default Register;
