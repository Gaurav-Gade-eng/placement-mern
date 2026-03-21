const express = require("express");

const router = express.Router();

const {
createAnnouncement,
getAnnouncements,
deleteAnnouncement,
updateAnnouncement
} = require("../controllers/announcementController");

const protect = require("../middleware/authMiddleware");


router.post("/create",protect,createAnnouncement);

router.get("/",protect,getAnnouncements);

router.delete("/:id",protect,deleteAnnouncement);

router.put("/:id",protect,updateAnnouncement);

module.exports = router;