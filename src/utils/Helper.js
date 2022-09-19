import { toast } from "react-toastify";
const toastObj = {position: toast.POSITION.TOP_RIGHT};

export const loanFullAddress = (loanAddress) => {
    return `House No - ${loanAddress.houseNo} Landmark - ${loanAddress.landmark} Locality - ${loanAddress.locality} Pincode - ${loanAddress.pincode} City - ${loanAddress.city}`;
}


export const loanShortAddress = (loanAddress) => {
    let address =  `House No - ${loanAddress.houseNo} Landmark - ${loanAddress.landmark} Locality - ${loanAddress.locality} Pincode - ${loanAddress.pincode} City - ${loanAddress.city}`;
    let shortAddress = address.substring(0, 19);
    return  shortAddress +( address.length > 20 ? '...' : '');
}

export const apiErrors = (errors) => {
    for(var i = 0; i < errors.length ; i++){
        toast.error(errors[i].messages[0], toastObj);
    }
}