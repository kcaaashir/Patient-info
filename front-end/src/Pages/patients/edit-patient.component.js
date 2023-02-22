// EditPatient Component for update patient data

// Import Modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "../../Components/PatientForm";
import { useParams } from "react-router-dom";
import { NavBar } from "../../Common/NavBar";
import { convertToFormData } from "../../utils/convertFormData";

const token = localStorage.getItem("token");
const headers = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
};

// EditPatient Component
const EditPatient = (props) => {
  const routeParams = useParams();

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

  //onSubmit handler
  const onSubmit = (patientObject) => {
    const data = convertToFormData(patientObject);
    axios
      .put(
        "http://localhost:3000/patient/" + routeParams.id,
        data,
        headers
      )
      .then((res) => {
        if (res.status === 200) {
          alert("Patient successfully updated");
          window.location.href = "/patient-list";
        } else Promise.reject();
      })
      .catch((err) => console.log(err));
  };

  // Load data from server and reinitialize patient form
  useEffect(() => {
    axios
      .get(
        "http://localhost:3000/patient/" + routeParams.id,
        headers
      )
      .then((res) => {
        console.log("res", res)
        const {
          fullname,
          email,
          phoneNo,
          dateOfBirth,
          address,
          gender,
          specialAttention,
          file
        } = res.data.data;

        setFormValues({
          fullname,
          email,
          phoneNo,
          dateOfBirth,
          address,
          gender,
          specialAttention,
          file
        });
      })
      .catch((err) => console.log(err));
  }, [routeParams.id]);
  // Return patient form
  return (
    <>
      <NavBar />
      <h3>Update Patient</h3>
      <PatientForm
        initialValues={formValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        Update Patient
      </PatientForm>
    </>
  );
};

// Export EditPatient Component
export default EditPatient;
