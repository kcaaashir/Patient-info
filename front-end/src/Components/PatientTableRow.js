import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Parser } from 'html-to-react'
import { getHeaders } from "../config/auth";
import { API_URL } from "../config/config";

const PatientTableRow = (props) => {
  const {
    _id,
    file,
    fullname,
    gender,
    phoneNo,
    dateOfBirth,
    email,
    specialAttention,
    address
  } = props.obj;

  const headers = getHeaders()

  const makeSpecialAttention = () => {
    axios
      .put(`${API_URL}/patient/specialAttention/` + _id, {}, headers)
      .then((res) => {
        if (res.status === 200) {
          alert("Patient successfully made special attention");
          window.location.reload();
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  }

  const deletePatient = () => {
    axios
      .delete(`${API_URL}/patient/` + _id, headers)
      .then((res) => {
        if (res.status === 200) {
          alert("Patient successfully deleted");
          window.location.reload();
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  };

  const navigate = useNavigate();

  const editPatient = () => {
    navigate("/update-patient/" + _id);
  };

  return (
    <tr>
      <td>{Parser().parse(file)}</td>
      <td>{fullname}</td>
      <td>{email}</td>
      <td>{phoneNo}</td>
      <td>{dateOfBirth}</td>
      <td>{address}</td>
      <td>{gender}</td>
      <td>{specialAttention ? 'Yes' : 'No'}</td>
      <td>
        <Button onClick={makeSpecialAttention} size="sm" variant="primary">
          Make Special Attention
        </Button> {' '}
        <Button onClick={editPatient} size="sm" variant="primary">
          Edit
        </Button> {' '}
        <Button onClick={deletePatient} size="sm" variant="danger">
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default PatientTableRow;
