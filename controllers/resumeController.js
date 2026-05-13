// const Resume = require("../models/Resume");


// // CREATE RESUME
// exports.createResume = async (req, res) => {
//   try {
//     const { title, image, data, desc, template } = req.body;

//     const resume = await Resume.create({
//       title,
//       image,
//       data,
//       desc,
//       template,
//       UserId: req.user.id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Resume Created Successfully",
//       resume,
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



// // GET ALL RESUMES
// exports.getAllResumes = async (req, res) => {
//   try {

//     const resumes = await Resume.findAll({
//       where: {
//         UserId: req.user.id,
//       },
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json({
//       success: true,
//       resumes,
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



// // GET SINGLE RESUME
// exports.getSingleResume = async (req, res) => {
//   try {

//     const resume = await Resume.findOne({
//       where: {
//         id: req.params.id,
//         UserId: req.user.id,
//       },
//     });

//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume Not Found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       resume,
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



// // UPDATE RESUME
// exports.updateResume = async (req, res) => {
//   try {

//     const resume = await Resume.findOne({
//       where: {
//         id: req.params.id,
//         UserId: req.user.id,
//       },
//     });

//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume Not Found",
//       });
//     }

//     await resume.update(req.body);

//     res.status(200).json({
//       success: true,
//       message: "Resume Updated Successfully",
//       resume,
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



// // DELETE RESUME
// exports.deleteResume = async (req, res) => {
//   try {

//     const resume = await Resume.findOne({
//       where: {
//         id: req.params.id,
//         UserId: req.user.id,
//       },
//     });

//     if (!resume) {
//       return res.status(404).json({
//         success: false,
//         message: "Resume Not Found",
//       });
//     }

//     await resume.destroy();

//     res.status(200).json({
//       success: true,
//       message: "Resume Deleted Successfully",
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

const config = require("../config/config");

// CREATE RESUME
exports.createResume = (req, res) => {
  const { title, resumeData } = req.body;

  const sql = `
    INSERT INTO resumes
    (userId, title, resumeData, createdAt, updatedAt)
    VALUES (?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [
      req.user.id,
      title,
      JSON.stringify(resumeData),
    ],
    (err, result) => {
      if (err) {
        console.log(err);

         return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Resume Saved Successfully",
      });
    }
  );
};

// GET USER RESUMES
exports.getUserResumes = (req, res) => {
  const sql = `
    SELECT * FROM resumes
    WHERE userId = ?
    ORDER BY id DESC
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    const resumes = result.map((resume) => ({
      ...resume,
      resumeData: JSON.parse(resume.resumeData),
    }));
     res.json({
      success: true,
      resumes,
    });
  });
};


// GET SINGLE RESUME
exports.getResumeById = (req, res) => {
  const sql = `
    SELECT * FROM resumes
    WHERE id = ?
  `;
   db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resume = {
      ...result[0],
      resumeData: JSON.parse(result[0].resumeData),
    };

     res.json({
      success: true,
      resume,
    });
  });
};

// UPDATE RESUME
exports.updateResume = (req, res) => {
  const { title, resumeData } = req.body;

  const sql = `
    UPDATE resumes
    SET title = ?,
    resumeData = ?,
    updatedAt = NOW()
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      JSON.stringify(resumeData),
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
           });
      }

      res.json({
        success: true,
        message: "Resume Updated Successfully",
      });
    }
  );
};

// DELETE RESUME
exports.deleteResume = (req, res) => {
  const sql = `
    DELETE FROM resumes
    WHERE id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Resume Deleted Successfully",
    });
  });
};