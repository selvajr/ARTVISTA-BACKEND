import express from 'express';
import { adminactivate, adminverify, google, loginUser, registerUser } from '../Controllers/authControllers.js';

const router=express.Router()

router.post('/register-user',registerUser)
router.post('/login-user',loginUser)
router.post('/google',google)
router.post('/admin-artist',adminverify)
router.post('/admin-bio/:id/:token',adminactivate)

export default router;
