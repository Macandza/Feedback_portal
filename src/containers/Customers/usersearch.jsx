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

export const UserSearch = (props) => {

    //const u = props.USER;
    
    const [isVisible, setIsVisible] = useState(true)
    // hooks definations variables srtores
   
    //const [action, setAction] = useState("")
  
    //const [visible, setVisible] = useState(false);
   
    const [service_id, setService] = useState("")
    
  
   
   
  
    const [open_add, IsOpenAdd] = useState(false);  // define open edit modal
  
    const [edit_record, setEditRecord] = useState({}); // store the table row array
    const [data, setData] = useState([]);  // array of objects for data table  
    const [isLoading, setLoad] = useState(false); // loading state
    const [state, setState] = useState({
        //country_name: '',
    });
    const [randomstrng, setRandomString] = useState(''); // random string for the api
 
     // function being called once a component has been loaded
    useEffect(() => {
        setLoad(true);
         
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
  
 
    //console.log("user2"+)
   
    //console.log(newUser)
    const handleChangeService = (e) => {
        setService(e.value)
    }
    const onSubmitHandleAdd = (e) => {
        e.preventDefault();
        setLoad(true);
        let formatData = {
            service_id : service_id
        }

        //alert(service);
       // props.history.push('/customer?id=${service}');
        //history.push(`/product?make=${car_make_id}`
        props.history.push(
			`/deposits?service_id=${service_id}`
		);
	
       // ?make=${car_make_id}
    }
  
    //return function of UI
    return (
        
            <div>
                <form className="col-md-8 offset-md-2" onSubmit={onSubmitHandleAdd}>
                <span className="form__form-group-label">Service</span>
                      <div className="col-md-10-offset-1">
                            <div className="form-group">
                                  <div className="col-md-12">
                                              <label className="form-label"></label>
                                    </div>
                                    <div className="col-md-12">
                                        <Select 
                                            placeholder="Select Service"
                                            autosize={true}
                                            isClearable 
                                            options={service_id} onChange={e => handleChangeService(e)} 
                                            className="selected"
                                            menuPortalTarget={document.body}
                                            name="service_id"
                                        />
                                    </div>
  
                            </div>
                        </div>
                        <br></br>
                                  <div className="col-12">
                        <br />
                        <Button type="submit" outline color="primary" className="float-right" >
                            {"Switch"}  <i className="fa fa-search"></i>
                        </Button> &nbsp;&nbsp;&nbsp;
                    </div>
                    
                    
                </form>
             
          </div>
    )
    
  };export default UserSearch;