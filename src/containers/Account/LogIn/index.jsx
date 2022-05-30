/* eslint-disable max-len */
import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Form } from 'react-bootstrap';
import { Button } from 'reactstrap';
import { MDBCloseIcon } from "mdbreact"
import { baseURL, baseURL_PORTAL, CONFIG, errorToast, successToast, ToastTable } from '../../../configs/exports';
import axios from 'axios';
import CardIcon from 'mdi-react/CardIcon';
import Select from "react-select";
import './style2.css';

const LogIn = () => {

  // initialing hooks
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [email, setEmail] = useState("")
  //const [isLoading, setLoad] = useState(false) // loading state
 
  const [open, IsOpen] = useState(false);  // define open edit modal
  const [open_add, IsOpenAdd] = useState(false);  // define open edit modal
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState(null);
  const [openPassword, isOpenPassword] = React.useState(false);
  const [loading, isLoading] = React.useState('');
  const [loggedin, isLoggedIn] = React.useState(localStorage.getItem("isLoggedIn") ? true : false);
  const [state, setState] = useState({
    
});

const [randomstrng, setRandomString] = useState(''); // random string for the api

  useEffect(() => {
    // check if user was logged in
    
  axios.get(`${baseURL_PORTAL}country`, CONFIG).then (res => {
    let data = res.data.Countries
    // console.log(data)
    let country_data = data.map(d => ({
        "value" : d.id,
        "label" : d.name
    }))

    setTimeout(() => {
        setCountry(country_data)
    }, 300);
})

    
    if (loggedin) {
      // window.location.href = "find_customer";
    }
    
  }, [loggedin]);


  const handleChangeId = (e) => {
    setId(e.target.value)
} 
const handleChangeNanme = (e) => {
  setName(e.target.value)
}
// agent specific option


const handleChangeCountry = (e) => {
setCountry(e.value)
}

  const handleChangeUsername = event => {
    setUsername(event.target.value);
  };

  const handleChangePassword = event => {
    setPassword(event.target.value);
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
}

  const showPasswordToggle = () => {
    // eslint-disable-next-line
    if (showPassword == true) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };


  //submit function
  const onSubmit = e => {
    e.preventDefault();
    isLoading(true);
    if (username === "") {
      errorToast("Username is required")
    } else if (password === "") {
      errorToast("Password is required")
    }
    else {
      let formData = {
        "username": username,
        "password": password,
      }
      let url = baseURL_PORTAL + "authentication/login";
      // calling login files
      axios.post(url, formData, CONFIG).then((response) => {
        //console.log(response.data)

        if (response.data.success) {

          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("user", JSON.stringify(response.data.payload));
          localStorage.setItem("token", response.data.token);
          isLoggedIn(true);
          isLoading(false);
          successToast(response.data.message);
          window.setTimeout(() => {
            window.location.href = "find_customer";
          }, 3000);


        } else {
          errorToast(response.data.message);

        }

      }).catch(error => {

        isLoading(false);


        errorToast(error.response.data.message)

      })


      



    }
  };

  const closeModalReset = e => {
    isOpenPassword(false);
  };

  const resetpasswordchange = e => {
    isOpenPassword(true);
  };


  // reset password functions
  const onSubmitPasswordReset = e => {
    e.preventDefault();
    isLoading(true);
    let formData = {
      "username": this.state.username,
      "password": require("randomstring").generate({
        length: 5,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
      }),
    }
    axios.post(baseURL + 'updateUser', formData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      if (response.data.status) {
        successToast("Password reset successful. Check your phone")
        // eslint-disable-next-line
        window.setTimeout(() => {
          // alert(response.data.user.role)
          isOpenPassword(false);
          isLoading(false)
        }, 3000);
      }
      else {

        errorToast(response.data.message)
        window.setTimeout(() => {
          // alert(response.data.user.role)
          isLoading(false)
        }, 5000);
      }
    }).catch(error => {

      errorToast(error.data.message)
      window.setTimeout(() => {
        // alert(response.data.user.role)
        isLoading(false)
      }, 5000);
    });
  }


  //  close add modal
  const closeModalAdd = () => {
    IsOpenAdd(false)
}


const onSubmitHandleAdd = (e) => {
  e.preventDefault();
  isLoading(true);
  let formatData = {
      name: name, 
      username: username,
      email: email,
      password: password,
      id_no: id,
      country_id: country
      
  }

console.log('userData', formatData)
 
  
  
  axios.post(`${baseURL_PORTAL}authentication/register`, formatData, CONFIG).then(res => {
    isLoading(false);
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



}




  // return the UI
  return (
    <div className="elite-login">

      {ToastTable()}

      <Modal
        isOpen={openPassword}
        onRequestClose={e => {
          closeModalReset(e);
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
        <MDBCloseIcon onClick={closeModalReset} />
        <h4><b>Reset Password</b></h4>
        <>
          <Form className="form login-form" onSubmit={onSubmitPasswordReset}>
            {/*n  <h5><b>Get Agent Number</b></h5> */}
            <div className="form__form-group">
              <br></br>
              <span className="form__form-group-label">Username</span>
              <div className="form__form-group-field">
                <div className="form__form-group-icon">
                  <CardIcon />
                </div>
                <Form.Control
                  autoFocus
                  type="text"
                  name="username"
                  style={{ color: "black", borderColor: "hsl(0,0%,80%)" }}
                  placeholder="Enter your Username"
                  className="input-without-border-radius"
                  value={username}
                  onChange={handleChangeUsername}
                />
              </div>
              <br />
            </div>
            <div className="account__btns col-8 offset-2">
              <Button className="account__btn" type='submit' color="success"> {
                loading ? "Please wait..." : "Proceed"
              }</Button>
            </div>

          </Form>
        </>
      </Modal>


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
                <h4><b>Signing up</b></h4>
                <br></br>
                <>
                <Form className="form login-form" onSubmit={onSubmitHandleAdd} >
                        <div className="form__form-group">

                        <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Id</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="id" placeholder='id'
                                                value={id} onChange={handleChangeId} />
                                        </div>
                                    </div>
                                </div>

                         <div className="col-md-10-offset-1"><br />
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Name</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="text
                                                          " className="form-control"
                                                name="name" placeholder='Name'
                                                value={name} onChange={handleChangeNanme} />
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
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Email</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="email
                                                          " className="form-control"
                                                name="email" placeholder='Email'
                                                value={email} onChange={handleChangeEmail} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Password</label>
                                        </div>
                                        <div className="col-md-12">
                                            <input id="input" type="email
                                                          " className="form-control"
                                                name="password" placeholder='Email'
                                                value={password} onChange={handleChangePassword} />
                                        </div>
                                    </div>
                                </div>

                                                           

                                <div className="col-md-10-offset-1">
                                    <div className="form-group">
                                        <div className="col-md-12">
                                            <label className="form-label">Country</label>
                                        </div>
                                        <div className="col-md-12">
                                            <Select 
                                                placeholder="Select Country"
                                                autosize={true}
                                                isClearable 
                                                options={country} onChange={e => handleChangeCountry(e)} 
                                                className="selected"
                                                menuPortalTarget={document.body}
                                                name="country"
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

      <div className="elite-login-sec">
        <div className="row">
          <div className="col-md-6 elite-login-left">
            <div className="carousel-wrap">
              <div className="item">
                <div className="item-sec">
                  {/* <div className="login_slider_image"><img src={img} alt="logo" /></div> */}
                  <p className="item-text" style={{ color: "white" }}></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 elite-login-right">
            <h1 className="elite-login-head">Customers Feedback</h1>
            <form className="elite-login-form" onSubmit={onSubmit} >

              <div className="elite-form-field">
                <label htmlFor="user_email">Your username</label>
                <input className="form-control"
                  placeholder="Enter Username"
                  id="elite-username"
                  required="required"
                  type="text"
                  onChange={handleChangeUsername}
                  style={{ borderColor: "grey" }}
                  value={username}
                  name="username" />
              </div>



              <div className="elite-form-field">
                <label htmlFor="user_email">Password</label>
                <input
                  placeholder="Enter your password"
                  id="elite-email"
                  className="form-control"
                  required="required"
                  style={{ borderColor: "grey" }}
                  value={password}
                  onChange={handleChangePassword}
                  type={showPassword === true ? "text" : "password"}
                />
                <input type="hidden" name="user_timezone" id="user_timezone" />
                <span toggle="#password-field" onClick={showPasswordToggle} className="fa fa-fw fa-eye field-icon toggle-password" />

                <p className="elite-agent-pwd" >
                  <a href="hhtp" onClick={resetpasswordchange}
                    data-toggle="modal" data-target="#specialist-forgotModal">
                    Forgot Password?
                  </a></p>

                  <p className="elite-agent-pwd" >
                  <a href="hhtp" onClick={() => { IsOpenAdd(true) }}
                    data-toggle="modal" data-target="#specialist-forgotModal">
                    Sign up
                  </a></p>



                <br /><br />

                <br /><br />
                <br /><br />

              </div>

              <button type="submit" className="elite-form-btn"> {
                loading ? "Please wait..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(state => ({ theme: state.theme }))(LogIn);
