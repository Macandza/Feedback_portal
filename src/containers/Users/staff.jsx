import React, { useState, Fragment, useEffect } from 'react';

import ReactDatatable from '@ashvin27/react-datatable';

import axios from 'axios';
import "../../_assets/css/file.css"
import { Card, CardBody, Button, Table } from 'reactstrap';

import { baseURL, TOKEN, USER, logout, errorToast, successToast, ToastTable } from '../../configs/exports';
import Modal from 'react-modal';
import { Form } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact";
import * as moment from 'moment';
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import Select from "react-select";
import 'react-phone-number-input/style.css'


const UsersStaffs = () => {
    const [payments, setPaymentCategories] = useState([])
    const [isLoading, setLoad] = useState(true)
    const [open, isOpen] = useState(false)
    const [queryString, setQueryString] = useState("")
    const [recruitment_id, setRecruitmentID] = useState("")
    const [total, setTotal] = useState(false)

    const [openAdd, isOpenAdd] = useState(false)


    const [first_name, setFirstName] = useState("")
    const [msisdn, setMsisdn] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    // eslint-disable-next-line
    const [job_title, setJobTitle] = useState("")
    // eslint-disable-next-line
    const [role_name, setRoleName] = useState("")
    const [role_id, setRoleID] = useState(0)

    //role
    const [role, setRole] = useState([])


    useEffect(() => {
        setLoad(true)

        // setRole([{
        //     label: "Administration",
        //     value: "Administration"
        // },
        // {
        //     label: "Marketing",
        //     value: "Marketing"
        // },
        // {
        //     label: "Office",
        //     value: "Office"
        // },
        // {
        //     label: "Accounts",
        //     value: "Accounts"
        // }
        // ])
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': TOKEN
            },
        };
        let url = baseURL + "user?" + queryString;
        let url_role = baseURL + "roles?" + queryString;

        // alert(url)
        axios.all([
            axios.get(url, config),
            axios.get(url_role, config)
        ]).then(axios.spread((paymentResponse, roleResponse) => {
            setTotal(paymentResponse.data.total);
            let data = [];

            let role_data = [];


            // alert(USER_ID)

            setLoad(false)
            for (let i = 0; i < roleResponse.data.data.length; i++) {
                role_data.push(Object.assign(roleResponse.data.data[i]));
                setLoad(false)
            }
            setRole(role_data)

            // alert(USER_ID)
            if (paymentResponse.data.data.length > 0) {
                setLoad(false)
                for (let i = 0; i < paymentResponse.data.data.length; i++) {
                    let name = { name: paymentResponse.data.data[i].first_name + " " + paymentResponse.data.data[i].last_name }
                    let date = { dates: (moment.utc(paymentResponse.data.data[i].created_on).format('DD/MM/YYYY')) };
                    data.push(Object.assign(date, name, paymentResponse.data.data[i]));
                    setLoad(false)
                }
                // eslint-disable-next-line
                setPaymentCategories(data.filter(person => person.id != USER.user_id))
            } else {
                setLoad(false)
                setPaymentCategories(data)
            }
        }))

    }, [queryString]);


    const config = {
        key_column: "tsc",
        length_menu: [10, 20, 50, 100, 200, 500],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        page_size: 100,
        show_length_menu: true,
        show_info: true,
        language: {
            loading_text: "Please be patient while data loads...",
            filter: "Search here ...",
            no_data_text: "No data was found",
            pagination: {
                next: <span>&#9658;</span>,
                previous: <span>&#9668;</span>
            }
        }
    }
    const columns = [
        {
            key: "name",
            TrOnlyClassName: 'tsc',
            text: "Name",
            className: "tsc",
            align: "left"
        },
        {
            key: "username",
            TrOnlyClassName: 'tsc',
            text: "Username",
            className: "tsc",
            align: "left"
        },

        {
            key: "msisdn",
            TrOnlyClassName: 'tsc',
            text: "Phone#",
            className: "tsc",
            align: "left"
        },
        {
            key: "role_name",
            TrOnlyClassName: 'tsc',
            text: "Role",
            className: "tsc",
            align: "left"
        },
        {
            key: "dates",
            TrOnlyClassName: 'tsc',
            text: "Created On",
            className: "tsc",
            align: "left"
        }
        ,
        {
            key: "action",
            text: "Options",
            TrOnlyClassName: 'cell',
            className: "cell",
            width: 250,
            sortable: false,
            cell: record => {
                return (
                    <Fragment className="center" >
                        <button className="btn btn-primary btn-sm"
                            title="EditCategory"
                            style={
                                { marginRight: '10px' }}
                            onClick={() => { onModify(record) }} >

                            Edit
                        </button>

                        <button className="btn btn-danger btn-sm"
                            title="Delete Category"
                            style={
                                { marginRight: '10px' }}

                            onClick={() => { if (window.confirm('Are you sure you want to delete this user?')) onSubmitDelete(record) }} >

                            Delete
                        </button>


                    </Fragment>
                );
            }
        }

    ];

    // // pass inputs
    // const handleChangeLastName = (e) => {
    //     setLastName(e.target.value)
    // }

    const handleChangeFirstNanme = (e) => {
        setFirstName(e.target.value)
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }

    // const handleChangeMsisdn = (e) => {
    //     setMsisdn(e.target.value)
    // }

    // const handleChangeJobTitle = (e) => {
    //     setJobTitle(e.target.value)
    // }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const closeModal = (e) => {
        isOpen(false)
    }

    const onModify = (data) => {

        // alert(data.ui_name)
        setRecruitmentID(data.id)
        setFirstName(data.name)
        setMsisdn(data.msisdn)
        setUsername(data.username)
        setJobTitle(data.role_name)
        isOpen(true)

    };

    const closeModalAdd = (e) => {
        isOpenAdd(false)
    }


    const onSubmitDelete = (record) => {
        // alert(record.id)
        setLoad(true)

        axios.delete(baseURL + `user/${record.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': TOKEN
            },
        }).then((response) => {
            if (response.data.status) {
                successToast(response.data.message)
                window.setTimeout(() => {
                    // isSuccess(false)
                    setQueryString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                }, 2000);
            } else {
                errorToast(response.data.message)
                window.setTimeout(() => {
                }, 2000);
            }
        })
            .catch((error) => {
                if (error.response.data.status_code === 401) {
                    logout()
                }
                errorToast(error.response.data.message)
                window.setTimeout(() => {
                }, 2000);
            })
    }


    const onSubmitUpdate = (record) => {
        record.preventDefault();
        // alert(record.id)


        let formData = {

            "name": first_name,
            "username": username,
            "role_id": role_id,
            "password": password,
            "confirmPassword": password,
            "msisdn": msisdn,
            "id": recruitment_id,
        }
        setLoad(true)
        axios.put(baseURL + 'user', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': TOKEN
            },
        }).then((response) => {
            if (response.data.success) {

                successToast(response.data.message)
                setLoad(false)
                window.scrollTo(0, 0)
                window.setTimeout(() => {
                    isOpen(false)
                    setQueryString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                }, 2000);
            } else {
                errorToast(response.data.message)
                window.setTimeout(() => {
                }, 2000);
            }
        })
            .catch((error) => {
                if (error.response.data.status_code === 401) {
                    logout()
                }
                errorToast(error.response.data.message)
                setLoad(false)
                window.setTimeout(() => {
                }, 2000);
            })
    }


    const onSubmit = (record) => {
        record.preventDefault();
        // alert(record.id)
        let formData = {
            "name": first_name,
            "username": username,
            "role_id": role_id,
            "password": password,
            "confirmPassword": password,
            "msisdn": msisdn


        }
        setLoad(true)

        axios.post(baseURL + 'user', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': TOKEN
            },
        }).then((response) => {
            if (response.data.success) {
                successToast(response.data.message)
                setLoad(false)
                window.scrollTo(0, 0)
                window.setTimeout(() => {
                    isOpenAdd(false)
                    setQueryString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                }, 2000);
            } else {
                errorToast(response.data.message)
                window.setTimeout(() => {

                }, 2000);
            }
        })
            .catch((error) => {
                if (error.response.data.status_code === 401) {
                    logout()
                }
                errorToast(error.response.data.message)
                setLoad(false)
                window.setTimeout(() => {
                }, 2000);
            })
    }

    const tableChangeHandler = data => {
        let queryString = Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column") + '=' + encodeURIComponent(data[key].column)
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
            }
        }).join('&');
        setQueryString(queryString)
    }

    // agent specific option
    const handleChangeRole = value => {

        // alert(JSON.stringify(value))
        if (value != null) {
            setRoleName(value.label)
            setRoleID(value.value)
        }
        else {
            setRoleName("")
        }
    }

    return (
        <div style={{ marginTop: "-20px" }} >
            < >

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
                    <h4><b>Modify  details</b></h4>
                    <br></br>
                    <>
                        <Form className="form login-form" >
                            <div className="form__form-group">
                                <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="first_name" placeholder='Name'
                                                value={first_name} onChange={handleChangeFirstNanme} />
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
                                                value={username} onChange={handleChangeUsername} />
                                        </div>
                                    </div>
                                </div>


                                <div className="col-md-10-offset-1">
                                    <div className="col-md-12">
                                        <Form.Label>Phone Number</Form.Label>
                                    </div>
                                    <div className="col-md-12">

                                        <Form.Group className="Focus-line">
                                            <PhoneInput
                                                flags={flags}
                                                defaultCountry="KE"
                                                placeholder="Enter phone number"
                                                name="msisdn"
                                                className="form-group"
                                                id="input"
                                                value={msisdn}
                                                onChange={value => setMsisdn(value)} />

                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Role</label>
                                        </div>
                                        <div className="col-md-12">

                                            <Select
                                                isClearable
                                                options={
                                                    (role.length > 0 || role.length === 0) &&
                                                    role.map((countyItem, i) => ({
                                                        label: countyItem.name,
                                                        value: countyItem.id
                                                    }))}

                                                // onInputChange={this.loadOptions}
                                                placeholder="Select Role"
                                                autosize={true}
                                                // value={[{
                                                //     label: role_name,
                                                //     value: role_id
                                                // }]}
                                                onChange={handleChangeRole}
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                name="namffe"
                                            />
                                        </div>

                                    </div>
                                    <br />
                                </div>

                                <div className="account__btns col-8 offset-2" >
                                    <br />
                                    <Button className="account__btn" type='submit' onClick={onSubmitUpdate} color="success"> {
                                        isLoading ? "Please wait..." : "Submit"
                                    }</Button>
                                </div>
                            </div>
                        </Form>
                    </>
                </Modal>



                <Modal
                    isOpen={openAdd}
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
                    <h4><b>Add User</b></h4>
                    <br></br>
                    <>
                        <Form className="form login-form" >
                            {/* <h5><b>Get Agent Number</b></h5> */}
                            <div className="form__form-group">
                                <br></br>
                                <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="first_name" placeholder='Name'
                                                value={first_name} onChange={handleChangeFirstNanme} />
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
                                                value={username} onChange={handleChangeUsername} />
                                        </div>
                                    </div>
                                </div>



                                <div className="col-md-10-offset-1">
                                    <div className="col-md-12">
                                        <Form.Label>Phone Number</Form.Label>
                                    </div>
                                    <div className="col-md-12">

                                        <Form.Group className="Focus-line">
                                            <PhoneInput
                                                flags={flags}
                                                defaultCountry="KE"
                                                placeholder="Enter phone number"
                                                name="msisdn"
                                                className="form-group"
                                                id="input"
                                                value={msisdn}
                                                onChange={value => setMsisdn(value)} />

                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Role</label>
                                        </div>
                                        <div className="col-md-12">

                                            <Select
                                                isClearable
                                                options={
                                                    (role.length > 0 || role.length === 0) &&
                                                    role.map((countyItem, i) => ({
                                                        label: countyItem.name,
                                                        value: countyItem.id
                                                    }))}

                                                // onInputChange={this.loadOptions}
                                                placeholder="Select Role"
                                                autosize={true}
                                                // value={[{
                                                //     label: role_name,
                                                //     value: role_id
                                                // }]}
                                                onChange={handleChangeRole}
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                name="namffe"
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Paasword</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="password" className="form-control"
                                                name="password" placeholder='Password'
                                                value={password} onChange={handleChangePassword} />
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </div>

                            <div className="account__btns col-8 offset-2" >
                                <Button className="account__btn" type='submit' onClick={onSubmit} color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                }</Button>
                            </div>

                        </Form>
                    </>
                </Modal>
                < Card >
                    {ToastTable()}
                    <CardBody >
                        <Table responsive hover>
                            <div className="panel-body" >

                                <div className="row">
                                    <div className="col-md-6">
                                        <h4> <b> Staff Members</b></h4><br />
                                    </div>
                                    <div className="col-6 pull-right">
                                        <button className="btn btn-primary btn-sm float-right"
                                            title="Add Agent"
                                            style={
                                                { marginRight: '10px' }}
                                            onClick={() => { isOpenAdd(true) }} >
                                            Add User <i className="fa fa-add"></i>
                                        </button>
                                    </div>
                                </div>
                                <ReactDatatable
                                    config={config}
                                    records={payments}
                                    columns={columns}
                                    dynamic={true}
                                    id="tsc"
                                    loading={isLoading}
                                    total_record={total}
                                    onChange={tableChangeHandler} />
                            </div>
                        </Table>
                    </CardBody>


                </Card>
            </>
        </div >
    )

}
export default UsersStaffs;
