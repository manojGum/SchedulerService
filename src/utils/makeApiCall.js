const axios = require('axios')
const makeApiCall=async (url,reqtype)=>{
    try{
       
        if(reqtype=="get"|| "GET"){
            console.log("check",url)
          await axios.get(url);
        }else if(reqtype=="POST"|| "POST"){
           await axios.post(url);
        }
        else if(reqtype=="put"|| "PUT"){
            await axios.put(url);
        }else if(reqtype=="delete"|| "DELETE"){
            await axios.delete(url);
        }


    }catch(error){
        console.log(error)
        
    }
  }

  module.exports=makeApiCall