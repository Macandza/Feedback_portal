import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, Card, Button, Form } from 'reactstrap';
import { baseURL_PORTAL, CONFIG, errorToast, successToast, ToastTable } from '../../configs/exports';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import { MDBCloseIcon } from "mdbreact";
import Modal from 'react-modal';
import Select from "react-select";

const UsersStaffs = () => {

    // hooks definations variables srtores
    const [id, setId] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [msisdn, setMsisdn] = useState("")
    const [country, setCountry] = useState("")
    const [salary, setSalary] = useState("")
    const [email, setEmail] = useState("")
    const [open, IsOpen] = useState(false);  // define open edit modal
    const [role, setRole] = useState([])
    const [branch, setBranch] = useState()
    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal

    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
   const [state, setState] = useState({
        branch_name: '',
    });
    const [randomstrng, setRandomString] = useState(''); // random string for the api

    // function being called once a component has been loaded
    useEffect(() => {
        setLoad(true);
        axios.get(`${baseURL_PORTAL}user`, CONFIG).then(res => {
            let new_data = []; // difine a new object
            // console.log("Users", res.data.Users[1])

            if (res.data.Users.length > 0) {  
                // looping  through the array for modifing the data
                for (let i = 0; i < res.data.Users.length; i++) {
                    let new_date = { new_date: moment(res.data.Users[i].created_on).format('DD-MM-YYYY') }
                    new_data.push(Object.assign(new_date, res.data.Users[i]));
                }

                setLoad(false);
            }
            setData(new_data);
            // console.log("Users", res.data.Users);
        }).catch(err => {
            console.log(err) //log error
            setLoad(false);
            // if error on the api
        })

        // get roles to dropdown
    axios.get(`${baseURL_PORTAL}role`, CONFIG).then (res => {
        let data = res.data.Roles
        // console.log(data)
        let role_data = data.map(d => ({
            "value" : d.id,
            "label" : d.name
        }))

        setTimeout(() => {
            setRole(role_data)
        }, 300);
    })

   

    
    // get branches to dropdown
    axios.get(`${baseURL_PORTAL}branch`, CONFIG).then (res => {
        let data = res.data.Branches
        // console.log(data)
        let branch_data = data.map(b => ({
            "value" : b.id,
            "label" : b.name
        }))

        setTimeout(() => {
            setBranch(branch_data)
        }, 300);
    })}, [randomstrng])

    


    
    // difine the table format
    const columns = [
        {
            key: "name",
            text: "Name",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
       
       
        {
            key: "email",
            text: "Email",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
        {
            key: "country",
            text: "Country",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
       
        {
            key: "role",
            text: "Role",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
        {
            key: "grossSalary",
            text: "Gross Salary",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
        {
            key: "netSalary",
            text: "Net Salary",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
      
        {
            key: "new_date",
            text: "Date Created",
            TrOnlyClassName: 'tsc',
            className: "tsc",

            sortable: true
        },
        {
            key: "action",
            text: "Action",
            TrOnlyClassName: 'tsc',
            cell: (record, index) => {
                return (
                    <Fragment>
                        <button
                            className="btn btn-primary btn-sm"
                            style={{ marginRight: '5px' }}
                            onClick={() => OpenModal(record)}
                        >
                            Edit
                        </button>
                       
                    </Fragment>
                );
            }
        }
    ]

    // open the edit modal
    const OpenModal = (e) => {
        IsOpen(true);
        setEditRecord(e);
        setState({
            
            id :e.id,
            grossSalary :e.grossSalary,
           
        })
    }


    

    // table configs
    const config = {
        page_size: 100,
        length_menu: [100, 200, 500],
        show_filter: true,
        show_pagination: true,
        filename: "users",
        button: {
            excel: true,
            print: true,
            csv: true
        }
    }

    // closes the edit modal
    const closeModal = () => {
        IsOpen(false);
    }

    //  close add modal
    const closeModalAdd = () => {
        IsOpenAdd(false)
    }

   
    const onChangeHandleRole = (e) => {
        setRole(e.value)
    }

    const onChangeHandleSalary = (e) => {
        setSalary(e.target.value)
    }
   
   
  


   
    



    // handle onsubmit for the edit action
   /* const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            
            role: role,
            
        }
        axios.put(`${baseURL_PORTAL}user/${edit_record.id}`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === 'True') {
                successToast("Role updated successfully");
                IsOpen(false);
                // reload  after three sec0nd of success
                setTimeout(() => {
                    setRandomString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                }, 3000)
            }

        }).catch(err => {
            setLoad(false);

            errorToast("Error on updating user role");


            // if error on the api
            // alert(JSON.stringify(err));
        })
    }*/
     // handle onsubmit for the edit action
     const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            salary: salary
        }
  
        axios.put(`${baseURL_PORTAL}user/${edit_record.id}`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Salary updated successfully");
                IsOpen(false);
                // reload  after three sec0nd of success
                setTimeout(() => {
                    setRandomString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                }, 3000)
            }
  
        }).catch(err => {
            setLoad(false);
            IsOpen(false)
            errorToast("Report not updated");
  
  
            // if error on the api
            // alert(JSON.stringify(err));
        })
    }
      // handle delete action
      const handleDelete = (e) => {
        setLoad(true);
        axios.delete(`${baseURL_PORTAL}user/${e.email}`, CONFIG).then(res => {
           // (`${baseURL_PORTAL}user
            setLoad(false);
            if (res.data.Success === true) {
                successToast("User deleted successfully");
                // reload  after three sec0nd of success
                setTimeout(() => {
                    setRandomString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                    IsOpen(false);
                }, 3000)
            }

        }).catch(
            err => {
                errorToast("User not deleted")
            }
        )
    }

    // add branch action point
     // add user action point

     /*const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: name, 
            username: username,
            //msisdn: msisdn,
            email: email,
            password: password,
            role: role,
            branch: branch,
            id_no: id,
            country_id: country
            
        }
      
      console.log('userData', formatData)
       
        
        
        axios.post(`${baseURL_PORTAL}authentication/register`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("User added successfully");
                // reload  after three sec0nd of success
                setTimeout(() => {
                    setRandomString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                    IsOpenAdd(false);
                }, 3000)
            }

        }).catch(err => {
            errorToast("Error adding User");
        })



    }*/

    //return function of UI
    return (
        <div>

            {ToastTable()}

           

            <Modal
                isOpen={open}
                onRequestClose={e => {
                    closeModal(e);
                }}

                contentLabel="My dialog"
                className="mymodal"
                onAfterOpen={() => {
                    document.body.style.overflow = 'hidden';
                }}
                onAfterClose={() => {
                    document.body.removeAttribute('style');
                }}
                overlayClassName="myoverlay"
                closeTimeoutMS={500}
            >
                <MDBCloseIcon onClick={closeModal} />
                <h4><b>Modify details</b></h4>
                <br></br>
                <>
                    <Form className="form login-form" onSubmit={onSubmitHandleEdit} >
                        <div className="form__form-group">
                            

                            {/* <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="name" placeholder='name'
                                                value={state.name} onChange={onChangeHandle} />
                                        </div>
                                    </div>
                                </div>
                            <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Username</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="username" placeholder='Username'
                                                value={state.username} onChange={onChangeHandle} />
                                        </div>
                                    </div>
                                </div>*/}
                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Salary</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="salary" placeholder="Salary"
                                                value={state.grossSalary} onChange={onChangeHandleSalary} />
                                        </div>
                                    </div>
                                </div>

                                
                               
                            <div className="account__btns col-8 offset-2" >
                                <br />
                                <Button className="account__btn" type='submit' color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                } </Button>
                            </div>
                        </div>
                    </Form>
                </>
            </Modal>

            <Card>
                <CardBody>
                    <div className='row'>
                        <div className='col-10'>
                            <h4><b>Staff</b></h4>
                        </div>
                        <div className='col-2 float-right'>
                            <div className='3'>
                               {/* <Button className="account__btn" color="success" onClick={() => { IsOpenAdd(true) }}>Add Staff</Button>*/}
                            </div>
                        </div>
                        <br />
                    </div>
                    <ReactDatatable
                        config={config}
                        records={data}
                        loading={isLoading}
                        columns={columns}
                        id="tsc"
                    />
                </CardBody>

            </Card>
        </div>
    )
}

export default UsersStaffs;