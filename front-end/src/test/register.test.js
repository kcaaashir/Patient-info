import React from "react";
import { Router } from "react-router-dom";
import Register from '../Pages/register/register'
var axios = require("axios");
var fireEvent = require("@testing-library/react").fireEvent;
var screen = require("@testing-library/react").screen;

jest.mock("axios");


describe('register', () => {
    it('renders correctly', async() => {
        <Router>
      <Register />
      {await (async () => {
        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toBeInTheDocument();
        const passwordInput = screen.getByLabelText("Password");
        expect(passwordInput).toBeInTheDocument()
      })}
    </Router>;
    })

    it("calls axios post method with the correct parameters on submit", async () => {
        <Router>
          <Register />
          {await (async () => {
             const emailInput = screen.getByLabelText("Email");
             const password = screen.getByLabelText("Password");
            // fill in form fields
            
            fireEvent.change(emailInput, {
              target: { value: "johndoe@example.com" },
            });
            fireEvent.change(passwordInput, { target: { value: "testpassword" } });
            fireEvent.click(submitButton);
    
            // check if axios post method was called with the correct parameters
            expect(axios.post).toHaveBeenCalledWith(
              "http://localhost:3000/user/signup",
              {
                  email: "aashirbad@gmail.com",
                  password: "1234567890",
              },
            );
          })}
        </Router>;
      });
});