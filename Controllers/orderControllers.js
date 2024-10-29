import Order from "../Models/orderModel.js";
import User from "../Models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//user placing  order from frontend

export const placeOrder = async (req, res) => {
  const frontend_url = "https://artvista-gallery-frontend-mathi.vercel.app";
  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    //cleaning user cart data
    await User.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const cart_items = req.body.items.map((ele) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: ele.name,
        },
        unit_amount: ele.price * 100 * 80,
      },
      quantity: ele.quantity,
    }));

    //delivery charges
    cart_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80, //convert to inr
      },
      quantity: 1,
    });

    //stripe payment
    const session = await stripe.checkout.sessions.create({
      line_items: cart_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ message: "Order placed", session_url: session.url });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error placing the order" });
  }
};

//verifing the order

export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.status(200).json({ message: "paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.status(400).json({ message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error verifing the order" });
  }
};

//user orders for frontend
export const userOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res
      .status(200)
      .json({ message: "user order detail successfully", data: orders });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in user order details" });
  }
};



//// listing orders for admin panel

export const listOrder=async(req,res)=>{
  try{
    const orders=await Order.find()
    res.status(200).json({message:"All user Order details",data:orders})
  }catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in All user order details" });
  }
}