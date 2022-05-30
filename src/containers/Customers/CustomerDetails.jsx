import React, { useState, Fragment, useEffect } from 'react';
// import ReactDatatable from '@mkikets/react-datatable';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import "../../_assets/css/file.css"
import { baseURL, CONFIG, errorToast, successToast, ToastTable, USER } from '../../configs/exports';
import { Link, Redirect } from 'react-router-dom';
import Loader from "react-loader-spinner";
import "../../_assets/css/csv.css";
import ProductItems from '../../shared/components/catalog/ProductItems';
import * as moment from 'moment';
import {
    Col, Row,
    Card, CardBody, Table, Button, TabContent, TabPane,
} from 'reactstrap';

import Modal from 'react-modal';
import { Form } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact";
import Avatar from 'react-avatar';

const CustomerDetails = (state) => {

    const [isLoading, setLoad] = useState(true)
    const [datatotal, setDataTotal] = useState(0)
    const [queryString, setQueryString] = useState(`&page_number=1&page_size=100&sort_order=false`)

    // eslint-disable-next-line
    const [customer_data, setCustomer] = useState({})
    // eslint-disable-next-line


    const [open, IsOpen] = useState(false);


    const [open_limit, IsOpenLimit] = useState(false);

    const [customer_document, setCustomerDocuments] = useState({})

    const [state_value, setState] = useState({
        amount: ''
    })


    const [description, setDescription] = useState('')

    const [document_status, setDocumentStatus] = useState(false)

    const [loans, setLoan] = useState([])


    const [home, setHome] = useState(false)




    const [customer_statement, setStatement] = useState(false)

    const [statement_reference, setReference] = useState('')






    // const [avatar, setAvatar] = useState("") // set profile picture


    useEffect(() => {

        // consuming API based on active tab
        let customer_url = baseURL + `customer_profile?filter_value=${state.location.state.farmer.id}&id_no=${state.location.state.farmer.id_no}` + queryString;


        // tab 1 API call...
        axios.all([
            axios.get(customer_url, CONFIG),
        ]).then(axios.spread((customerResponse) => {
            let data = [];
            if (customerResponse.data.status) {
                // eslint-disable-next-line


                setCustomer(customerResponse.data.customer_info)
                setCustomerDocuments(customerResponse.data.customer_doc)


                if (customerResponse.data.customer_doc.length === undefined) {
                    setDocumentStatus(true)
                }


                if (customerResponse.data.data.length > 0) {


                    for (let i = 0; i < customerResponse.data.data.length; i++) {

                        // let mname, memail;

                        // if (customerResponse.data.data[i].name == null) {
                        //     mname = { mname: "_" };
                        // } else {
                        //     mname = { mname: customerResponse.data.data[i].name };
                        // }


                        // if (customerResponse.data.data[i].email == null) {
                        //     memail = { memail: "_" };
                        // } else {
                        //     memail = { memail: customerResponse.data.data[i].email };
                        // }

                        let f_amount = { f_amount: formatCurrency(parseFloat(customerResponse.data.data[i].total_amount).toFixed(2)) };
                        let f_amount_interest = { f_amount_interest: formatCurrency(parseFloat(customerResponse.data.data[i].interest).toFixed(2)) };

                        let f_amount_limit = { f_amount_limit: formatCurrency(parseFloat(customerResponse.data.data[i].loan_limit).toFixed(2)) };
                        let date = { dates: (moment.utc(customerResponse.data.data[i].created_on).format('DD/MM/YYYY')) };

                        let enddate = { enddates: (moment.utc(customerResponse.data.data[i].end_date).format('DD/MM/YYYY')) };
                        data.push(Object.assign(date, f_amount, f_amount_interest, f_amount_limit, enddate, customerResponse.data.data[i]));
                    }

                    setLoan(data)

                    setLoad(false)

                }
                setDataTotal(customerResponse.data.loan_counts)

                setLoad(false)

            } else {
                setLoad(false)
                setLoan(data)
            }
        })).catch(error => {


            // alert(JSON.stringify(error))
        })
    }, [queryString]);// eslint-disable-line react-hooks/exhaustive-deps

    const locale = 'en-US';
    const formatCurrency = amount => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: "ABS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replaceAll('ABS', "");
    };

    const config = {
        key_column: "tsc",
        length_menu: [100, 200, 500],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',
        page_size: 100,
        button: {
            csv: true,
            excel: true,
            print: true
        },
        show_length_menu: true,
        language: {
            loading_text: "Please be patient while data loads...",
            filter: "Tag ID..",
            no_data_text: "There was no record found",
            pagination: {
                next: <span>&#9658;</span>,
                previous: <span>&#9668;</span>
            }
        }
    }


    //livestock list

    const columns_livestock = [
        {
            key: "f_amount_limit",
            TrOnlyClassName: 'cell',
            text: "Limit",
            className: "tsc",
            align: "left"
        },
        {
            key: "f_amount",
            TrOnlyClassName: 'cell',
            text: "Amount Issued",
            className: "tsc",
            align: "left"
        },
        {
            key: "f_amount_interest",
            TrOnlyClassName: 'cell',
            text: "Interest",
            className: "tsc",
            align: "left"
        },


        {
            key: "action",
            text: "Status",
            TrOnlyClassName: 'cell',
            className: "cell",
            sortable: false,
            cell: record => {
                return (
                    <Fragment className="center" >

                        {record.status === 1 ?
                            <span class="badge-success" style={{ borderRadius: "5px", padding: "2px" }}>
                                Applied
                            </span>
                            :
                            record.status === 2 ?
                                <span class="badge-success" style={{ borderRadius: "5px", padding: "2px" }}>
                                    Paid
                                </span>

                                :
                                <>
                                    {
                                        record.status === 3 ?
                                            <span class="badge-danger" style={{ borderRadius: "5px", padding: "2px" }}>
                                                Defaulted
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
            key: "enddates",
            TrOnlyClassName: 'tsc',
            text: "End Date",
            className: "cell",
            align: "left"
        },
        {
            key: "dates",
            TrOnlyClassName: 'tsc',
            text: "Date Created",
            className: "cell",
            align: "left"
        },

        {
            key: "action",
            text: "Options",
            TrOnlyClassName: 'cell',
            className: "cell",
            sortable: false,
            cell: record => {
                return (
                    <Fragment className="center" >

                        <button className="btn btn-success btn-sm"
                            title="View pics Details"
                            style={
                                { marginRight: '10px' }}
                            onClick={() => { customerDetails(record) }} >
                            Statement
                        </button>

                    </Fragment>
                );
            }
        }
    ];






    // handles paginations
    const tableChangeHandler = data => {
        const b = Object.assign({}, data, { filter_value: state.location.state.farmer.id });
        // alert("Something")
        let queryString;
        if (b.filter_value === null || b.filter_value === '') {
            alert(JSON.stringify({ b }))

            queryString = Object.keys(b).map((key) => {
                if (key === "sort_order" && b[key]) {
                    return encodeURIComponent("sort_order") + '=' + encodeURIComponent(b[key].order) + '&' +
                        encodeURIComponent("sort_column") + '=' + encodeURIComponent(b[key].column)
                } else {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(b[key])
                }
            }).join('&');
        }
        else {
            queryString = Object.keys(data).map((key) => {
                if (key === "sort_order" && data[key]) {
                    return encodeURIComponent("sort_order") + '=' + encodeURIComponent(data[key].order) + '&' + encodeURIComponent("sort_column")
                        + '=' + encodeURIComponent(data[key].column)
                } else {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
                }
            }).join('&');
            // delete data.filter_value; // or use => delete test['blue'];
            // alert(JSON.stringify(data))
        }
        setQueryString(queryString)
    }

    const backHome = () => {
        setHome(true)
    }


    const customerDetails = (record) => {
        setStatement(true)
        setReference(record.reference)
    }




    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const closeModal = () => {
        IsOpen(false)
    }
    const openModal = () => {
        IsOpen(true)
    }


    const closeModalLimit = (e) => {
        IsOpenLimit(false)
    }
    const openModalLimit = () => {
        IsOpenLimit(true)
    }

    const onSubmitLimit = (e) => {
        e.preventDefault();
        setLoad(true)
        let formData = {
            amount: state_value.amount,
            customer_id: state.location.state.farmer.id,
            description: description,
            name: customer_data.name,
            msisdn: customer_data.msisdn,

        }
        axios.post(`${baseURL}update_limit`, formData, CONFIG).then(res => {
            setLoad(false)
            if (res.data.success) {
                successToast(res.data.message)
                setState({
                    ...state,
                    amount: ''
                })
                setTimeout(() => {
                    setQueryString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                    window.location.reload()

                }, 3000)
                closeModal(false)
            } else {
                errorToast(res.data.message)
                closeModal(false)
                setQueryString(require("randomstring").generate({
                    length: 1,
                    charset: 'alphanumeric',
                    capitalization: 'lowercase'
                }))
            }
        }).catch(err => {
            setLoad(false)
            closeModal(false)
            errorToast(err.message)
        })

    }

    const onSubmit = (e) => {
        e.preventDefault();
        setLoad(true)
        let formData = {
            amount: state_value.amount,
            customer_id: state.location.state.farmer.id,
            agent_id: USER.user_id

        }
        axios.put(`${baseURL}customer_documents`, formData, CONFIG).then(res => {
            setLoad(false)
            if (res.data.success) {
                successToast(res.data.message)
                setState({
                    ...state,
                    amount: ''
                })
                setTimeout(() => {
                    setQueryString(require("randomstring").generate({
                        length: 1,
                        charset: 'alphanumeric',
                        capitalization: 'lowercase'
                    }))
                    window.location.reload()

                }, 3000)

                closeModal(false)
            } else {
                errorToast(res.data.message)
                closeModal(false)
                setQueryString(require("randomstring").generate({
                    length: 1,
                    charset: 'alphanumeric',
                    capitalization: 'lowercase'
                }))


            }
        }).catch(err => {

            setLoad(false)
            closeModal(false)
            errorToast(err.message)
        })

    }

    //UI returned
    return (
        <div style={{ marginTop: "-20px" }} >
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
                <h4><b>Set Stock Value</b></h4>
                <br></br>
                <>
                    <Form className="form login-form" >
                        <div className="form__form-group">
                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Stock Value</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="number" className="form-control"
                                            name="amount" placeholder='Stock Value'
                                            value={state_value.amount} onChange={handleChange} />
                                    </div>
                                </div>
                                <br /><br />
                            </div>

                            <div className="account__btns col-8 offset-2" >
                                <Button className="account__btn" type='submit' onClick={onSubmit} color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                }</Button>
                            </div>
                        </div>
                    </Form>
                </>
            </Modal>


            <Modal
                isOpen={open_limit}
                onRequestClose={e => {
                    closeModalLimit(e);
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
                <MDBCloseIcon onClick={closeModalLimit} />
                <h4><b>Set Limit Value</b></h4>
                <br></br>
                <>
                    <Form className="form login-form" >
                        <div className="form__form-group">
                            <div className="col-md-10-offset-1"><br />
                                <div className="form-group">
                                    <div className="col-md-12">
                                        <label className="form-label">Loan Limit</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input id="input" type="number" className="form-control"
                                            name="amount" placeholder='Enter Amount'
                                            value={state_value.amount} onChange={handleChange} />
                                    </div>
                                </div>
                                <br /><br />
                            </div>

                            <div className="form-group" >
                                <div className="row" >
                                    <div className="col-md-12" >
                                        <textarea name="description"
                                            style={
                                                { paddingTop: '20px' }}
                                            onChange={e => {
                                                setDescription(e.target.value)
                                            }}
                                            className="col-md-12"
                                            placeholder="type your reason here"
                                            id="description"
                                            cols="col-md-1"
                                            rows="20" >
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />


                            <div className="account__btns col-8 offset-2" >
                                <Button className="account__btn" type='submit' onClick={onSubmitLimit} color="success"> {
                                    isLoading ? "Please wait..." : "Submit"
                                }</Button>
                            </div>
                        </div>
                    </Form>
                </>
            </Modal>


            {customer_statement ?
                <Redirect
                    to={{
                        pathname: '/customer_statement',
                        state: {
                            reference: {
                                reference: statement_reference,
                                id: state.location.state.farmer.id,
                                name: state.location.state.farmer.name,
                                id_no: state.location.state.farmer.id_no
                            }
                        }
                    }}
                /> : null}

            {
                home === true ?
                    <>
                        <Redirect to="customers" />
                    </> :

                    <Card>
                        <CardBody className="profile__card">
                            <br />
                            <div className="row col-12">
                                <div className="col-6">

                                    <div className="profile__information">
                                        <div className="profile__avatar">
                                            <Avatar name={state.location.state.farmer.name} />
                                        </div>


                                        <div className="profile__data">
                                            <br />
                                            <p className="profile__name" style={{ marginBottom: "10px" }}>Farmer Name: {customer_data.name}</p>
                                            <p className="profile__name" style={{ marginBottom: "10px" }}>ID No: {customer_data.id_no}</p>
                                            <p className="profile__name" style={{ marginBottom: "10px" }}>STOCK AMOUNT: <b style={{ color: 'green' }}> {formatCurrency(customer_data.stock_amount)}</b></p>
                                            <p className="profile__name" style={{ marginBottom: "10px" }}>LOAN LIMIT: <b style={{ color: 'green' }}> {formatCurrency(customer_data.loan_limit)}</b></p>

                                            <p className="profile__name" style={{ marginBottom: "10px" }}>


                                                <Row>
                                                    {document_status === true ?
                                                        <>
                                                            <a href={customer_document.mpesa_statement}>
                                                                <Button className="pull-left btn-sm btn btn-primary" style={{ color: "white" }}>
                                                                    MPesa Statement
                                                                </Button>
                                                            </a>&nbsp;&nbsp;

                                                            <a href={customer_document.business_permit} >
                                                                <Button className="pull-left btn-sm btn btn-primary" style={{ color: "white" }}>
                                                                    Business Permit
                                                                </Button>
                                                            </a>&nbsp;&nbsp;

                                                            <a href={customer_document.kra_pin}>
                                                                <Button className="pull-left btn-sm btn btn-primary" style={{ color: "white" }}>
                                                                    KRA PIN
                                                                </Button>
                                                            </a>
                                                            <Link to={{
                                                                pathname: '/customer_deposits',
                                                                state: {
                                                                    farmer_name: state.location.state.farmer.name,
                                                                    farmer_id: state.location.state.farmer.id,
                                                                    id_no: state.location.state.farmer.id_no,
                                                                }
                                                            }}>
                                                                <Button className="pull-left btn-sm btn btn-primary" style={{ color: "white" }}>
                                                                    Customer Deposits
                                                                </Button>
                                                            </Link>


                                                        </>
                                                        : <h4 style={{ color: "red" }}>Documents not uploaded</h4>
                                                    }


                                                </Row>

                                            </p>
                                        </div>

                                    </div>

                                </div>

                                <div className="col-4">
                                    {document_status === true ?
                                        customer_data.check_status === 0 ?
                                            USER.role === "agent" ?
                                                <Button className="pull-left btn-sm btn btn-danger" onClick={openModal} style={{ color: "white" }}>
                                                    Record Stock Value
                                                </Button>
                                                : null
                                            :
                                            customer_data.check_status === 1 ?
                                                USER.role === 'admin' ? <Button className="pull-left btn-sm btn btn-danger" onClick={openModalLimit} style={{ color: "white" }}>
                                                    Set Loan Limit
                                                </Button> : <h4 style={{ color: "green" }}>Documents Verified!</h4>
                                                : null
                                        : null
                                    }
                                </div>
                                <div className="col-2">

                                    <>
                                        <Button className="pull-right btn-sm" onClick={backHome} outline color="primary">
                                            Back to Customers
                                        </Button>
                                    </>
                                </div>
                            </div>
                            <div className="tabs tabs--bordered-top" >
                                <div className="tabs__wrap">

                                    {isLoading === false ?
                                        <TabContent>

                                            <TabPane>
                                                {document_status === true ?


                                                    <Row>
                                                        <Col md={12} lg={12}>
                                                            <ProductItems items={
                                                                [
                                                                    {
                                                                        id: 1,
                                                                        src: `${customer_document.id_front}`,
                                                                        title: 'ID Front',
                                                                        colors: ['#00b3c6', '#50e3c2', '#fa4a86'],
                                                                    },
                                                                    {
                                                                        id: 2,
                                                                        src: `${customer_document.id_back}`,
                                                                        title: 'ID Back Page',
                                                                        colors: ['#d4d4d4', '#5ff4d3', '#f7a9c4'],
                                                                    },
                                                                ]
                                                            } />
                                                        </Col>
                                                    </Row>
                                                    : null}
                                                <div >
                                                    Your loans Total Loans: <b>{datatotal}</b>
                                                </div>
                                                <Table>

                                                    <ReactDatatable
                                                        config={config}
                                                        records={loans}
                                                        columns={columns_livestock}
                                                        dynamic={true}
                                                        id="tsc"
                                                        loading={isLoading}
                                                        total_record={datatotal}
                                                        onChange={tableChangeHandler} />
                                                </Table>
                                            </TabPane>
                                        </TabContent>
                                        :
                                        <div className="text-center h-50">
                                            <Loader
                                                type="Puff"
                                                color="#00BFFF"
                                                height={50}
                                                width={50} //3 secs
                                            />
                                        </div>
                                    }


                                </div>
                            </div >
                        </CardBody >

                    </Card >
            }



        </div >
    );
}

export default CustomerDetails;
