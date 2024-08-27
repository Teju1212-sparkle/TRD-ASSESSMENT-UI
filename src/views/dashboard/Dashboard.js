import React from "react";
import PropTypes from "prop-types"
import { history, Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Button } from "reactstrap"
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import CIcon from '@coreui/icons-react'
import Swal from 'sweetalert2'
//import { withAlert } from "react-alert";
import axios from "axios";
class Users extends React.Component {
  state = {
   
    products: [],
  }
  componentDidMount() {
    this.userDetails();
  }
  userDetails = () => {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
    axios.get('http://localhost:3005/user/api/bec/all/users/' + '?page=1&limit=10').then(
      (response) => {
        console.log(response)
        this.setState({ products: response.data.data.docs })
      }
    )
      .catch(
        (error) => {
          console.log(error)
          if (error.response.status == 401) {
            Swal.fire({
              type: "error",
              title: "error",
              icon: "error",
              text: "Session Expired"
            }
            )
            this.props.history.push('/login')
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

 
 
  render() {
    //const alert = this.props.alert;
    return (
      <Card>
        <CardHeader>
          Users
     
        </CardHeader>
        <CardBody>
          <BootstrapTable data={this.state.products} search keyField="Name" bordered={false} version="4" hover striped pagination={true}  >
            <TableHeaderColumn dataField="username">Username</TableHeaderColumn>
            <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
            
           
          </BootstrapTable>
        </CardBody>
      </Card>
    )
  }
}
export default Users;