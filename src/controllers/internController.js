const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");
const validator = require("email-validator");

const createInternDocument = async function (req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin','*')

    let data = req.body;
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter intern details" });

    if (!data.name) return res.status(400).send({ status: false, message: "Please Enter intern name" });
    if (!data.email) return res.status(400).send({ status: false, message: "Please Enter intern email" });
    if (!data.mobile) return res.status(400).send({ status: false, message: "Please Enter intern mobile" });
    if(!data.collegeName) return res.status(400).send({ status: false, message: "Please Enter intern collegeName" });

    data.name = data.name.trim();
    data.email = data.email.trim();
    data.mobile = data.mobile.trim();
    data.collegeName = data.collegeName.toLowerCase().trim()

    if (!data.name) return res.status(400).send({ status: false, message: "Please Enter intern name" });
    if (!data.email) return res.status(400).send({ status: false, message: "Please Enter intern email" });
    if (!data.mobile) return res.status(400).send({ status: false, message: "Please Enter intern mobile" });
    if(!data.collegeName) return res.status(400).send({ status: false, message: "Please Enter intern collegeName" });
    
    let array = (data.collegeName).split("");
    for(let i=0; i< array.length; i++){
      if(array[i]==" "){
        return res.status(400).send({status:false, message: "collegeName cannot have any spaces in between."})
      }
    }
    

    let email = data.email;
    if (validator.validate(email) == false)  return res.status(400).send({ status: false, msg: "Please input a valid email" });
    

    let duplicateEmail = await internModel.findOne({ email });
    if (duplicateEmail) return res.status(400).send({ status: false, message: "Email is already in use" });

    let mobile = data.mobile;

    function checkIndianNumber(b) {
      var a = /^[6-9]\d{9}$/gi;
      if (a.test(b)) {
        return true;
      } else {
        return false;
      }
    }

    let mobileCheck = checkIndianNumber(mobile);
    if (mobileCheck == false) return res.status(400).send({ status: false, message: "Please enter a valid mobile number" });

    let duplicateMobile = await internModel.findOne({ mobile });
    if (duplicateMobile) return res.status(400).send({ status: false, message: "Mobile is already in use" });

    let college = data.collegeName;
    if (!college) return res.status(400).send({ status: false, message: "Please Enter college name" });

    let checkCollege = await collegeModel.findOne({name: college,isDeleted: false}).select({ _id: 1 });
    if (!checkCollege) return res.status(404).send({ status: false, message: "No such college exists" });
    delete data.collegeName;
    data.collegeId = checkCollege._id;

    let internData = await internModel.create(data);
    return res.status(201).send({ status: true, data: internData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.createInternDocument = createInternDocument;
