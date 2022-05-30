import axios from 'axios';
import "../../_assets/css/file.css"
import RefreshIcon from 'mdi-react/RefreshCircleIcon';
import React, { Fragment, useEffect, useState } from 'react';
import { CardBody, Card, Button, Form } from 'reactstrap';
import { baseURL_PORTAL, CONFIG, errorToast, successToast, ToastTable } from '../../configs/exports';
import ReactDatatable from '@ashvin27/react-datatable';
import moment from 'moment';
import { MDBCloseIcon } from "mdbreact";
import Modal from 'react-modal';
import Select from "react-select";
import { USER } from '../../configs/exports';


//farmer hooks

const SuspendAccount = (props) => {
    

    // hooks definations variables srtores
    const [custname, setCustName] = useState("")
    const [customerphone, setCustomerPhone] = useState("")
    const [challenge, setChalange] = useState("")
    const [user, setUser] = useState("")
    const [reason, setReason] = useState("")
    //const [action, setAction] = useState("")
  
    //const [visible, setVisible] = useState(false);
   
    const [actionReport, setActionReport] = useState("")
    const [open, IsOpen] = useState(false);  // define open edit modal
    const [suggestions, setSuggestions] = useState("")
    const [service, setService] = useState("")
    const [recommendation, setRecommendation] = useState("")
   
   
  
    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal
  
    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
    const [state, setState] = useState({
        //country_name: '',
    });
    const [randomstrng, setRandomString] = useState(''); // random string for the api
  
  
    // const [country_name, setCountryName] = useState(''); // store the country name
  
  
    // function being called once a component has been loaded
    useEffect(() => {
        setLoad(true);
        axios.get(`${baseURL_PORTAL}feedback`, CONFIG).then(res => {
            let new_data = []; // difine a new object
  
            if (res.data.Feedback.length > 0) {  // looping  through the array for modifing the data
                for (let i = 0; i < res.data.Feedback.length; i++) {
                    let new_date = { new_date: moment(res.data.Feedback[i].created_on).format('DD-MM-YYYY') }
                    new_data.push(Object.assign(new_date, res.data.Feedback[i]));
                }
  
                setLoad(false);
            }
            setData(new_data);
            //console.log("Reports", res.data.Reports);
        }).catch(err => {
            setLoad(false);
            // if error on the api
        })
  
  
        axios.get(`${baseURL_PORTAL}service`, CONFIG).then (res => {
          let data = res.data.Services
          // console.log(data)
          let service_data = data.map(d => ({
              "value" : d.id,
              "label" : d.name
          }))
      
          setTimeout(() => {
              setService(service_data)
          }, 300);
      })
    }, [randomstrng])
  
    // difine the table format
    const columns = [
      {
          key: "customerphone",
          TrOnlyClassName: 'cell',
          text: "Phone#",
          className: "tsc",
          align: "left"
      },
  
      {
          key: "custname",
          TrOnlyClassName: 'cell',
          text: "Name",
          className: "tsc",
          align: "left"
      },
  
      {
          key: "challenge",
          TrOnlyClassName: 'cell',
          text: "Challange",
          className: "tsc",
          align: "left"
      },
      {
          key: "reason",
          TrOnlyClassName: 'cell', 
          text: "Reason",
          className: "tsc",
          align: "left"
      },
     
      {
          key: "suggestion",
          TrOnlyClassName: 'cell',
          text: "Suggestions",
          className: "tsc",
          align: "left"
      },
      {
        key: "recommendation",
        TrOnlyClassName: 'cell',
        text: "Recommendation",
        className: "tsc",
        align: "left"
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
                            style={{ marginRight: '1px' }}
                            onClick={() => OpenModal(record)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => { if (window.confirm('Are you sure you want to delete this country?')) handleDelete(record) }}
                        >
                            Delete
                        </button>
                    </Fragment>
                );
            }
        }
    ]
    //console.log("user2"+)
    let newUser = USER.id ;
  
   
    // open the edit modal
    const OpenModal = (e) => {
        IsOpen(true);
        setEditRecord(e);
        setState({
            country_name: e.name,
            newUser : USER.id 
        })
    }
  
    // table configs
    const config = {
        page_size: 100,
        length_menu: [100, 200, 500],
        show_filter: true,
        show_pagination: true,
        filename: "reports",
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
  
    const handleChangeService = (e) => {
      setService(e.label)
  }
  
  const handleChangeCustomerPhone = (e) => {
      setCustomerPhone(e.target.value)
  } 
  const handleChangeUser = (e) => {
      setUser(e.target.value)
  } 
   const handleChangeCustName = (e) => {
          setCustName(e.target.value)
  }  
  const handleChangeChallange = (e) => {
      setChalange(e.target.value)
  }  
  const handleChangeRecommendation = (e) => {
          setRecommendation(e.target.value)
  }
  // agent specific option
  
  
  const handleChangeSuggestions = (e) => {
      setSuggestions(e.target.value)
  }

  const handleChangeReason = (e) => {
    setReason(e.target.value)
}
  
  
  
    // handle onsubmit for the edit action
    const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: state.country_name
        }
  
        axios.put(`${baseURL_PORTAL}feedback/${edit_record.name}`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Country updated successfully");
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
        axios.delete(`${baseURL_PORTAL}feedback/${e.id}`, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Deleted successfully");
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
            err => {setLoad(false)
                errorToast("Not deleted")
            }
        )
    }
  
  
   
  
  
    // add country action point
  
    const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            customerphone : customerphone ,
            custname : custname,
            challenge : challenge,
            reason : reason,
            recommendation : recommendation,
            suggestions : suggestions,
            id_user : user,
            service : service
        }
        console.log('userData', formatData)
        axios.post(`${baseURL_PORTAL}feedback`, formatData, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Report added successfully");
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
            errorToast("Error adding Report");
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
                <h4><b>Add Report</b></h4>
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
                                            name="custname" placeholder='Enter Customer Name'
                                            value={custname} onChange={handleChangeCustName} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Contact</label>
                                          </div>
                                          <div className="col-md-12">
                                              <input id="input" type="text
                                                            " className="form-control"
                                                  name="customerphone" placeholder='Username'
                                                  value={customerphone} onChange={handleChangeCustomerPhone} />
                                          </div>
                                      </div>
                                  </div>

                                  <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Reason</label>
                                          </div>
                                          <div className="col-md-12">
                                              <input id="input" type="text
                                                            " className="form-control"
                                                  name="reason" placeholder='Enter challange'
                                                  value={reason} onChange={handleChangeReason} />
                                          </div>
                                      </div>
                                  </div>
  
                                  <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Challange</label>
                                          </div>
                                          <div className="col-md-12">
                                              <input id="input" type="text
                                                            " className="form-control"
                                                  name="challenge" placeholder='Enter challenge'
                                                  value={challenge} onChange={handleChangeChallange} />
                                          </div>
                                      </div>
                                  </div>
                                                       
  

                                  <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Suggestions</label>
                                          </div>
                                          <div className="col-md-12">
                                              <input id="input" type="text
                                                            " className="form-control"
                                                  name="suggestions" placeholder='Suggestions'
                                                  value={suggestions} onChange={handleChangeSuggestions} />
                                          </div>
                                      </div>
                                  </div>
  
                                  <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">May you recommend someone?</label>
                                          </div>
                                          <div className="col-md-12">
                                              <input id="input" type="text
                                                            " className="form-control"
                                                  name="recommendation" placeholder='recommendation'
                                                  value={recommendation} onChange={handleChangeRecommendation} />
                                          </div>
                                      </div>
                                  </div>
                                  
                                   <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Service</label>
                                          </div>
                                          <div className="col-md-12">
                                              <Select 
                                                  placeholder="Select Service"
                                                  autosize={true}
                                                  isClearable 
                                                  options={service} onChange={e => handleChangeService(e)} 
                                                  className="selected"
                                                  menuPortalTarget={document.body}
                                                  name="service"
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
                                            name="country_name" placeholder='Enter Country Name'
                                            value={state.country_name} onChange={onChangeHandle} />
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
                            <h4><b>Reports</b></h4>
                        </div>
                        <div className='col-2 float-right'>
                            <div className='3'>
                                <Button className="account__btn" color="success" onClick={() => { IsOpenAdd(true) }}>Add Report</Button>
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
export default SuspendAccount;