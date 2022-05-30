import React, { useState, useEffect } from 'react';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import "../../_assets/css/file.css"
import { Button, Card, CardBody, Table } from 'reactstrap';
import { baseURL, CONFIG, formatCurrency, useStyles } from '../../configs/exports';
import * as moment from 'moment';
import { Autorenew } from "@material-ui/icons";
import clsx from "clsx";
import { Link } from 'react-router-dom';


//farmer hooks

const CustomerDeposit = (state) => {

    const [farmer, setFarmer] = useState([])
    const [isLoading, setLoad] = useState(true)
    const [datatotal, setDataTotal] = useState()
    const [queryString, setQueryString] = useState("")

    // alert(state.location.state.farmer_id)
    const [spin, setSpin] = useState(false);
    const refreshCanvas = () => {
        setSpin(true);
        setTimeout(() => {
            setSpin(false);
        }, 1000);
    };
    const classes = useStyles();


    useEffect(() => {
        setLoad(true)

        let url = baseURL + `loan_deposits?loan_id=` + state.location.state.farmer_id;
        // alert(url)
        axios.all([
            axios.get(url, CONFIG)
        ]).then(axios.spread((farmerResponse) => {
            let data = [];
            if (farmerResponse.data.data.length > 0) {

                /**
               * @description If list is
               */
                let params = new URLSearchParams(queryString)
                let id = parseInt(params.get("page_number"))

                let p = 0;
                if (id > 1) {
                    p = (((id - 1) * parseInt(params.get("page_size"))))
                }

                setDataTotal(farmerResponse.data.data.length)
                setLoad(false)
                for (let i = 0; i < farmerResponse.data.data.length; i++) {
                    p++;
                    let unrow = { row: p }
                    let m_debit = { m_debit: formatCurrency(farmerResponse.data.data[i].amount) };
                    let date = { dates: (moment.utc(farmerResponse.data.data[i].created_on).format('DD/MM/YYYY HH:mm:ss')) };
                    data.push(Object.assign(date, unrow, m_debit, farmerResponse.data.data[i]));
                    setLoad(false)
                }
                setDataTotal(farmerResponse.data.total)
                setFarmer(data)
            } else {
                setLoad(false)
                setFarmer(data)
            }
        }))

    }, [queryString]);// eslint-disable-line react-hooks/exhaustive-deps


    const config = {
        key_column: "tsc",
        length_menu: [20, 100, 200, 500],
        show_filter: false,
        show_pagination: false,
        pagination: 'advance',
        page_size: 20,
        button: {
            csv: true,
            excel: true,
            print: true
        },
        show_length_menu: false,
        language: {
            loading_text: "Please be patient while data loads...",
            filter: "Transaction ID/Reference..",
            no_data_text: "There was no record found",
            pagination: {
                next: <span>&#9658;</span>,
                previous: <span>&#9668;</span>
            }
        }
    }

    const columns = [
        {
            key: "row",
            TrOnlyClassName: 'cell',
            text: "#",
            className: "tsc",
            align: "left"
        },
        {
            key: "m_debit",
            TrOnlyClassName: 'cell',
            text: "Amount",
            className: "tsc",
            align: "left"
        },

        {
            key: "transaction_id",
            TrOnlyClassName: 'cell',
            text: "Transaction ID",
            className: "tsc",
            align: "left"
        },
        {
            key: "dates",
            TrOnlyClassName: 'cell', text: "Date",
            className: "tsc",
            align: "left"
        }
    ];



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



    return (
        <div style={{ marginTop: "-20px" }} >
            < >
                < Card >
                    <CardBody >
                        <Table responsive hover>
                            <div className="panel-body" >
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4> <b>Deposits</b> {state.location.state.farmer_name}</h4>
                                    </div>
                                    <div className="col-3">
                                        <Link
                                            to={{
                                                pathname: '/customer_details',
                                                state: {
                                                    farmer: {
                                                        name: state.location.state.farmer_name,
                                                        id: state.location.state.farmer_id,
                                                        id_no: state.location.state.id_no
                                                    }
                                                }
                                            }}>
                                            <Button className="pull-right btn-sm" outline color="primary">
                                                Swtich back
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="col-3">

                                        <button className="float-right" title="refresh" style={{ background: "white", border: "0px" }}

                                            onClick={
                                                () => {
                                                    refreshCanvas()
                                                    setQueryString(require("randomstring").generate({
                                                        length: 1,
                                                        charset: 'alphanumeric',
                                                        capitalization: 'lowercase'
                                                    }))
                                                }}
                                        >
                                            Refresh
                                            <Autorenew
                                                className={clsx({
                                                    [classes.refresh]: true,
                                                    spin: spin
                                                })}
                                                onClick={
                                                    () => {
                                                        refreshCanvas()
                                                        setQueryString(require("randomstring").generate({
                                                            length: 1,
                                                            charset: 'alphanumeric',
                                                            capitalization: 'lowercase'
                                                        }))
                                                    }}
                                                spin={360}
                                            />

                                        </button>
                                    </div>
                                </div>
                                <br />
                                <ReactDatatable
                                    config={config}
                                    records={farmer}
                                    columns={columns}
                                    dynamic={true}
                                    id="tsc"
                                    loading={isLoading}
                                    total_record={datatotal}
                                    onChange={tableChangeHandler} />
                            </div>
                        </Table>
                    </CardBody>


                </Card>

            </>
        </div>
    )

}
export default CustomerDeposit;