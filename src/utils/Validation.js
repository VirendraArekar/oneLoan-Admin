
export const isEmpty = (str) => {
    if(str === '')
    {
        return false;
    }
    return true;
}

export const isEmail = (str) => {
    if(!str.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) )
    {
        return false;
    }

    return true;
}

export const isMaxMin = (str, max_min, length = 6) => {
    if(max_min === 'min'){
        if(str.length < length){
            return false;
        }
        else{
            return true;
        }
    }
    else if(max_min === 'max'){
        if(str.length > length){
            return false;
        }
        else{
            return true;
        }
    }
}

