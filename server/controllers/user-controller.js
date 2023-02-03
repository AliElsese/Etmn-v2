const connectDB = require('../database/connection');
const FCM = require('fcm-node');
var fcm = new FCM(process.env.SERVER_KEY_USER)

module.exports = {
    userRegister : (req,res) => {
        connectDB.query('SELECT * FROM users WHERE phone = ?' , [req.body.phone] , (err,users) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!users || users.length == 0) {
                let user = {
                    name : req.body.name,
                    age : req.body.age,
                    gender : req.body.gender,
                    gouvernement : req.body.gouvernement,
                    city : req.body.city,
                    ministryname : req.body.ministryname,
                    workname : req.body.workname,
                    phone : req.body.phone,
                    address : req.body.address,
                    password : req.body.password
                }
                connectDB.query('INSERT INTO users SET ?' ,[user] , (err,result) => {
                    if(err) {
                        var object = {
                            status : 400 ,
                            message : `${err}` ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                    else{
                        var object = {
                            status : 200 ,
                            message : 'تم التسجيل' ,
                            errors : [] ,
                            data : []
                        }
                        res.send(object)
                    }
                })
            }
            else {
                var object = {
                    status : 400 ,
                    message : 'رقم الهاتف مستخدم من قبل' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    userLogin : (req,res) => {
        let phone = req.body.phone,
            password = req.body.password,
            usertoken = req.body.usertoken

        connectDB.query('SELECT * FROM users WHERE phone = ?' , [phone] , (err,user) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!user || user.length == 0) {
                var object = {
                    status : 400 ,
                    message : 'هذا المستخدم غير موجود' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(user[0].password != password) {
                    var object = {
                        status : 400 ,
                        message : 'كلمة السر غير صحيحة' ,
                        errors : [] ,
                        data : []
                    }
                    res.send(object)
                }
                else {
                    connectDB.query('UPDATE users SET usertoken = ? WHERE userid = ?' , [usertoken,user[0].userid] , (err,result) => {
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
                            var object = {
                                status : 200 ,
                                message : 'تم التسجيل' ,
                                errors : [] ,
                                data : { userid : user[0].userid }
                            }
                            res.send(object)
                        }
                    })
                }
            }
        })
    },

    showSlider : (req,res) => {
        connectDB.query('SELECT postImage FROM posts ORDER BY RAND() LIMIT 1' , (err,images) => {
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
                var object = {
                    status : 200 ,
                    message : 'جميع الاخبار' ,
                    errors : [] ,
                    data : images
                }
                res.send(object)
            }
        })
    },

    showPosts : (req,res) => {
        connectDB.query('SELECT title,description,postImage FROM posts' , (err,posts) => {
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
                var object = {
                    status : 200 ,
                    message : 'جميع الاخبار' ,
                    errors : [] ,
                    data : posts
                }
                res.send(object)
            }
        })
    },

    sendRequest : (req,res) => {
        let tokens = []
        connectDB.query('SELECT userid,usertoken FROM users WHERE workname = ?' , [req.body.workname] , (err,users) => {
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
                for(var i = 0; i < users.length; i++) {
                    tokens.push(users[i].usertoken)
                }
                if(!req.file) {
                    let request1 = {
                        userid : req.body.userid,
                        ministryname : req.body.ministryname,
                        workname : req.body.workname,
                        gouvernement : req.body.gouvernement,
                        city : req.body.city,
                        request : req.body.request,
                        requestImage : '',
                        requestVoice : req.body.requestVoice
                    }
                    connectDB.query('INSERT INTO requests SET ?' , [request1] , (err,result) => {
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
                            for(var x = 0; x < users.length; x++) {
                                let notification = {
                                    userid : users[x].userid,
                                    notification : 'لديك طلب جديد'
                                }
                                connectDB.query('INSERT INTO notifications SET ?' , [notification] , (err,results) => {
                                    if(err) {
                                        var object = {
                                            status: 400,
                                            message: `${err}`,
                                            errors: [],
                                            data: []
                                        }
                                        res.send(object)
                                    }
                                })
                            }
                            var message = { 
                                registration_ids: tokens,

                                notification: {
                                    title: 'ETMN notification',
                                    body: 'لديك طلب جديد',
                                    "click_action": "FCM_PLUGIN_ACTIVITY",
                                    "icon": "fcm_push_icon"
                                },

                                data: {
                                    requestid : result.insertId
                                }
                            };
                            fcm.send(message, function (err, response1) {
                                if (err) {
                                    var object = {
                                        status: 400,
                                        message: `${err}`,
                                        errors: [],
                                        data: []
                                    }
                                    res.send(object)
                                }
                                else {
                                    var object = {
                                        status: 200,
                                        message: 'تم ارسال طلبك',
                                        errors: [],
                                        data: { requestid : result.insertId }
                                    }
                                    res.send(object)
                                }
                            })
                        }
                    })
                }
                else {
                    let request1 = {
                        userid : req.body.userid,
                        ministryname : req.body.ministryname,
                        workname : req.body.workname,
                        gouvernement : req.body.gouvernement,
                        city : req.body.city,
                        request : req.body.request,
                        requestImage : `server/uploads/${req.file.filename}`,
                        requestVoice : req.body.requestVoice
                    }
                    connectDB.query('INSERT INTO requests SET ?' , [request1] , (err,result) => {
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
                            for(var x = 0; x < users.length; x++) {
                                let notification = {
                                    userid : users[x].userid,
                                    notification : 'لديك طلب جديد'
                                }
                                connectDB.query('INSERT INTO notifications SET ?' , [notification] , (err,results) => {
                                    if(err) {
                                        var object = {
                                            status: 400,
                                            message: `${err}`,
                                            errors: [],
                                            data: []
                                        }
                                        res.send(object)
                                    }
                                })
                            }
                            var message = { 
                                registration_ids: tokens,

                                notification: {
                                    title: 'ETMN notification',
                                    body: 'لديك طلب جديد',
                                    "click_action": "FCM_PLUGIN_ACTIVITY",
                                    "icon": "fcm_push_icon"
                                },

                                data: {
                                    requestid : result.insertId
                                }
                            };

                            fcm.send(message, function (err, response1) {
                                if (err) {
                                    var object = {
                                        status: 400,
                                        message: `${err}`,
                                        errors: [],
                                        data: []
                                    }
                                    res.send(object)
                                }
                                else {
                                    var object = {
                                        status: 200,
                                        message: 'تم ارسال طلبك',
                                        errors: [],
                                        data: { requestid : result.insertId }
                                    }
                                    res.send(object)
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    addCitizenDetails : (req,res) => {
        let citizen = {
            name : req.body.name,
            age : req.body.age,
            gender : req.body.gender,
            gouvernement : req.body.gouvernement,
            city : req.body.city,
            phone : req.body.phone,
            address : req.body.address
        }
        connectDB.query('INSERT INTO citizens SET ?' , [citizen] , (err,result) => {
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
                var object = {
                    status : 200 ,
                    message : 'تم تسجيل البيانات' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    showProviderRequests : (req,res) => {
        let requestStatus = 'false',
            isSelected = 'false'

        connectDB.query('SELECT workname FROM users WHERE userid = ?' , [req.body.userid] , (err,user) => {
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
                connectDB.query('SELECT * FROM requests WHERE workname = ? AND requestStatus = ? AND isSelected = ?' , [user[0].workname,requestStatus,isSelected] , (err,requests) => {
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
                            data : requests.reverse()
                        }
                        res.send(object)
                    }
                })
            }
        })
    },

    showSingleRequest : (req,res) => {
        connectDB.query('SELECT * FROM requests WHERE requestid = ?' , [req.body.requestid] , (err,r) => {
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
                var object = {
                    status : 200 ,
                    message : 'تفاصيل الطلب' ,
                    errors : [] ,
                    data : { r }
                }
                res.send(object)
            }
        })
    },

    replayRequest : (req,res) => {
        let replay = {
            providerid : req.body.userid,
            requestid : req.body.requestid,
            reply : req.body.reply
        },
            tokens = []

        connectDB.query('SELECT * FROM replys WHERE providerid = ? AND requestid = ?' , [replay.providerid,replay.requestid] , (err,rr) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!rr || rr.length == 0) {
                connectDB.query('SELECT userid FROM requests WHERE requestid = ?' , [req.body.requestid] , (err,requests) => {
                    if(err) {
                        var object = {
                            status: 400,
                            message: `${err}`,
                            errors: [],
                            data: []
                        }
                        res.send(object)
                    }
                    else {
                        connectDB.query('SELECT usertoken FROM users WHERE userid = ?' , [requests[0].userid] , (err,user) => {
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
                                tokens.push(user[0].usertoken)
                                connectDB.query('INSERT INTO replys SET ?' , [replay] , (err,result) => {
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
                                        let notification = {
                                            userid : req.body.userid,
                                            notification : 'لديك رد جديد'
                                        }
                                        connectDB.query('INSERT INTO notifications SET ?' , [notification] , (err,resultss) => {
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
                                                var message = { 
                                                    registration_ids: tokens,
                    
                                                    notification: {
                                                        title: 'ETMN notification',
                                                        body: 'لديك رد جديد',
                                                        "click_action": "FCM_PLUGIN_ACTIVITY",
                                                        "icon": "fcm_push_icon"
                                                    },
                    
                                                    data: {
                                                        requestid : replay.requestid
                                                    }
                                                };
                    
                                                fcm.send(message, function (err, response1) {
                                                    if (err) {
                                                        var object = {
                                                            status: 400,
                                                            message: `${err}`,
                                                            errors: [],
                                                            data: []
                                                        }
                                                        res.send(object)
                                                    }
                                                    else {
                                                        var object = {
                                                            status: 200,
                                                            message: 'تم ارسال ردك',
                                                            errors: [],
                                                            data: []
                                                        }
                                                        res.send(object)
                                                    }
                                                })                                        
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                var object = {
                    status: 400,
                    message: 'تم الرد من قبل',
                    errors: [],
                    data: []
                }
                res.send(object)
            }
        })
    },

    showSelectedRequests : (req,res) => {
        let requestStatus = 'false'
        connectDB.query('SELECT * FROM selectedrequests WHERE providerid = ? AND requestStatus = ?' , [req.body.userid,requestStatus] , (err,requests) => {
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
                    data : requests.reverse()
                }
                res.send(object)
            }
        })
    },

    showSelectedRequestsCompleted : (req,res) => {
        let requestStatus = 'true'
        connectDB.query('SELECT * FROM selectedrequests WHERE providerid = ? AND requestStatus = ?' , [req.body.userid,requestStatus] , (err,requests) => {
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
                    data : requests.reverse()
                }
                res.send(object)
            }
        })
    },

    showUserRequests : (req,res) => {
        let requestStatus = 'false'
        connectDB.query('SELECT * FROM requests WHERE userid = ? AND requestStatus = ?' , [req.body.userid,requestStatus] , (err,requests) => {
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
                    data : requests.reverse()
                }
                res.send(object)
            }
        })
    },

    showReplays : (req,res) => {
        connectDB.query('SELECT * FROM replys WHERE requestid = ?' , [req.body.requestid] , (err,replys) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!replys || replys.length == 0) {
                var object = {
                    status : 200 ,
                    message : 'لا توجد ردود' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                var object = {
                    status : 200 ,
                    message : 'جميع الردود' ,
                    errors : [] ,
                    data : replys.reverse()
                }
                res.send(object)
            }
        })
    },

    selectReply : (req,res) => {
        let isSelected = 'true',
            tokens = []
        connectDB.query('SELECT * FROM requests WHERE requestid = ? AND isSelected = ?' , [req.body.requestid,isSelected] , (err,r) =>{
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!r || r.length == 0) {
                connectDB.query('UPDATE requests SET isSelected = ? WHERE requestid = ?' , [isSelected,req.body.requestid] , (err,result) => {
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
                        connectDB.query('DELETE FROM replys WHERE providerid != ? AND requestid = ?' , [req.body.providerid,req.body.requestid] , (err,resultsss) => {
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
                                connectDB.query('SELECT * FROM requests WHERE requestid = ?' , [req.body.requestid] , (err,request1) => {
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
                                        let request = {
                                            requestid : request1[0].requestid,
                                            userid : request1[0].userid,
                                            providerid : req.body.providerid,
                                            ministryname : request1[0].ministryname,
                                            workname : request1[0].workname,
                                            gouvernement : request1[0].gouvernement,
                                            city : request1[0].city,
                                            request : request1[0].request,
                                            requestImage : request1[0].requestImage,
                                            requestVoice : request1[0].requestVoice,
                                            requestStatus : request1[0].requestStatus
                                        }
                                        connectDB.query('INSERT INTO selectedrequests SET ?' , [request] , (err,results) => {
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
                                                connectDB.query('SELECT usertoken FROM users WHERE userid = ?' , [req.body.providerid] , (err,user) => {
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
                                                        tokens.push(user[0].usertoken)
                                                        var message = { 
                                                            registration_ids: tokens,
                            
                                                            notification: {
                                                                title: 'ETMN notification',
                                                                body: 'لديك رد جديد',
                                                                "click_action": "FCM_PLUGIN_ACTIVITY",
                                                                "icon": "fcm_push_icon"
                                                            },
                                                        };
                            
                                                        fcm.send(message, function (err, response1) {
                                                            if (err) {
                                                                var object = {
                                                                    status: 400,
                                                                    message: `${err}`,
                                                                    errors: [],
                                                                    data: []
                                                                }
                                                                res.send(object)
                                                            }
                                                            else {
                                                                var object = {
                                                                    status : 200 ,
                                                                    message : 'تم الاختيار' ,
                                                                    errors : [] ,
                                                                    data : []
                                                                }
                                                                res.send(object)
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                var object = {
                    status : 400 ,
                    message : 'تم الاختيار من قبل' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    },

    solveRequest : (req,res) => {
        connectDB.query('SELECT providerid FROM selectedrequests WHERE requestid = ?' , [req.body.requestid] , (err,requests) => {
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
                connectDB.query('SELECT points FROM users WHERE userid = ?' , [requests[0].providerid] , (err,user) => {
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
                        let totalPoints = user[0].points + 1,
                            requestStatus = 'true'
                        connectDB.query('UPDATE users SET points = ? WHERE userid = ?' , [totalPoints,requests[0].providerid] , (err,result) => {
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
                                connectDB.query('UPDATE selectedrequests SET requestStatus = ? WHERE requestid = ?' , [requestStatus,req.body.requestid] , (err,results) => {
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
                                        connectDB.query('UPDATE requests SET requestStatus = ? WHERE requestid = ?' , [requestStatus,req.body.requestid] , (err,resultss) => {
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
                                                var object = {
                                                    status : 200 ,
                                                    message : 'تم الحل' ,
                                                    errors : [] ,
                                                    data : []
                                                }
                                                res.send(object)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    showUserRequestsCompleted : (req,res) => {
        let requestStatus = 'true'
        connectDB.query('SELECT * FROM requests WHERE userid = ? AND requestStatus = ?' , [req.body.userid,requestStatus] , (err,requests) => {
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
                    data : requests.reverse()
                }
                res.send(object)
            }
        })
    }
}