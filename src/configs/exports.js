import React from "react";
import { makeStyles } from "@material-ui/core";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

// export const baseURL = "http://0.0.0.0:1400/";
export const baseURL = "https://api.stawishabiashara.com/";
export const baseURL_PORTAL = "http://localhost:9000/api/feedback/"

export const logout = () => {
    window.location.href = "/";
    // localStorage.removeItem("token");
}
//isLogged In
export const isLoggedIn = localStorage.getItem('isLoggedIn') ? true : false;   // localstorage data retrieval
export const TOKEN = localStorage.getItem('token');
export const USER = JSON.parse(localStorage.getItem('user'));

// header configurations



export const CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-access-token': localStorage.getItem('token')
    },
};



export const CONFIG_FILES = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-access-token': localStorage.getItem('token')
    },
};

export const formatCurrency = amount => {
    return (parseInt(amount)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).replaceAll('ABS', '');

};

// //currency
// export const formatCurrency = amount => {
//     return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: "ABS",
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(amount).replaceAll('ABS', "");
// };


export const useStyles = makeStyles((theme) => ({
    refresh: {
        marginTop: "20px",
        cursor: "pointer",
        margin: "auto",
        "&.spin": {
            animation: "$spin 1s 1",
            pointerEvents: 'none'
        }
    },
    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)"
        },
        "100%": {
            transform: "rotate(360deg)"
        }
    }
}));
// end of page refresh

export const ToastTable = () => {
    return (<ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="colored"
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
    )
}

export const errorToast = (statusMessage) => {
    return (
        toast.error(statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    )
}

export const successToast = (statusMessage) => {
    return (
        toast.success(statusMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    )
}
