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
import { useLocation } from 'react-router-dom';



//farmer hooks

const DepositArchive = (props) => {

    const u = props.USER;
    let newUser = USER.name ;
    
    
    
    
    const [isVisible, setIsVisible] = useState(true)
    // hooks definations variables srtores
    const [custname, setCustName] = useState("")
    const [customerphone, setCustomerPhone] = useState("")
    const [challange, setChalange] = useState("")
    const [user, setUser] = useState("")
    //const [action, setAction] = useState("")
  
    //const [visible, setVisible] = useState(false);
   
    const [actionReport, setActionReport] = useState("")
    const [open, IsOpen] = useState(false);  // define open edit modal
    const [comments, setComments] = useState([])
    const [suggestions, setSuggestions] = useState("")
    const [status, setStatus] = useState("")
   
   
  
    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal
  
    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
    const [employee, setEmployee] = useState([])
    const [state, setState] = useState({
        //country_name: '',
    });
    const [randomstrng, setRandomString] = useState(''); // random string for the api
  
  
    // const [country_name, setCountryName] = useState(''); // store the country name
    
     
    const query = new URLSearchParams(window.location.search);
    let  serviceId = query.get('service_id')
    //const [service_id, setService_id] = useState(serviceId)
  
    // function being called once a component has been loaded
    useEffect(() => {
       
            
        setLoad(true);
        axios.get(`${baseURL_PORTAL}report`, CONFIG).then(res => {
            let new_data = []; // difine a new object
  
            if (res.data.TodayReports.length > 0) {  // looping  through the array for modifing the data
                for (let i = 0; i < res.data.TodayReports.length; i++) {
                    let new_date = { new_date: moment(res.data.TodayReports[i].created_on).format('DD-MM-YYYY') }
                    new_data.push(Object.assign(new_date, res.data.TodayReports[i]));
                }
  
                setLoad(false);
            }
            setData(new_data);
            //console.log("Reports", res.data.Reports);
        }).catch(err => {
            setLoad(false);
            // if error on the api
        })

        axios.get(`${baseURL_PORTAL}user`, CONFIG).then (res => {
            let data = res.data.Users
            // console.log(data)
            let employee_data = data.map(d => ({
                "value" : d.id,
                "label" : d.name
            }))
    
            setTimeout(() => {
                setEmployee(employee_data)
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
          key: "chalange",
          TrOnlyClassName: 'cell',
          text: "Challange",
          className: "tsc",
          align: "left"
      },
      {
          key: "actionReport",
          TrOnlyClassName: 'cell', 
          text: "Action",
          className: "tsc",
          align: "left"
      },
      {
          key: "comments",
          TrOnlyClassName: 'cell', 
          text: "Comments",
          className: "tsc",
          align: "left"
      },
      {
          key: "suggestions",
          TrOnlyClassName: 'cell',
          text: "Suggestions",
          className: "tsc",
          align: "left"
      },
      {
          key: "status",
          text: "Status",
          TrOnlyClassName: 'cell',
          className: "cell",
          sortable: false,
          cell: record => {
              return (
                  <Fragment className="center" >
  
                      {record.status === 1 ?
                          <span class="badge-success" style={{ borderRadius: "5px", padding: "2px" }}>
                              Sorted
                          </span>
                          :
                          record.status === 2 ?
                              <span class="badge-warning" style={{ borderRadius: "5px", padding: "2px" }}>
                                  In Process
                              </span>
  
                              :
                              <>
                                  {
                                      record.status === 0 ?
                                          <span class="badge-danger" style={{ borderRadius: "5px", padding: "2px" }}>
                                                Pending
                                          </span>
                                          : null
                                  }
                              </>
                      }
                  </Fragment >
              );
          }
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
   
    
    
    //console.log(newUser)
   
    // open the edit modal
    const OpenModal = (e) => {
        IsOpen(true);
        setEditRecord(e);
        setState({
            country_name: e.name,
            report_id: e.id,
            newUser : USER.name 
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
  
  
  const handleChangeStatus = (e) => {
      setStatus(e.value)
  }
  const handleChangeCustomerPhone = (e) => {
      setCustomerPhone(e.target.value)
  } 
 
   const handleChangeCustName = (e) => {
          setCustName(e.target.value)
  }  
  const handleChangeChalange = (e) => {
      setChalange(e.target.value)
  }  
  const handleChangeActionReport = (e) => {
          setActionReport(e.target.value)
  }
  // agent specific option
  
  
  const handleChangeComments = (e) => {
      setComments(e.target.value)
  }
  
  const handleChangeSuggestions = (e) => {
      setSuggestions(e.target.value)
  }
  const onChangeHandleRole = (e) => {
    setEmployee(e.value)
}

  
  
  
    // handle onsubmit for the edit action
    const onSubmitHandleEdit = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            name: state.country_name
        }
  
        axios.put(`${baseURL_PORTAL}report/${edit_record.name}`, formatData, CONFIG).then(res => {
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
  
    //console.log("servico" + service_id)
    // handle delete action
    const handleDelete = (e) => {
        setLoad(true);
        axios.delete(`${baseURL_PORTAL}report/${e.id}`, CONFIG).then(res => {
            setLoad(false);
            if (res.data.Success === true) {
                successToast("Report deleted successfully");
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
  
  const month_data = [
      {value:'JAN', label: "January"},
      {value:'FEB', label: "February"},
      {value:'MAR', label: "March"},
      {value:'APR', label: "April"},
      {value:'May', label: "May"},
      {value:'JUN', label: "June"},
      {value:'Jul', label: "July"},
      {value:'AUG', label: "August"},
      {value:'SEP', label: "September"},
      {value:'OCT', label: "October"},
      {value:'NOV', label: "November"},
      {value:'DEC', label: "December"}
  ]
  
    // add country action point
  
    const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            customerphone : customerphone ,
            custname : custname,
            challange : challange,
            action : actionReport,
            status : status,
            comments : comments,
            suggestions : suggestions,
            id_user : newUser,
            service : serviceId
        }
        console.log('userData', formatData)
        axios.post(`${baseURL_PORTAL}report`, formatData, CONFIG).then(res => {
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
                        <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Employee</label>
                                        </div>
                                        <div className="col-md-12">
                                            <Select 
                                                placeholder="Select Employee"
                                                autosize={true}
                                                isClearable 
                                                options={employee} onChange={e => onChangeHandleRole(e)} 
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                name="employee"
                                            />
                                        </div>

                                    </div>
                                </div>

                                  <div className="col-md-10-offset-1">
                                      <div className="form-group">
                                          <div className="col-md-12">
                                              <label className="form-label">Month</label>
                                          </div>
                                          <div className="col-md-12">
                                               <Select 
                                                  placeholder="Select Month"
                                                  autosize={true}
                                                  isClearable 
                                                  options={month_data} onChange={e => handleChangeStatus(e)} 
                                                  className="selected"
                                                  menuPortalTarget={document.body}
                                                  name="status"
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
export default DepositArchive;