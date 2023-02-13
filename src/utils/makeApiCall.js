const axios = require('axios')
const makeApiCall=(url, method, data)=>{
    let options = {
        url: url,
        method: method,
        data: data
    };

    axios(options)
        .then(response => {
            console.log(`API call to ${url} succeeded with status ${response.status}`);
            console.log(response)
        })
        .catch(error => {
            console.log(`API call to ${url} failed with error: ${error}`);
        });
}

  module.exports=makeApiCall