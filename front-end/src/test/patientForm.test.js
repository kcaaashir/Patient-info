import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import PatientForm from "../Components/PatientForm";

describe("PatientForm", () => {

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

  
});
