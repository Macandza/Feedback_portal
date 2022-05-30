import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../_assets/css/file.css"
import { Button, Card, CardBody, Table } from 'reactstrap';
import { baseURL, CONFIG, formatCurrency, useStyles } from '../../configs/exports';
import * as moment from 'moment';
import { Autorenew } from "@material-ui/icons";
import clsx from "clsx";
import { Link } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';


//loan hooks

const CuastomerStatement = (state) => {



    const [loan, setloan] = useState([])
    const [isLoading, setLoad] = useState(true)
    const [datatotal, setDataTotal] = useState()
    const [queryString, setQueryString] = useState("")

    // alert(JSON.stringifystate.location.state.loan_id)
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

        let url = baseURL + `customer_statement?filter_value=` + state.location.state.reference.reference;
        // alert(url)
        axios.all([
            axios.get(url, CONFIG)
        ]).then(axios.spread((loanResponse) => {
            let data = [];
            if (loanResponse.data.data.length > 0) {
                /**
               * @description If list is
               */
                let params = new URLSearchParams(queryString)

                let id = parseInt(params.get("page_number"))

                let p = 0;
                if (id > 1) {
                    p = (((id - 1) * parseInt(params.get("page_size"))))
                }

                setDataTotal(loanResponse.data.data.length)
                setLoad(false)
                for (let i = 0; i < loanResponse.data.data.length; i++) {
                    p++;
                    let unrow = { row: p }

                    let m_credit = { m_credit: formatCurrency(loanResponse.data.data[i].credit) };
                    let m_debit = { m_debit: formatCurrency(loanResponse.data.data[i].debit + loanResponse.data.data[i].interest) };
                    let m_balance = { m_balance: formatCurrency(loanResponse.data.data[i].balance) };
                    let date = { dates: (moment.utc(loanResponse.data.data[i].created_on).format('DD/MM/YYYY HH:mm:ss')) };
                    data.push(Object.assign(date, unrow, m_debit, m_credit, loanResponse.data.data[i]));
                    setLoad(false)
                }
                setDataTotal(loanResponse.data.total)
                setloan(data)
            } else {
                setLoad(false)
                setloan(data)
            }
        }))

    }, []);// eslint-disable-line react-hooks/exhaustive-deps


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
            text: "Debit",
            className: "tsc",
            align: "left"
        },

        {
            key: "m_credit",
            TrOnlyClassName: 'cell',
            text: "Credit",
            className: "tsc",
            align: "left"
        },
        {
            key: "m_debit",
            TrOnlyClassName: 'cell',
            text: "Balance",
            className: "tsc",
            align: "left"
        },

        {
            key: "description",
            TrOnlyClassName: 'cell',
            text: "Narrative",
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
                                        <h4> <b>Customer Statement</b> {state.location.state.reference.name}</h4>
                                    </div>
                                    <div className="col-3">
                                        <Link
                                            to={{
                                                pathname: '/customer_details',
                                                state: {
                                                    farmer: {
                                                        id: state.location.state.reference.id,
                                                        name: state.location.state.reference.name,
                                                        id_no: state.location.state.reference.id_no
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
                                    records={loan}
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
        </div >
    )

}
export default CuastomerStatement;