import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Col, Row, Table } from "react-bootstrap";
import PatientTableRow from "../../Components/PatientTableRow";
import { NavBar } from "../../Common/NavBar";
import { getHeaders, headers } from "../../config/auth";
import { API_URL } from "../../config/config";

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const headers = getHeaders();
    axios
      .get(`${API_URL}/patient`, headers)
      .then(({ data }) => {
        setPatients(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const searchByName = (e) => {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    axios
    .get(`${API_URL}/patient?fullname=${e.target.value}`, headers)
    .then(({ data }) => {
      setPatients(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const DataTable = () => {
    return patients.map((res, i) => {
      return <PatientTableRow obj={res} key={i} />;
    });
  };
  return (
    <>
      <NavBar />
      <h3>Patient List</h3>

      <Row className="mb-4">
        <Col>
          <div>
            <input name="fullname" type="text" onChange={searchByName} placeholder="search by name"/>
          </div>
        </Col>
      </Row>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date Of Birth</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Special Attention</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <DataTable />
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default PatientList;
