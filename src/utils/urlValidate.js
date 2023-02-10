const validateUrl = (url) => {
    // This function is used for validate the URL
    let regexpression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (regexpression.test(url)) {
        return true;
    } else {
        return false;
    }
}

module.exports = validateUrl