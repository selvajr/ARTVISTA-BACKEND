import express from 'express';
import { verifyToken } from '../Middlewares/verifyToken.js';
import { listOrder, placeOrder, userOrder, verifyOrder } from '../Controllers/orderControllers.js';


const router=express.Router()


router.post('/placeorder',verifyToken,placeOrder)
router.post('/verify',verifyOrder)
router.post('/userorders',verifyToken,userOrder)
router.get ('/listorder',listOrder)

export default router;
