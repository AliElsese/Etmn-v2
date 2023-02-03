const connectDB = require("../database/connection");

module.exports = {
    supervisorLogin : (req,res) => {
        let phone = req.body.phone,
            password = req.body.password

        connectDB.query('SELECT * FROM supervisors WHERE phone = ?' , [phone] , (err,supervisor) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!supervisor || supervisor.length == 0) {
                var object = {
                    status : 400 ,
                    message : 'هذا المستخدم غير موجود' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(supervisor[0].password != password) {
                    var object = {
                        status : 400 ,
                        message : 'كلمة السر غير صحيحة' ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    var object = {
                        status : 200 ,
                        message : 'تم التسجيل' ,
                        errors : [] ,
                        data : supervisor
                    }
                    res.send(object)
                }
            }
        })
    },

    showRequests : (req,res) => {
        let supervisorid = req.body.supervisorid,
            requestStatus = 'false'

        connectDB.query('SELECT * FROM supervisors WHERE supervisorid = ?' , [supervisorid] , (err,supervisor) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(supervisor[0].supervisorstatus == 'true') {
                    connectDB.query('SELECT * FROM requests WHERE gouvernement = ? AND requestStatus = ?' , [supervisor[0].gouvernement,requestStatus] , (err,requests) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else if(!requests || requests.length == 0) {
                            var object = {
                                status : 200 ,
                                message : 'لا توجد الطلبات' ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'جميع الطلبات' ,
                                errors : [] ,
                                data : requests
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    connectDB.query('SELECT * FROM requests WHERE city = ? AND requestStatus = ?' , [supervisor[0].city,requestStatus] , (err,requests) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else if(!requests || requests.length == 0) {
                            var object = {
                                status : 200 ,
                                message : 'لا توجد الطلبات' ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'جميع الطلبات' ,
                                errors : [] ,
                                data : requests
                            }
                            res.send(object)
                        }
                    })
                }
            }
        })
    },

    showSolvedRequests : (req,res) => {
        let supervisorid = req.body.supervisorid,
            requestStatus = 'true'

        connectDB.query('SELECT * FROM supervisors WHERE supervisorid = ?' , [supervisorid] , (err,supervisor) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(supervisor[0].supervisorstatus == 'true') {
                    connectDB.query('SELECT * FROM requests WHERE gouvernement = ? AND requestStatus = ?' , [supervisor[0].gouvernement,requestStatus] , (err,requests) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else if(!requests || requests.length == 0) {
                            var object = {
                                status : 200 ,
                                message : 'لا توجد الطلبات' ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'جميع الطلبات' ,
                                errors : [] ,
                                data : requests
                            }
                            res.send(object)
                        }
                    })
                }
                else {
                    connectDB.query('SELECT * FROM requests WHERE city = ? AND requestStatus = ?' , [supervisor[0].city,requestStatus] , (err,requests) => {
                        if(err) {
                            var object = {
                                status : 400 ,
                                message : `${err}` ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else if(!requests || requests.length == 0) {
                            var object = {
                                status : 200 ,
                                message : 'لا توجد الطلبات' ,
                                errors : [] ,
                                data : []
                            }
                            res.send(object)
                        }
                        else {
                            var object = {
                                status : 200 ,
                                message : 'جميع الطلبات' ,
                                errors : [] ,
                                data : requests
                            }
                            res.send(object)
                        }
                    })
                }
            }
        })
    }
}