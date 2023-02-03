const connectDB = require("../database/connection");

module.exports = {
    allMinistries : (req,res) => {
        connectDB.query('SELECT * FROM ministries' , (err,ministries) => {
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
                    message : 'جميع الوزارات' ,
                    errors : [] ,
                    data : ministries
                }
                res.send(object)
            }
        })
    },

    ministriesWorks : (req,res) => {
        let id = req.body.ministryid
        connectDB.query('SELECT * FROM works WHERE ministryid = ?' , [id] , (err,works) => {
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
                    message : 'جميع جهات العمل التابعه للوزارة' ,
                    errors : [] ,
                    data : works
                }
                res.send(object)
            }
        })
    }
}