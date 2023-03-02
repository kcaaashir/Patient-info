import React from "react";
import axios from "axios";
import { screen, wait } from "@testing-library/react";
import PatientList from "../Pages/patients/patient-list.component";
import { Router } from "react-router-dom";

jest.mock("axios");

describe("PatientList component", () => {
  it("renders data from API", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
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
      ],
    });
    <Router>
      <PatientList />
      {await (async () => {
        await wait(() => {
          expect(axios.get).toHaveBeenCalledWith(
            "http://localhost:3000/patient",
            {
              headers: {
                Authorization: "Bearer null",
                "Content-Type": "application/json",
              },
            }
          );

          expect(screen.getByText("aashirbad")).toBeInTheDocument();
          expect(screen.getByText("aashirbad@gmail.com")).toBeInTheDocument();
          expect(screen.getByText("1234567890")).toBeInTheDocument();
          expect(screen.getByText("01/01/2000")).toBeInTheDocument();
          expect(screen.getByText("lalitpur")).toBeInTheDocument();
          expect(screen.getByText("male")).toBeInTheDocument();
          expect(screen.getByText(true)).toBeInTheDocument();
          expect(screen.getByText("<img>")).toBeInTheDocument();
        });
      })}
    </Router>;
  });
});
