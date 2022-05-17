const express = require("express");
const router = express.Router();

const collegeController = require("../controllers/collegeController");
const interController = require("../controllers/internController");

router.post("/colleges", collegeController.createCollege);

router.post("/interns", interController.createInternDocument);

router.get("/collegeDetails", collegeController.getcollegeDetails);

module.exports = router;
