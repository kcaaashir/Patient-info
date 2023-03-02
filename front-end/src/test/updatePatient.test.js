import React from "react";
import axios from "axios";
import { Router } from "react-router-dom";
import { wait, fireEvent, screen } from "@testing-library/react";
import EditPatient from "../Pages/patients/edit-patient.component";

jest.mock("axios");

const routeParams = { id: "123" };

describe("EditPatient", () => {
  it("updates patient data", async () => {
    // Arrange
    axios.put.mockResolvedValueOnce({ status: 200 });
    const routeParams = { id: "123" };
    const initialValues = {
      name: "John Doe",
      gender: "Male",
      phoneNumber: "1234567890",
      zipCode: "12345",
      streetAddress: "123 Main St",
      city: "Anytown",
      birthday: "2000-01-01",
      email: "johndoe@example.com",
      lastAppointment: "2022-01-01",
      nextAppointment: "2023-01-01",
    };
    <Router>
      <EditPatient routeParams={routeParams} initialValues={initialValues} />;
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

        // Act
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

        // Assert
        await wait(() => {
          expect(axios.put).toHaveBeenCalledWith(
            "http://localhost:4000/patients/update-patient/" + routeParams.id,
            initialValues,
            {
              headers: {
                Authorization: "Bearer testtoken",
                "Content-Type": "application/json",
              },
            }
          );
        });

        expect(window.alert).toHaveBeenCalledWith(
          "Patient successfully updated"
        );
        expect(window.location.href).toBe("/patient-list");
      })}
    </Router>;
  });

  // Test 2: Testing the EditPatient component with error response from the server
  it("should handle error response from the server", async () => {
    axios.put.mockRejectedValueOnce({ message: "Error Occured" });

    <Router>
      <EditPatient />
      {await (async () => {
        fireEvent.click(screen.getByTestId("submit-btn"));

        // Assert
        await wait(() => {
          expect(axios.put).toHaveBeenCalledWith(
            "http://localhost:3000/patient/" + routeParams.id,
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
        });

        expect(console.log).toHaveBeenCalledWith({ message: "Error Occured" });
      })}
    </Router>;
  });
});
