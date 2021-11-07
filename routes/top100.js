const { Router } = require("express");
const fs = require("fs/promises");
const router = Router();

router.get("/top100", async (req, res) => {
    try {
        const torrentArray = await fs.readFile("top100.json");
        if (torrentArray) {
            res.status(200).json(JSON.parse(torrentArray));
        } else {
            res.status(200).json([]);
        }
    } catch (err) {
        console.log(err);
        res.status(200).json([]);
    }
});


module.exports = router;