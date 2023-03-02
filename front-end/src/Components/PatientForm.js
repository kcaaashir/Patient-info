import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, } from "formik";
import { FormGroup, Button } from "react-bootstrap";

const PatientForm = (props) => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Required"),
    email: Yup.string().email("You have entered an invalid email address."),
    phoneNo: Yup.string()
      .matches(phoneRegExp, "Invalid phone number.")
      .required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    address: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    specialAttention: Yup.boolean().required("Required"),
    file: Yup.mixed().optional(),
  });
  return (
    <div className="form-wrapper">
      <Formik {...props} validationSchema={validationSchema} >
        {(formik) => {
          return (
            <>
              <Form>
                <FormGroup className="mb-2">
                  <label>Fullname:</label>
                  <Field name="fullname" type="text" className="form-control" />
                  <ErrorMessage
                    name="fullname"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <label>Email:</label>
                  <Field name="email" type="text" className="form-control" />
                  <ErrorMessage
                    name="email"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <label>Phone Number:</label>
                  <Field name="phoneNo" type="number" className="form-control" />
                  <ErrorMessage
                    name="phoneNo"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <label>Address:</label>
                  <Field name="address" type="text" className="form-control" />
                  <ErrorMessage
                    name="address"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <label>Gender:</label>
                  <Field name="gender" as="select" className="form-control">
                    <option value="">Please select value</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-2">
                  <label>Special Attention:</label>
                  <Field name="specialAttention" as="select" className="form-control" >
                    <option value="">Please select value</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Field>
                  <ErrorMessage
                    name="specialAttention"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <label>Date Of Birth:</label>
                  <Field name="dateOfBirth" type="date" className="form-control" />
                  <ErrorMessage
                    name="dateOfBirth"
                    className="d-block invalid-feedback"
                    component="span"
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <label>Select Image</label>
                  <input
                    type="file"
                    name="file"
                    onChange={e => {
                      formik.setFieldValue('file', e.target.files[0]);
                    }}

                    className="form-control"
                  />
                  <ErrorMessage
                    name="file"
                    className="d-block invalid-feedback"
                    component="span"

                  />
                </FormGroup>
                <Button variant="primary" size="lg" block="block" type="submit">
                  {props.children}
                </Button>
              </Form>
            </>
          )
        }}
      </Formik>
    </div>
  );
};

export default PatientForm;
