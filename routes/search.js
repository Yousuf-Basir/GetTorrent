const {Router} = require("express");
const parseMagnet = require("../middlewares/parseMagnet.middleware");
const searchMiddleware = require("../middlewares/search.middleware");
const router = Router();

router.get("/search", parseMagnet, searchMiddleware, (req, res) => {
    console.log("SSSSS")
    const torrentArray = req.torrentArray;
    res.status(200).json(torrentArray);    
});


module.exports = router;