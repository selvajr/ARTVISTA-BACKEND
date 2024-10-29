import express from 'express';
import { verifyToken } from '../Middlewares/verifyToken.js';
import { addToCart, getCartData, removeFromCart } from '../Controllers/cartControllers.js';


const router=express.Router()


router.post('/addToCart',verifyToken,addToCart)
router.post('/removeFromCart',verifyToken,removeFromCart)
router.post('/getCart',verifyToken,getCartData)

export default router;


