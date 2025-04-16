const express = require("express");
const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Admin = require("../Model/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Dashboard = require("../Model/Studentdashboard");

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { Username, email, password } = req.body;
    if (!Username || !email || !password) {
      res.status(400).json({ message: "All fields are required!" });
    }
    const userExists = await Admin.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Admin.create({
      Username,
      email,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "Create Admin Successfully..", Admin: newUser });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Create a new JSON Web Token
    const token = jwt.sign(
      { admin: { id: admin._id, email: admin.email } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token: token,
    });
  })
);

// GET all student details
router.get(
  "/students/details",
  asyncHandler(async (req, res) => {
    const students = await Dashboard.find({});
    res.json(students);
  })
);

router.post(
  "/students/verify",
  asyncHandler(async (req, res) => {
    const { status, id } = req.body;

    // Find the student by ID
    const student = await Dashboard.findById(id);

    if (student) {
      student.studentStatus = status; // set the status from req.body
      await student.save();

      res.status(200).json({
        message: "Student status updated successfully",
        student,
      });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  })
);

module.exports = router;
