import CreatePatient from "../Pages/patients/create-patient.component";
import React from "react";
import { Router } from "react-router-dom";
var axios = require("axios");
var fireEvent = require("@testing-library/react").fireEvent;
var screen = require("@testing-library/react").screen;

jest.mock("axios");

describe("CreatePatient component", () => {
  it("renders correctly", async () => {
    localStorage.setItem("token", "testtoken");
    <Router>
      <CreatePatient />
      {await (async () => {
        const fullnameInput = screen.getByLabelText("Full Name");
        expect(fullnameInput).toBeInTheDocument();
        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toBeInTheDocument();
        const phoneNoInput = screen.getByLabelText("Phone Number");
        expect(phoneNoInput).toBeInTheDocument();
        const dateOfBirthInput = screen.getByLabelText("Date Of Birth");
        expect(dateOfBirthInput).toBeInTheDocument();
        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();
        const genderInput = screen.getByLabelText("Gender");
        expect(genderInput).toBeInTheDocument();
        const specialAttentionInput = screen.getByLabelText("Special Attention");
        expect(specialAttentionInput).toBeInTheDocument();
        const fileInput = screen.getByLabelText("File");
        expect(fileInput).toBeInTheDocument();
      })}
    </Router>;
  });

  it("calls axios post method with the correct parameters on submit", async () => {
    localStorage.setItem("token", "testtoken");
    <Router>
      <CreatePatient />
      {await (async () => {
         const fullnameInput = screen.getByLabelText("Name");
         const emailInput = screen.getByLabelText("Email");
         const phoneNoInput = screen.getByLabelText("Phone Number");
         const dateOfBirthInput = screen.getByLabelText("Birthday");
         const address = screen.getByLabelText("Address");
         const genderInput = screen.getByLabelText("Gender");
         const specialAttentionInput = screen.getByLabelText("Special Attention");
         const fileInput = screen.getByLabelText("File");
         const submitButton = screen.getByText("Update Patient");
        // fill in form fields
        fireEvent.change(fullnameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, {
          target: { value: "johndoe@example.com" },
        });
        fireEvent.change(phoneNoInput, { target: { value: "1234567890" } });

        fireEvent.change(dateOfBirthInput, { target: { value: "2000-01-01" } });
        fireEvent.change(address, {
          target: { value: "lalitpur" },
        });
        fireEvent.change(genderInput, { target: { value: "MALE" } });
       
        fireEvent.change(specialAttentionInput, { target: { value: true } });
       
        fireEvent.change(fileInput, { target: { value: undefined } });
        fireEvent.click(submitButton);

        // check if axios post method was called with the correct parameters
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:3000/patients/create",
          {
            fullname: "aashirbad",
              email: "aashirbad@gmail.com",
              phoneNo: "1234567890",
              dateOfBirth: "01/01/2000",
              address: "lalitpur",
              gender: "male",
              specialAttention: true,
              file: "<img>",
          },
          {
            headers: {
              Authorization: "Bearer testtoken",
              "Content-Type": "application/json",
            },
          }
        );
      })}
    </Router>;
  });
});
