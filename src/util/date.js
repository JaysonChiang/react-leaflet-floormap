
let util = {};
const right = function (str, num) {
    return str.substring(str.length - num, str.length)
}

util.datetick = function () {
    var date = new Date();
    var yyyy = '0000' + date.getFullYear().toString();
    var mm = '00' + (date.getMonth() + 1).toString();
    var dd = '00' + date.getDate().toString(); // getMonth() is zero-based
    var HH = '00' + date.getHours().toString();
    var MM = '00' + date.getMinutes().toString();
    var SS = '00' + date.getSeconds().toString();
    return right(yyyy, 4) + right(mm, 2) + right(dd, 2) + right(HH, 2) + right(MM, 2) + right(SS, 2) // padding
};

export default util;
