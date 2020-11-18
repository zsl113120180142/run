// 验证ip
export function validateIP(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的IP地址'));
        } else {
            callback();
        }
    }
}

//   验证电话号码
export function validatePhone(rule, value, callback) {
    const reg = /^[1][3-9][0-9]{9}$/;
    if (value == '' || value == undefined || value == null) {
        callback();
    } else {
        if ((!reg.test(value)) && value != '') {
            callback(new Error('请输入正确的电话号码'));
        } else {
            callback();
        }
    }
}


//   两位小数验证
const validateValidity = (rule, value, callback) => {
    if (!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
        callback(new Error('最多两位小数！！！'));
    } else {
        callback();
    }
};
//   密码校检
export const validatePsdReg = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入密码'))
    }
    if (!/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,10}$/.test(value)) {
        callback(new Error('请输入6-10位字母、数字或者符号组合'))
    } else {
        callback()
    }
};

//   纯数字校检
export const validateNumber = (rule, value, callback) => {
    let numberReg = /^\d+$|^\d+[.]?\d+$/;
    if (value !== '') {
        if (!numberReg.test(value)) {
            callback(new Error('请输入纯数字'))
        } else {
            callback()
        }
    } else {
        callback(new Error('请输入值'))
    }
};
// 姓名校检
export const validateName = (rule, value, callback) => {
    let reg=/^[\u2E80-\u9FFF]+$/;//Unicode编码中的汉字范围
    if (value && value.length > 0) {
        if(!reg.test(value)){
            callback([new Error('姓名输入不合法')]);
        }else{
            callback();
        }
    }else if(value.length == 0){
        callback();
    } else {
        callback(new Error('姓名输入不合法'));
    }
}