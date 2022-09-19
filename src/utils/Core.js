import { toast } from "react-toastify";
import { postAPI } from "../network";
const toastObj = {position: toast.POSITION.TOP_RIGHT};

export  const setTitle = (title) => {
    document.title = title;
}

export const apiErrors = (errors) => {
    for(var i = 0; i < errors.length ; i++){
        toast.error(errors[i].messages[0], toastObj);
    }
}
export  const formatDate = (date) => {
    var d = new Date(date);
    return  (d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate()) + '-' + (d.getMonth().toString().length === 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1) + '-' + (d.getFullYear().toString().length === 1 ? `0${d.getFullYear()}` : d.getFullYear());
}


export const formatDatePost = (date) => {
    var d = new Date(date);
    return  (d.getFullYear().toString().length === 1 ? `0${d.getFullYear()}` : d.getFullYear()) + '-' + (d.getMonth().toString().length === 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1) + '-' + (d.getDate().toString().length === 1 ? `0${d.getDate()}` : d.getDate())  ;
}


export const getSetTime = (rowTime) => {
    let date = '2022-01-01';
    let am = rowTime.substring(5, 7).toLowerCase();
    let time = rowTime.substring(0, 5);
    date += ` ${time} ${am}`;
    return new Date(date);
}

export const timeFormat = (time) => {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}`.toString() : minutes;
    hours = hours < 10 ? `0${hours}`.toString() : hours;
    var strTime = hours + ':' + minutes  + ampm;
    return strTime;
  }

export const fullName = (item) => {
    return item.firstname  + ' ' +item.lastname;
}

export const setParams = (obj) => {
    var keys = Object.keys(obj);
    if(keys > 0){
       
    }
    else{
        return '';
    }
}


export const validation = (type = null, key,value) => {
    var reg =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var phoneno = /^\d{10}$/;
    if(type === null){
       if(value === '' || value.length < 3 ){
        warningMsg(`${key} is required! at least 3 character long.`);
        return true;
       }
       else{
        return false;
       }
    }
    else if(type === 'long'){
        if(value === '' || value.length < 10 ){
         warningMsg(`${key} is required! at least 10 character long.`);
         return true;
        }
        else{
         return false;
        }
     }
    else if(type === 'empty'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else{
         return false;
        }
     }
    else if(type === 'date'){
       if(value !== null){
        warningMsg(`${key} is required!`);
        return true;
       }
       else{
        return false;
       }
    }
    else if(type === 'time'){
        if(value !== null){
         warningMsg(`${key} is required!`);
         return true;
        }
        else{
         return false;
        }
    }
    else if(type === 'email'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(!value.match(reg)){
            warningMsg(`${key} is invalid!`);
            return true;
        }
        else{
            return false;
        }
    }
    else if(type === 'phone'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(!value.match(phoneno)){
            warningMsg(`${key} is invalid!`);
            return true;
        }
        else{
            return false;
        }
    }
    else if(type === 'password'){
        if(value === ''){
         warningMsg(`${key} is required!`);
         return true;
        }
        else if(value.length < 6){
            warningMsg(`${key} must be minimum 6 character long!`);
            return true;
        }
        else{
            return false;
        }
    }

    
}

export const warningMsg = (msg) => {
   toast.warning(msg, toastObj);
}