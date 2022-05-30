import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, Card, Button, Form } from 'reactstrap';
import { baseURL_PORTAL, CONFIG, errorToast, successToast, ToastTable } from '../../configs/exports';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import { MDBCloseIcon } from "mdbreact";
import Modal from 'react-modal';
import Select from 'react-select';
// import { SelectFetch } from 'react-select-fetch';

const Branches = () => {

    // hooks definations variables srtores
    const [open, IsOpen] = useState(false);  // define open edit modal

    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal

    const [option, setOption] = useState()
    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
    const [branch_name, setBranch] = useState('')  // store the branch name
    const [state, setState] = useState({
        name: '',
        //country_name: '',
    });
    const [country, setCountry] = useState('');
    const [randomstrng, setRandomString] = useState(''); // random string for the api




    // function being called once a component has been loaded
    useEffect(() => {
        setLoad(true);
        axios.get(`${baseURL_PORTAL}branch`, CONFIG).then(res => {
            let new_data = []; // difine a new object

            if (res.data.Branches.length > 0) {  
                // looping  through the array for modifing the data
                for (let i = 0; i < res.data.Branches.length; i++) {
                    // console.log(res.data.Branches)
                    let new_date = { new_date: moment(res.data.Branches[i].created_on).format('DD-MM-YYYY') }
                    new_data.push(Object.assign(new_date, res.data.Branches[i]));
                }

                setLoad(false);
            }
            
            setData(new_data);
            console.log("Branches", res.data.Branches);
        }).catch(err => {
            console.log(err) //log error
            setLoad(false);
            // if error on the api
        })

         // get roles
        axios.get(`${baseURL_PORTAL}country`, CONFIG).then (res => {
            let data = res.data.Countries
            // console.log(data)
            let newOptions = data.map(d => ({
                "value" : d.id,
                "label" : d.name
            }))

            setTimeout(() => {
                setOption(newOptions)
            }, 300);
        })
    }, [randomstrng])

    // difine the table format
    const columns = [
        {
            key: "name",
            text: "Branch",
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
                            onClick={() => { if (window.confirm('Are you sure you want to delete this branch?')) handleDelete(record) }}
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
            branch_name: e.name,
            country: e.name
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

    
    const onChangeHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    
    const onChangeHandleBranch = (e) => {
        setBranch(e.target.value)
    }


    const onChangeHandlecountry = (e) => {
        setCountry(e.label)
    }


    // handle onsubmit for the edit action
    const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: branch_name,
            country : country
        }
        console.log('userData',formatData)
        
        axios.put(`${baseURL_PORTAL}branch/${edit_record.name}`, formatData, CONFIG).then(res => {
            setLoad(true);
            if (res.data.Success === true) {
                successToast("Branch updated successfully");
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

            errorToast("Branch not updated");


            // if error on the api
            // alert(JSON.stringify(err));
        })
    }


    // handle delete action
    const handleDelete = (e) => {
        setLoad(true);
        axios.delete(`${baseURL_PORTAL}branch/${e.name}`, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Branch deleted successfully");
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
                errorToast("Not deleted")
            }
        )
    }


    // add branch action point
    const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            branch: branch_name,
            country: country,
        }
        console.log('userData', formatData)
        axios.post(`${baseURL_PORTAL}branch`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Branch added successfully");
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
            errorToast("Error adding Branch");
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
                <h4><b>Add Branch</b></h4>
                <br></br>
                <>
                    <Form className="form login-form" onSubmit={onSubmitHandleAdd} >
                        <div className="form__form-group">
                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Branch</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="text
                                                          " className="form-control"
                                            name="branch_name" placeholder='Enter Branch Name'
                                            value={state.branch_name} onChange={onChangeHandleBranch} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Country</label>
                                    </div>
                                    <div className="col-md-12">
                                        {/* <input id="input" type="text
                                                          " className="form-control"
                                            name="country_name" placeholder='Enter Country Name'
                                            value={state.country_name} onChange={onChangeHandle} /> */}

                                        <Select
                                        placeholder="Select Country"
                                        autosize={true}
                                        isClearable 
                                         options={option} onChange={e => onChangeHandlecountry(e)}
                                        className="selected"
                                        menuPortalTarget={document.body}
                                        value={state.country}
                                        name="country" />

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
                                        <label className="form-label">Branch</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="text
                                                          " className="form-control"
                                            name="branch_name" placeholder='Enter Branch Name'
                                            value={state.branch_name} onChange={onChangeHandleBranch} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Country</label>
                                    </div>
                                    <div className="col-md-12">
                                        {/* <input id="input" type="text
                                                          " className="form-control"
                                            name="country_name" placeholder='Enter Country Name'
                                            value={state.country_name} onChange={onChangeHandle} /> */}
                                        <Select
                                        placeholder="Select Country"
                                        autosize={true}
                                        isClearable 
                                         options={option} onChange={e => onChangeHandlecountry(e)}
                                        className="selected"
                                        menuPortalTarget={document.body}
                                        value={state.country}
                                        name="country" />

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
                            <h4><b>Branches</b></h4>
                        </div>
                        <div className='col-2 float-right'>
                            <div className='3'>
                                <Button className="account__btn" color="success" onClick={() => { IsOpenAdd(true) }}>Add Branch</Button>
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


export default Branches;