const connectDB = require("../database/connection");
const jwt = require('jsonwebtoken')

module.exports = {
    showHomePage : (req,res) => {
        res.render('home')
    },

    showLoginPage : (req,res) => {
        res.render('login')
    },

    login : (req,res) => {
        try {
            var {name , password} = req.body
            
            if(!name || !password) {
                res.render('login' , {
                    message : 'من فضلك قم بادخال اسمك وكلمة السر'
                })
            } else {
                connectDB.query('SELECT * FROM admin WHERE name = ?' , [ name ] , async (err , results) => {
                    if(err) res.send(err)
                    else if(!results || results.length == 0 || password != results[0].password){
                        res.render('login' , {
                            message : 'اسم المستخدم او كلمة السر خطأ'
                        })
                    } 
                    else {
                        var id = results[0].adminid
                        var token = jwt.sign({id : id} , process.env.JWT_SECRET , {
                            expiresIn : process.env.JWT_EXPIRES_IN
                        })
                        var cookieOptions = {
                            expires : new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                            ),
                            
                            httpOnly : false,
                            secure : false
                        }
                        res.cookie('jwt' , token , cookieOptions)
                        res.render('dashboard')
                    }
                })
            }
        } catch (error) {
            res.send(error)
        }
    },

    showDashboardPage : (req,res) => {
        res.render('dashboard')
    },

    showDashboarMembersPage : (req,res) => {
        connectDB.query('SELECT * FROM users' , (err,users) => {
            if(err) res.send(err)
            res.render('dashboard-members' , {
                users : users
            })
        })
    },

    showDashboarCitizensPage : (req,res) => {
        connectDB.query('SELECT * FROM citizens' , (err,citizens) => {
            if(err) res.send(err)
            res.render('dashboard-citizens' , {
                citizens : citizens
            })
        })
    },

    showDashboarWritersPage : (req,res) => {
        connectDB.query('SELECT * FROM writers' , (err,writers) => {
            if(err) res.send(err)
            res.render('dashboard-writers' , {
                writers : writers
            })
        })
    },

    showAddWriterPage : (req,res) => {
        res.render('add-writer')
    },

    addWriter : (req,res) => {
        let writer = {
            writername : req.body.writername,
            phone : req.body.phone,
            password : req.body.password
        }
        if(!writer.writername || !writer.phone || !writer.password) {
            res.render('add-writer' , {
                message : 'املا جميع البيانات'
            })
        }
        else {
            connectDB.query('INSERT INTO writers SET ?' , [writer] , (err,result) => {
                if(err) res.send(err)
                res.render('add-writer' , {
                    message : 'تم الاضافة'
                })
            })
        }
    },

    deleteWriter : (req,res) => {
        connectDB.query('DELETE FROM writers WHERE writerid = ?' , [req.params.writerid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM writers' , (err,writers) => {
                if(err) res.send(err)
                res.render('dashboard-writers' , {
                    writers : writers,
                    message : 'تم الحذف'
                })
            })
        })
    },

    showDashboarSupervisorsPage : (req,res) => {
        connectDB.query('SELECT * FROM supervisors' , (err,supervisors) => {
            if(err) res.send(err)
            res.render('dashboard-supervisors' , {
                supervisors : supervisors
            })
        })
    },

    showAddSupervisorPage : (req,res) => {
        res.render('add-supervisor')
    },

    addSupervisor : (req,res) => {
        let supervisor = {
            supervisorname : req.body.supervisorname,
            phone : req.body.phone,
            password : req.body.password,
            gouvernement : req.body.gouvernement,
            city : req.body.city,
            supervisorstatus : req.body.supervisorstatus
        }
        if(!supervisor.supervisorname || !supervisor.phone || !supervisor.password || !supervisor.gouvernement || !supervisor.city || !supervisor.supervisorstatus) {
            res.render('add-supervisor' , {
                message : 'املا جميع البيانات'
            })
        }
        else {
            connectDB.query('INSERT INTO supervisors SET ?' , [supervisor] , (err,result) => {
                if(err) res.send(err)
                res.render('add-supervisor' , {
                    message : 'تم الاضافة'
                })
            })
        }
    },

    deleteSupervisor : (req,res) => {
        connectDB.query('DELETE FROM supervisors WHERE supervisorid = ?' , [req.params.supervisorid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM supervisors' , (err,supervisors) => {
                if(err) res.send(err)
                res.render('dashboard-supervisors' , {
                    supervisors : supervisors,
                    message : 'تم الحذف'
                })
            })
        })
    },

    showDashboarMinistriesPage : (req,res) => {
        connectDB.query('SELECT * FROM ministries' , (err,ministries) => {
            if(err) res.send(err)
            res.render('dashboard-ministries' , {
                ministries : ministries
            })
        })
    },

    showAddMinistryPage : (req,res) => {
        res.render('add-ministry')
    },

    addMinistry : (req,res) => {
        let ministry = {
            ministryname : req.body.ministryname,
        }
        if(!ministry.ministryname) {
            res.render('add-ministry' , {
                message : 'املا جميع البيانات'
            })
        }
        else {
            connectDB.query('INSERT INTO ministries SET ?' , [ministry] , (err,result) => {
                if(err) res.send(err)
                res.render('add-ministry' , {
                    message : 'تم الاضافة'
                })
            })
        }
    },

    deleteMinistries : (req,res) => {
        connectDB.query('DELETE FROM ministries WHERE ministryid = ?' , [req.params.ministryid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('DELETE FROM works WHERE ministryid = ?' , [req.params.ministryid] , (err,results) => {
                if(err) res.send(err)
                connectDB.query('SELECT * FROM ministries' , (err,ministries) => {
                    if(err) res.send(err)
                    res.render('dashboard-ministries' , {
                        ministries : ministries,
                        message : 'تم الحذف'
                    })
                })
            })
        })
    },

    showMinistryWorksPage : (req,res) => {
        connectDB.query('SELECT * FROM works WHERE ministryid = ?' , [req.params.ministryid] , (err,works) => {
            if(err) res.send(err)
            res.render('dashboard-works' , {
                works : works,
                ministryid : req.params.ministryid
            })
        })
    },

    showAddWorkPage : (req,res) => {
        res.render('add-work' , {
            ministryid : req.params.ministryid
        })
    },

    addWork : (req,res) => {
        if(!req.body.workname) {
            res.render('add-work' , {
                message : 'املا جميع البيانات',
                ministryid : req.body.ministryid
            })
        }
        else {
            let work = {
                workname : req.body.workname,
                ministryid : req.body.ministryid
            }
            connectDB.query('INSERT INTO works SET ?' , [work] , (err,result) => {
                if(err) res.send(err)
                res.render('add-work' , {
                    message : 'تم الاضافة',
                    ministryid : req.body.ministryid
                })
            })
        }
    },

    deleteWork : (req,res) => {
        connectDB.query('DELETE FROM works WHERE workid = ?' , [req.params.workid] , (err,result) => {
            if(err) res.send(err)
            connectDB.query('SELECT * FROM works WHERE ministryid = ?' , [req.params.ministryid] , (err,works) => {
                if(err) res.send(err)
                res.render('dashboard-works' , {
                    message : 'تم الحذف',
                    ministryid : req.params.ministryid,
                    works : works
                })
            })
        })
    }
}