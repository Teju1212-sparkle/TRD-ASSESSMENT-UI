import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react'
import { Card, CardHeader, CardBody, CardTitle, Button, Table } from "reactstrap"
import Swal from 'sweetalert2'
const Dashboard = () => {
  //states 
  const [repo, setRepo] = useState([])
  const navigate = useNavigate();
  //For lifecycle methods
  let onMounted;
  useEffect(() => {
    onMounted = async () => {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
      const getRepo = await axios.get('http://localhost:3005/user/api/bec/users/list')
        .then(
          (response) => {
            console.log(response)
            setRepo(response.data.data.docs);
          })
        .catch(
          (error) => {
            if (error.response.status == 401) {
              Swal.fire({
                type: "error",
                title: "error",
                icon: "error",
                text: "Session Expired"
              }
              )
              navigate('/login')
            }
            else {
              Swal.fire({
                type: "error",
                title: "error",
                icon: "error",
                text: error.response.data.error
              }
              )
            }
          }
        )
    }
    //console.log(onMounted)
    onMounted();
  }, []);

  return (
    <>
      <Card className="mt-5" style={{ maxWidth: '800px', margin: 'auto' }}>
        <CardBody>
          <CardTitle tag="h5" style={{textAlign:'left',fontSize:'1.5rem'}}>Users List</CardTitle>
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {repo.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  )
};
export default Dashboard
