import artModel from "../Models/artModel.js";
import fs from "fs";

//creating art item

export const createArt = async (req, res) => {
  const image_filename = `${req.file.filename}`;

  const newArt = new artModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    artist: req.body.artist,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await newArt.save();
    res.status(200).json({ message: "Art added to cart succesfully",data:newArt });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in creating the art" });
  }
};

//getting all the arts

export const getAllArt = async (req, res) => {
  try {
    const arts = await artModel.find();
    res.status(200).json({ message: "getting all the arts", data: arts });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in get all the art" });
  }
};

//delete art item by id

export const removeArts = async (req, res) => {
  try {
    const artId = req.params.id;

    const deleteArt = await artModel.findById({ _id: artId });
    //deleting the image file also
    fs.unlink(`Uploads/${deleteArt.image}`, () => {});
    if (!deleteArt) {
      res.status(404).send(" Art not found");
    }
    await artModel.findByIdAndDelete(artId);
    res.status(200).json({ message: "Art item deleted successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in removing the  art" });
  }
};

//updating the art item

export const editArt = async (req, res) => {
  try {
    const artId = req.params.id;
    const updateArt = await artModel.findById({ _id: artId });
    //deleting the image file also
    fs.unlink(`Uploads/${updateArt.image}`, () => {});
    const results = await artModel.findByIdAndUpdate(
      artId,
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          artist: req.body.artist,
          image: `${req.file.filename}`,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "art item updated successfully", data: results });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in removing the  art" });
  }
};

//getting art item by id

export const getArtById=async(req,res)=>{
try {
  const artId=req.params.id;
  const artItem=await artModel.findById(artId)
  if(!artItem){
  return res.status(400).json({message:"art item not found"})
  }
  res.status(200).json({message:"getting art by particular id",data:artItem})
} catch (error) {
  console.log(error);
    res
      .status(500)
      .json({ message: "Internal server Error in getting  the particular art" });
}
}
