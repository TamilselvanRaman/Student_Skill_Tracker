const express = require("express");
const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Student = require("../Model/StudentModel");
const Dashboard = require("../Model/Studentdashboard");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validateToken = require("../middelware/authMiddleware");
const upload = require("../config/multer");

//student register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { Username, email, password } = req.body;
    if (!Username || !email || !password) {
      res.status(400).json({ message: "All fields are required!" });
    }
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Student.create({
      Username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Create Student Successfully..",
      Student: newUser,
    });
  })
);

//student Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required!" });
    }

    const student = await Student.findOne({ email });
    const isMatch = await bcrypt.compare(password, student.password);
    if (!student || !isMatch) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    //Create a new  JSON web Token
    const Token = jwt.sign(
      {
        Student: { id: student._id, email: student.email },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: " Student is Login Successfully..",
      Token: Token,
    });
  })
);



// POST: Upload student data
router.post(
  "/dashboard",
  validateToken,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const StudentID = req.user.id;
    const { skills } = req.body;

    let parsedSkills = [];
    try {
      parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
    } catch (err) {
      return res.status(400).json({ message: "Invalid skills format" });
    }

    const filePath = `http://localhost:3001/uploads/${req.file.filename}`;
    const uploaded = await Dashboard.create({
      FilePath: filePath,
      Student: StudentID,
      studentStatus: false,
      skills: parsedSkills,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: uploaded,
    });
  })
);

// GET: Return student details like dummyjson
router.get(
  "/dashboard",
  validateToken,
  asyncHandler(async (req, res) => {
    const StudentID = req.user.id;

    const details = await Dashboard.find({ Student: StudentID });

    if (!details || details.length === 0) {
      return res
        .status(404)
        .json({ message: "No details found for this student" });
    }

    res.status(200).json({
      message: "Get student details",
      details: details,
    });
  })
);


module.exports = router;
