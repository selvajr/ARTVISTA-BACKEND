import express from "express";
import multer from "multer";
import { createArt, editArt, getAllArt, getArtById, removeArts } from "../Controllers/artControllers.js";

const router =express.Router()
//image storage Engine

const storage=multer.diskStorage({
    destination:"Uploads",//it automatically create the folder
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
      },

})

const upload=multer({storage:storage})

//routes
router.post('/add-art',upload.single('image'),createArt)
router.get('/get-art',getAllArt)
router.delete('/delete-art/:id',removeArts)
router.put('/update-art/:id',upload.single('image'),editArt)
router.get('/get-art/:id',getArtById)

export default router;