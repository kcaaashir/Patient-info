import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "../../Components/PatientForm";
import { useParams } from "react-router-dom";
import { NavBar } from "../../Common/NavBar";
import { convertToFormData } from "../../utils/convertFormData";
import { getHeaders } from "../../config/auth";
import { API_URL } from "../../config/config";



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

  const headers = getHeaders()

  //onSubmit handler
  const onSubmit = (patientObject) => {
    const data = convertToFormData(patientObject);
    axios
      .put(
        `${API_URL}/patient/` + routeParams.id,
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
        `${API_URL}/patient/` + routeParams.id,
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
