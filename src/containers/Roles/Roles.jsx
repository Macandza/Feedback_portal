import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, Card, Button, Form } from 'reactstrap';
import { baseURL_PORTAL, CONFIG, errorToast, successToast, ToastTable } from '../../configs/exports';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import { MDBCloseIcon } from "mdbreact";
import Modal from 'react-modal';
import Select from "react-select";

const Countries = () => {

    // hooks definations variables srtores
    const [open, IsOpen] = useState(false);  // define open edit modal

    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal

    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
    const [departament, setDepartament] = useState([])
    const [role, setRole] = useState("");
    //const [departament, setDepartament] = useState("");
    const [state, setState] = useState({
    role_name: '',
    });
    const [randomstrng, setRandomString] = useState(''); // random string for the api


    // const [country_name, setCountryName] = useState(''); // store the country name


    // function being called once a component has been loaded
    useEffect(() => {
        setLoad(true);
        axios.get(`${baseURL_PORTAL}role`, CONFIG).then(res => {
            let new_data = []; // difine a new object

            if (res.data.Roles.length > 0) {  // looping  through the array for modifing the data
                for (let i = 0; i < res.data.Roles.length; i++) {
                    let new_date = { new_date: moment(res.data.Roles[i].created_on).format('DD-MM-YYYY') }
                    new_data.push(Object.assign(new_date, res.data.Roles[i]));
                }

                setLoad(false);
            }
            setData(new_data);
            console.log("Roles", res.data.Roles);
        }).catch(err => {
            setLoad(false);
            // if error on the api
        })
        axios.get(`${baseURL_PORTAL}departament`, CONFIG).then (res => {
            let data = res.data.Departaments
            // console.log(data)
            let departament_data = data.map(d => ({
                "value" : d.id,
                "label" : d.name
            }))
    
            setTimeout(() => {
                setDepartament(departament_data)
            }, 300);
        })
    
    }, [randomstrng])

    // difine the table format
    const columns = [
        {
            key: "name",
            text: "Role",
            className: "tsc",
            TrOnlyClassName: 'tsc',
            sortable: true
        },
        {
            key: "departament",
            text: "Departament",
            TrOnlyClassName: 'tsc',
            className: "tsc",
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
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => { if (window.confirm('Are you sure you want to delete this role?')) handleDelete(record) }}
                        >
                            Delete
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
            role_name: e.name,
            departament: e.id_dept
        })
    }

    // table configs
    const config = {
        page_size: 100,
        length_menu: [100, 200, 500],
        show_filter: true,
        show_pagination: true,
        filename: "countires",
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

   /* const onChangeHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
            [e.target.departament]: e.target.value
        })
    }*/
    const onChangeHandleDepartament = (e) => {
        setDepartament(e.value)
    }
    const onChangeHandleRole = (e) => {
       setRole(e.target.value)
    }
   


    // handle onsubmit for the edit action
    const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: state.role_name,
            departament: departament
        }

        axios.put(`${baseURL_PORTAL}role/${edit_record.id}`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
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
            IsOpen(false)
            errorToast("Role not updated");


            // if error on the api
            // alert(JSON.stringify(err));
        })
    }


    // handle delete action
    const handleDelete = (e) => {
        // e.preventDefault()
        setLoad(true);
        axios.delete(`${baseURL_PORTAL}role/${e.name}`, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Role deleted successfully");
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
                // setLoad(false)
                errorToast("Not deleted")
            }
        )
    }


    // add country action point

    const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: role,
            departament: departament
        }
        
        axios.post(`${baseURL_PORTAL}role`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Role added successfully");
                // IsOpen(false)
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
            errorToast("Error adding Role");
        })
    }


    //return function of UI
    return (
        <div>

            {ToastTable()}

            <Modal
                isOpen={open_add}
                onRequestClose={e => {
                    closeModalAdd(e);
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
                <MDBCloseIcon onClick={closeModalAdd} />
                <h4><b>Add Role</b></h4>
                <br></br>
                <>
                    <Form className="form login-form" onSubmit={onSubmitHandleAdd} >
                        <div className="form__form-group">
                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Name</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="text
                                                          " className="form-control"
                                            name="role_name" placeholder='Enter Role Name'
                                            value={role} onChange={onChangeHandleRole} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Departament</label>
                                        </div>
                                        <div className="col-md-12">
                                            <Select 
                                                placeholder="Select Role" //onChangeHandleDepartament
                                                autosize={true}
                                                isClearable 
                                                options={departament} onChange={e => onChangeHandleDepartament(e)} 
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                value={departament}
                                                name="departament"
                                            />
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
                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Name</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="text
                                                          " className="form-control"
                                            name="role_name" placeholder='Enter Role Name'
                                            value={state.role_name} onChange={onChangeHandleRole} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Departament</label>
                                        </div>
                                        <div className="col-md-12">
                                            <Select 
                                                placeholder="Select Role"
                                                autosize={true}
                                                isClearable 
                                                options={departament} onChange={e => onChangeHandleDepartament(e)} 
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                
                                                name="departament"
                                            />
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
                            <h4><b>Roles</b></h4>
                        </div>
                        <div className='col-2 float-right'>
                            <div className='3'>
                                <Button className="account__btn" color="success" onClick={() => { IsOpenAdd(true) }}>Add Role</Button>
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


export default Countries;