import User from "../Models/userModel.js";

//adding to the cart

export const addToCart = async (req, res) => {
  try {
    let user = await User.findById(req.body.userId);
    let cartData = await user.cartData;
    //adding the item in the cart 
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await User.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in the Add To Cart" });
  }
};

//removing from the cart

export const removeFromCart = async (req, res) => {
  try {
    let user = await User.findById(req.body.userId);
    let cartData = await user.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await User.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ message: "Removed from cart",cartData });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in the remove from Cart" });
  }
};

//fetching the user cart Data

export const getCartData=async(req,res)=>{
  try {
  
    let user = await User.findById(req.body.userId);
    let cartData = await user.cartData;
    res.status(200).json({ message: "getting user cart data  details successfully",cartData});
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error in the getting the cart details" });
  }
}