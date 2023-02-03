const connectDB = require('../database/connection');

module.exports = {
    replyRequest : (req,res) => {
        let reply = {
            requestid : req.body.requestid,
            reply : req.body.reply
        }
        connectDB.query('INSERT INTO replys SET ?' , [reply] , (err,result) => {
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
                    message : 'تم تسجيل ردك' ,
                    errors : [] ,
                    data : []
                }
                res.send(object)
            }
        })
    }
}