
const token = localStorage.getItem('token');

export const fetchGet = async (url, params = null) => {
   try{
       const res = await fetch(url);
       if(!res.status){
           console.log(res.message);
           const msg = `An error occurred : ${res.message}`;
           throw new Error(msg);
       }
       return await res.json();
   }
   catch(err){
     console.log(err);
     const msg = 'Something went wrong.';
     throw new Error(msg);
   }
}

export const fetchPost = async (url, postData = {}) => {
    try{
       const res = await fetch(url,{
           method : "post",
           headers : {
               "Content-Type" : "application/json",
               "Authorization" : `Bearer ${token}`
           },
           body : JSON.stringify(postData),
       });

       if(!res.status){
           console.log(res.message);
           const msg = `An error has occurred: ${res.message}`;
           throw new Error(msg);
       }
       return await res.json();
    }
    catch(err){
        console.log(err);
        const msg = `Something went wrong.`;
        throw new Error(msg);
    }
}


export const fetchPut = async (url, postData = {}) => {
    try{
       const res = await fetch(url,{
           method : "put",
           headers : {
               "Content-Type" : "application/json",
               "Authorization" : `Bearer ${token}`
           },
           body : JSON.stringify(postData),
       });

       if(!res.status){
           console.log(res.message);
           const msg = `An error has occurred: ${res.message}`;
           throw new Error(msg);
       }
       return await res.json();
    }
    catch(err){
        console.log(err);
        const msg = `Something went wrong.`;
        throw new Error(msg);
    }
}


export const fetchPatch = async (url, postData = {}) => {
    try{
       const res = await fetch(url,{
           method : "patch",
           headers : {
               "Content-Type" : "application/json",
               "Authorization" : `Bearer ${token}`
           },
           body : JSON.stringify(postData),
       });

       if(!res.status){
           console.log(res.message);
           const msg = `An error has occurred: ${res.message}`;
           throw new Error(msg);
       }
       return await res.json();
    }
    catch(err){
        console.log(err);
        const msg = `Something went wrong.`;
        throw new Error(msg);
    }
}



export const fetchDelete = async (url, postData = {}) => {
    try{
       const res = await fetch(url,{
           method : "delete",
           headers : {
               "Content-Type" : "application/json",
               "Authorization" : `Bearer ${token}`
           },
       });

       if(!res.status){
           console.log(res.message);
           const msg = `An error has occurred: ${res.message}`;
           throw new Error(msg);
       }
       return await res.json();
    }
    catch(err){
        console.log(err);
        const msg = `Something went wrong.`;
        throw new Error(msg);
    }
}