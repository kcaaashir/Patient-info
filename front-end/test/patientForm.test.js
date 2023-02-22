import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import PatientForm from "./src/Components/PatientForm";

describe("PatientForm", () => {
  const phoneRegExp =
    /^((\+[1-9]{1,4}[ \-])|(\([0-9]{2,3}\)[ \-])|([0-9]{2,4})[ \-])?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, "Invalid phone number.")
      .required("Required"),
    zipCode: Yup.number().required("Required"),
    streetAddress: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    birthday: Yup.date().required("Required"),
    email: Yup.string().email("You have entered an invalid email address."),
    lastAppointment: Yup.date().max(Date(), "Date is invalid"),
    nextAppointment: Yup.date().min(Date(), "Date is invalid."),
  });

  let container = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it("renders correctly", () => {
    act(() => {
      render(<PatientForm />, container);
    });
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("renders Formik component with correct props", () => {
    act(() => {
      render(<PatientForm />, container);
    });
    const formik = container.querySelector(Formik);
    expect(formik.props.validationSchema).toEqual(validationSchema);
  });

  it("renders Form component with one Field component for each form field", () => {
    act(() => {
      render(<PatientForm />, container);
    });
    const form = container.querySelector(Form);
    expect(form.querySelectorAll(Field).length).toBe(10);
  });

  it("renders ErrorMessage component for each Field component", () => {
    act(() => {
      render(<PatientForm />, container);
    });
    const form = container.querySelector(Form);
    const fields = form.querySelectorAll(Field);
    fields.forEach((field) => {
      expect(field.parentElement.querySelectorAll(ErrorMessage).length).toBe(1);
    });
  });
});
