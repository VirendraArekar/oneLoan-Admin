import { axiosInstance } from "./axiosSetup";
import { toast } from "react-toastify";
import { apiErrors } from "../utils/Helper";



const toastObj = {position: toast.POSITION.TOP_RIGHT};

const responseCheck = (res) => {
    if(res.code === 200 || res.code === 201 || res.code === 204){
        return true;
    }
    else{
        return false;
    }
}

export  const getAPI = async(url) => {
    try {
        const response = await axiosInstance.get(url);
        if(responseCheck){
            return response.data.data;
            
        }
        else{
            toast.error(response.data.message,toastObj);
            return false;
        }
    } catch (err) {
        let errs = err.response.data.errors;
        apiErrors  (errs)
        return false;
    }
}


export  const postAPI = async(url,data) => {
    try {
        const response = await axiosInstance.post(url, data);
        if(responseCheck){
            toast.success(response.data.message,toastObj);
            return response.data;
        }
        else{
            toast.error(response.data.message,toastObj);
            return false;
        }
    } catch (err) {
        let errs = err.response.data.errors;
        apiErrors(errs)
        return false;
    }
}


export  const putAPI = async(url,data) => {
    try {
        const response = await axiosInstance.put(url, data);
        if(responseCheck){
            toast.success(response.data.message,toastObj);
            return response.data;
        }
        else{
            toast.error(response.data.message,toastObj);
            return false;
        }
    } catch (err) {
        let errs = err.response.data.errors;
        apiErrors(errs)
        return false;
    }
}

export  const deleteAPI = async(url) => {
    try {
        const response = await axiosInstance.delete(url);
        if(responseCheck){
            toast.success(response.data.message,toastObj);
            return response.data;
        }
        else{
            toast.error(response.data.message,toastObj);
            return false;
        }
    } catch (err) {
        let errs = err.response.data.errors;
        apiErrors(errs)
        return false;
    }
}