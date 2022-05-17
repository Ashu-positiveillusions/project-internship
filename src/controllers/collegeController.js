const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createCollege = async function (req, res) {
  try {
    let college = req.body;

    if (Object.keys(college).length == 0) return res.status(400).send({ status: false, message: "Please Enter your college details" });

    if (!college.name) return res.status(400).send({ status: false, message: "Please input college name" });
    if (!college.fullName) return res.status(400).send({ status: false, message: "Please input full name of college" });
    if (!college.logoLink) return res.status(400).send({status: false,message: "Please input the logoLink of your college."});

    college.name = college.name.toLowerCase().trim();
    college.fullName = college.fullName.trim();
    college.logoLink = college.logoLink.trim();

    // checking if any of the above fields contain only spaces and not a valid string
    if (!college.name) return res.status(400).send({ status: false, message: "Please input college name" });
    if (!college.fullName) return res.status(400).send({ status: false, message: "Please input full name of college" });
    if (!college.logoLink) return res.status(400).send({status: false,message: "Please input the logoLink of your college."});

    // checking for duplicity of collegeName 
    let duplicateCollege = await collegeModel.findOne({ name: college.name });
    if (duplicateCollege) return res.status(400).send({status: false,message: "The college already exist in the database."});

    let collegeData = await collegeModel.create(college);
    return res.status(201).send({ status: true, data: collegeData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

const getcollegeDetails = async function (req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin','*')

    let data = req.query.collegeName;
    if (!data) return res.status(400).send({ status: false, message: "Please Enter your college name" });

    let data1 = data.toLowerCase().trim();
    if (!data1) return res.status(400).send({ status: false, message: "Please Enter your college name" });

    let array = data1.split("");
    for(let i=0; i< array.length; i++){
      if(array[i]==" "){
        return res.status(400).send({status:false, message: "collegeName cannot have any spaces in between."})
      }
    }

    let college = await collegeModel.findOne({name: data1,isDeleted: false}).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0}).lean();
    if (!college) return res.status(404).send({ status: false, message: "No such college in our database" });

    let internData = await internModel.find({collegeId: college._id,isDeleted: false}).select({ _id: 1, email: 1, mobile: 1, name: 1 }).lean();

    // let college1 = JSON.parse(JSON.stringify(college));
    /*While using spread operator to copy the object in college variable, a lot of garbage values were being printed.
    Also I was not able to directly manipulate the college object which we got by using findOne on mongoDB documents. Therefore,
    I used he syntax for deep copy.*/
    // another method will be to use lean() function on mongoose documents

    delete college._id;
    college.interns = [...internData];

    return res.status(200).send({ status: true, data: college });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {createCollege, getcollegeDetails}
