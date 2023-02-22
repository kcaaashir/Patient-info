// CreatePatient Component for add new patient

// Import Modules
import React, { useState } from "react";
import axios from "axios";
import PatientForm from "../../Components/PatientForm";
import { NavBar } from "../../Common/NavBar";
import { convertToFormData } from "../../utils/convertFormData";

//CreatePatient Component
const CreatePatient = () => {
  const [formValues, setFormValues] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
    dateOfBirth: "",
    address: "",
    gender: "",
    specialAttention: "",
    file: ""
  });

  const token = localStorage.getItem("token");
  if (token === null) {
    alert("No Token!");
  }
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const onSubmit = (patientObject) => {
    const data = convertToFormData(patientObject)
    axios
      .post(
        "http://localhost:3000/patient/create/",
        data,
        headers
      )
      .then((response) => {
        if (response.status === 201) {
          alert("Patient successfully created");
          window.location.href = "/patient-list";
        } else Promise.reject();
      })
      .catch((err) => {
        console.log("error", err)
        alert("Something went wrong");
      })

  };

  return (
    <>
      <NavBar />
      <h3>Create Patient</h3>
      <PatientForm
        initialValues={formValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        Create Patient
      </PatientForm>
    </>
  );
};

export default CreatePatient;
