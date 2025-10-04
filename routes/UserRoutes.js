import express from 'express'
import { SignUp , login , profile , logoutUser , googleLogin } from '../controller/UserController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/profile', authMiddleware , profile)

router.post("/signup" , SignUp)
router.post('/login' , login)
router.post("/logout", logoutUser); // 
router.post("/google-login", googleLogin);


export default router