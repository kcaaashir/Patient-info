// Import React
import React from "react";

// Import Bootstrap
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

// Import Custom CSS
import "./App.css";

// Import from react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import other React Component
import CreatePatient from "./Pages/patients/create-patient.component";
import EditPatient from "./Pages/patients/edit-patient.component";
import PatientList from "./Pages/patients/patient-list.component";
import SignOut from "./Components/sign-out";

import {
  CREATE_PATIENT,
  EDIT_PATIENT,
  PATIENT_LIST,
  REGISTER,
  SIGN_OUT,
} from "./Constants/Routes";
import Register from "./Pages/register/register";
import Login from "./Pages/login/login";

// App Component
const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>
        <div className="app-table">
          <Row>
            <Col md={12}>
              <div className="wrapper">
                <Routes>
                  <Route exact path="/" element={<Login />} />
                  <Route path={REGISTER} element={<Register />} />
                  <Route path={CREATE_PATIENT} element={<CreatePatient />} />
                  <Route path={EDIT_PATIENT} element={<EditPatient />} />
                  <Route path={PATIENT_LIST} element={<PatientList />} />
                  <Route path={SIGN_OUT} element={<SignOut />} />
                </Routes>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Router>
  );
};

export default App;
