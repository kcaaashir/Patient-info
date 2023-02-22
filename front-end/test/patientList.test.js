import React from "react";
import axios from "axios";
import { screen, wait } from "@testing-library/react";
import PatientList from "./src/Components/patient-list.component";
import { Router } from "react-router-dom";

jest.mock("axios");

describe("PatientList component", () => {
  it("renders data from API", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          name: "Suprina Tamrakar",
          gender: "Female",
          phoneNumber: "1234567890",
          zipCode: "12345",
          streetAddress: "123 Main St",
          city: "New York",
          birthday: "01/01/1990",
          email: "suprina@email.com",
          lastAppointment: "12/12/2022",
          nextAppointment: "01/01/2023",
        },
      ],
    });
    <Router>
      <PatientList />
      {await (async () => {
        await wait(() => {
          expect(axios.get).toHaveBeenCalledWith(
            "http://localhost:4000/patients",
            {
              headers: {
                Authorization: "Bearer null",
                "Content-Type": "application/json",
              },
            }
          );

          expect(screen.getByText("Suprina Tamrakar")).toBeInTheDocument();
          expect(screen.getByText("Female")).toBeInTheDocument();
          expect(screen.getByText("1234567890")).toBeInTheDocument();
          expect(screen.getByText("12345")).toBeInTheDocument();
          expect(screen.getByText("123 Main St")).toBeInTheDocument();
          expect(screen.getByText("New York")).toBeInTheDocument();
          expect(screen.getByText("01/01/1990")).toBeInTheDocument();
          expect(screen.getByText("suprina@email.com")).toBeInTheDocument();
          expect(screen.getByText("12/12/2022")).toBeInTheDocument();
          expect(screen.getByText("01/01/2023")).toBeInTheDocument();
        });
      })}
    </Router>;
  });
});
