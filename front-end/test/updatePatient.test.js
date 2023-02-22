import React from "react";
import axios from "axios";
import { Router } from "react-router-dom";
import { wait, fireEvent, screen } from "@testing-library/react";
import EditPatient from "./src/Pages/patients/edit-patient.component";

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
        const nameInput = screen.getByLabelText("Name");
        const genderInput = screen.getByLabelText("Gender");
        const phoneNumberInput = screen.getByLabelText("Phone Number");
        const zipCodeInput = screen.getByLabelText("Zip Code");
        const streetAddressInput = screen.getByLabelText("Street Address");
        const cityInput = screen.getByLabelText("City");
        const birthdayInput = screen.getByLabelText("Birthday");
        const emailInput = screen.getByLabelText("Email");
        const lastAppointmentInput = screen.getByLabelText("Last Appointment");
        const nextAppointmentInput = screen.getByLabelText("Next Appointment");
        const submitButton = screen.getByText("Update Patient");

        // Act
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(genderInput, { target: { value: "Male" } });
        fireEvent.change(phoneNumberInput, { target: { value: "1234567890" } });
        fireEvent.change(zipCodeInput, { target: { value: "12345" } });
        fireEvent.change(streetAddressInput, {
          target: { value: "123 Main St" },
        });
        fireEvent.change(cityInput, { target: { value: "Anytown" } });
        fireEvent.change(birthdayInput, { target: { value: "2000-01-01" } });
        fireEvent.change(emailInput, {
          target: { value: "johndoe@example.com" },
        });
        fireEvent.change(lastAppointmentInput, {
          target: { value: "2022-01-01" },
        });
        fireEvent.change(nextAppointmentInput, {
          target: { value: "2023-01-01" },
        });
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
            "http://localhost:4000/patients/update-patient/" + routeParams.id,
            {
              name: "Suprina Tamrakar",
              gender: "Female",
              phoneNumber: "1234567890",
              zipCode: "12345",
              streetAddress: "123 Main St",
              city: "Anytown",
              birthday: "01/01/2000",
              email: "suprina@example.com",
              lastAppointment: "01/01/2022",
              nextAppointment: "01/01/2023",
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
