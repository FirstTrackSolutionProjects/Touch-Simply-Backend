const Resume = require("../models/Resume");

// CREATE RESUME
exports.createResume = async (req, res) => {
  try {
    const { title, image, data, desc, template } = req.body;

    const resume = await Resume.create({
      title,
      image,
      data: JSON.stringify(data),
      desc,
      template,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Resume Created Successfully",
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET USER RESUMES
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, resumes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET SINGLE RESUME
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume Not Found" });
    }

    res.status(200).json({ success: true, resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE RESUME
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume Not Found" });
    }

    if (req.body.data) req.body.data = JSON.stringify(req.body.data);
    await resume.update(req.body);

    res.status(200).json({ success: true, message: "Resume Updated Successfully", resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE RESUME
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume Not Found" });
    }

    await resume.destroy();
    res.status(200).json({ success: true, message: "Resume Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};