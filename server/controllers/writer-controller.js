const connectDB = require('../database/connection')

module.exports = {
    writerLogin : (req,res) => {
        let phone = req.body.phone,
            password = req.body.password

        connectDB.query('SELECT * FROM writers WHERE phone = ?' , [phone] , (err,writer) => {
            if(err) {
                var object = {
                    status : 400 ,
                    message : `${err}` ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else if(!writer || writer.length == 0) {
                var object = {
                    status : 400 ,
                    message : 'هذا المستخدم غير موجود' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
            else {
                if(writer[0].password != password) {
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
                        data : writer
                    }
                    res.send(object)
                }
            }
        })
    },

    publishPost : (req,res) => {
        let post = {
            writerid : req.body.writerid,
            title : req.body.title,
            description : req.body.description,
            postImage : `server/uploads/${req.file.filename}`
        }
        connectDB.query('INSERT INTO posts SET ?' , [post] , (err,result) => {
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
                    message : 'تم نشر الخبر' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    }
}