const express = require('express');
const route = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , './server/uploads')
    },

    filename : (req , file , cb) => {
        cb(null , file.originalname)
    }
})
const upload = multer({ storage : storage })

const {verify} = require('./middleware')

// Controllers
const ministryController = require('../controllers/ministry-controller')
const writerController = require('../controllers/writer-controller')
const supervisorController = require('../controllers/supervisor-controller')
const userController = require('../controllers/user-controller');
const dashboarRender = require('../services/dashboar-render');

// Ministry API
route.get('/api-allMinistries' , ministryController.allMinistries)
route.post('/api-allMinistryWorks' , ministryController.ministriesWorks)

// Writer API
route.post('/api-writerLogin' , writerController.writerLogin)
route.post('/api-publishPost' , upload.single('postImage') , writerController.publishPost)

// Supervisor API
route.post('/api-supervisorLogin' , supervisorController.supervisorLogin)
route.post('/api-supervisorRequests' , supervisorController.showRequests)
route.post('/api-supervisorSolvedRequests' , supervisorController.showSolvedRequests)

// User API
route.get('/api-showSlider' , userController.showSlider)
route.get('/api-showPosts' , userController.showPosts)
route.post('/api-userRegister' , userController.userRegister)
route.post('/api-userLogin' , userController.userLogin)
route.post('/api-sendRequest' , upload.single('requestImage') , userController.sendRequest)
route.post('/api-addCitizenDetails' , userController.addCitizenDetails)
route.post('/api-showProviderRequests' , userController.showProviderRequests)
route.post('/api-showRequestsSelected' , userController.showSelectedRequests)
route.post('/api-showRequestsSelectedCompleted' , userController.showSelectedRequestsCompleted)
route.post('/api-showSingleRequest' , userController.showSingleRequest)
route.post('/api-replyRequest' , userController.replayRequest)
route.post('/api-showUserRequests' , userController.showUserRequests)
route.post('/api-showRequestReplys' , userController.showReplays)
route.post('/api-selectReply' , userController.selectReply)
route.post('/api-solveRequest' , userController.solveRequest)
route.post('/api-showUserRequestsCompleted' , userController.showUserRequestsCompleted)

// Render
route.get('/' , dashboarRender.showHomePage)
route.get('/loginAdmin' , verify , dashboarRender.showLoginPage)
route.post('/auth/login' , dashboarRender.login)
route.get('/dashboard' , verify , dashboarRender.showDashboardPage)
route.get('/dashboard-members' , verify , dashboarRender.showDashboarMembersPage)
route.get('/dashboard-citizens' , verify , dashboarRender.showDashboarCitizensPage)
route.get('/dashboard-writers' , verify , dashboarRender.showDashboarWritersPage)
route.get('/add-writer' , verify , dashboarRender.showAddWriterPage)
route.post('/api-addWriter' , dashboarRender.addWriter)
route.get('/api-deleteWriter/:writerid' , verify , dashboarRender.deleteWriter)
route.get('/dashboard-supervisors' , verify , dashboarRender.showDashboarSupervisorsPage)
route.get('/add-supervisor' , verify , dashboarRender.showAddSupervisorPage)
route.post('/api-addSupervisor' , dashboarRender.addSupervisor)
route.get('/api-deleteSupervisor/:supervisorid' , verify , dashboarRender.deleteSupervisor)
route.get('/dashboard-ministries' , verify , dashboarRender.showDashboarMinistriesPage)
route.get('/add-ministry' , verify , dashboarRender.showAddMinistryPage)
route.post('/api-addMinistry' , dashboarRender.addMinistry)
route.get('/api-deleteMinistry/:ministryid' , verify , dashboarRender.deleteMinistries)
route.get('/dashboard-works/:ministryid' , verify , dashboarRender.showMinistryWorksPage)
route.get('/add-work/:ministryid' , verify , dashboarRender.showAddWorkPage)
route.post('/api-addWork' , dashboarRender.addWork)
route.get('/api-deleteWork/:ministryid/:workid' , verify , dashboarRender.deleteWork)


module.exports = route