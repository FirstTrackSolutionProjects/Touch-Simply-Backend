const { Resume } = require("../models");
const { uuidv7 } = require("uuidv7")
const { copyDirectory, generateGetSignedUrl, listDirectory, deleteDirectory, generatePutSignedUrl, deleteFileFromS3 } = require("../utils/aws_s3");
const path = require("path");
const latexProcessorService = require("../services/latexProcessor/latexProcessor.service");
const getS3Hash = require("../services/s3/getS3FileHash");


// CREATE RESUME
exports.createResume = async (req, res) => {
  try {
    const {
      title,
      image,
      data,
      desc,
      template,
      fileUrl,
    } = req.body;

    const resume = await Resume.create({
      title,
      image,
      data: JSON.stringify(data),
      desc,
      template,
      fileUrl,
      UserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Resume Created Successfully",
      resume,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.createResumeProjectWithTemplate = async (req, res) => {
  let WORKSPACE_KEY;
  try {
    const { templateId } = req.params;
    if (!templateId) {
      return res.status(400).json({
        success: false,
        message: "Missing templateId in the request parameters.",
      });
    }
    const USER_ID = req.user.id;
    const PROJECT_ID = uuidv7();
    WORKSPACE_KEY = `users/${USER_ID}/projects/${PROJECT_ID}/`;

    const TEMPLATE_KEY = `templates/resumes/${templateId}/`;

    // Copy s3 objects from template to new workspace
    await copyDirectory(TEMPLATE_KEY, WORKSPACE_KEY);
    const fileTree = await listDirectory(TEMPLATE_KEY);

    const resume = await Resume.create({
      id: PROJECT_ID,
      title: `Resume from Template ${PROJECT_ID}`,
      user_id: USER_ID,
      description: `Resume created from template`,
    });
    const mainTexFileKey = path.join(WORKSPACE_KEY, "main.tex").replace(/\\/g, "/");
    const mainTexFileUrl = await generateGetSignedUrl(mainTexFileKey, 10);

    res.status(201).json({
      success: true,
      message: "Resume Created Successfully",
      data: {
        title: resume.title,
        workspace: WORKSPACE_KEY,
        fileTree,
        mainTexFileUrl,
      }
    });

  } catch (error) {
    console.log(error);
    try { await deleteDirectory(WORKSPACE_KEY) } catch (e) { console.error("Error cleaning up workspace after failure:", e) };
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
}

exports.compileResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId in the request parameters.",
      });
    }
    const USER_ID = req.user.id;
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: USER_ID,
      },
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }
    const WORKSPACE_KEY = `users/${USER_ID}/projects/${resumeId}/`;
    const pdfBase64 = await latexProcessorService(WORKSPACE_KEY);
    return res.status(200).json({
      success: true,
      message: "Resume Compiled Successfully",
      data: {
        pdfBase64,
      }
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

exports.getResume = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId in the request parameters.",
      });
    }
    const USER_ID = req.user.id;
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: USER_ID,
      },
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }
    const WORKSPACE_KEY = `users/${USER_ID}/projects/${resumeId}/`;
    const fileTree = await listDirectory(WORKSPACE_KEY);
    const mainTexFileKey = path.join(WORKSPACE_KEY, 'main.tex').replace(/\\/g, "/");
    const mainTexFileUrl = await generateGetSignedUrl(mainTexFileKey, 30);
    return res.status(200).json({
      success: true,
      message: "Resume File Tree Retrieved Successfully",
      data: {
        title: resume.title,
        workspace: WORKSPACE_KEY,
        fileTree,
        mainTexFileUrl,
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

exports.getResumeFileUrl = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const filePath = req.query.filePath;
    if (!resumeId || !filePath) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId or filePath in the request parameters.",
      });
    }
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: req.user.id,
      },
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }
    const USER_ID = req.user.id;
    const WORKSPACE_KEY = `users/${USER_ID}/projects/${resumeId}/`;
    const FILE_KEY = path.join(WORKSPACE_KEY, filePath).replace(/\\/g, "/");
    const fileUrl = await generateGetSignedUrl(FILE_KEY, 10);
    return res.status(200).json({
      success: true,
      message: "File URL Generated Successfully",
      data: {
        fileUrl,
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
exports.addResumeFileUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.resumeId;
    const filePath = req.body.filePath;
    const fileType = req.body.fileType; // e.g., 'pdf', 'image', etc.
    if (!resumeId || !filePath || !fileType) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId, filePath, or fileType in the request parameters.",
      });
    }
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: userId,
      },
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }

    const WORKSPACE_KEY = `users/${userId}/projects/${resumeId}/`;
    const absoluteFilePath = path.join(WORKSPACE_KEY, filePath).replace(/\\/g, "/");

    const putUrl = await generatePutSignedUrl(absoluteFilePath, fileType);

    return res.status(200).json({
      success: true,
      message: "Put URL Generated Successfully",
      data: {
        putUrl,
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
exports.deleteResumeFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.resumeId;
    const filePath = req.body.filePath;
    if (!resumeId || !filePath) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId or filePath in the request parameters.",
      });
    }

    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: userId,
      },
    });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }
    const WORKSPACE_KEY = `users/${userId}/projects/${resumeId}/`;
    const absoluteFilePath = path.join(WORKSPACE_KEY, filePath).replace(/\\/g, "/");

    await deleteFileFromS3(absoluteFilePath);

    return res.status(200).json({
      success: true,
      message: "File Deleted Successfully",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}



const populateTreeWithHashes = async (pathPrefix, node, currentPath = "") => {
  for (const key of Object.keys(node)) {
    // Construct the path dynamically (handling trailing/leading slashes carefully)
    let nextPath = currentPath;
    if (key === "/") {
      nextPath = "";
    } else {
      nextPath = currentPath ? `${currentPath}/${key}` : key;
    }
    if (node[key] === null) {
      const filePath = path.join(pathPrefix, nextPath).replace(/\\/g, "/");
      node[key] = await getS3Hash(filePath);
    } else if (typeof node[key] === "object") {
      // It's a folder! Recursively traverse deeper
      await populateTreeWithHashes(pathPrefix, node[key], nextPath);
    }
  }
  return node;
}

exports.getFileTreeHash = async (req, res) => {
  try {
    const resumeId = req.params.resumeId;
    const USER_ID = req.user.id;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Missing resumeId in the request parameters.",
      });
    }
    const resume = await Resume.findOne({
      id: resumeId,
      user_id: USER_ID
    })
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }
    const WORKSPACE_KEY = `users/${USER_ID}/projects/${resumeId}/`;
    const fileTree = await listDirectory(WORKSPACE_KEY);
    const tree = { '/': fileTree };
    const fileTreeHash = await populateTreeWithHashes(WORKSPACE_KEY, tree);

    return res.status(200).json({
      success: true,
      message: "File Tree Hash Generated Successfully",
      data: {
        fileTreeHash: fileTreeHash["/"],
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

// GET USER RESUMES
exports.getUserResumes = async (req, res) => {
  try {

    const resumes = await Resume.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// GET SINGLE RESUME
exports.getResumeById = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// UPDATE RESUME
exports.updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const USER_ID = req.user.id;
    const resume = await Resume.findOne({
      where: {
        id: resumeId,
        user_id: USER_ID,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }

    const { title, description } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing title and description in the request body.",
      });
    }

    await resume.update({
      title,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Resume Updated Successfully",
      resume,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// DELETE RESUME
exports.deleteResume = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume Not Found",
      });
    }

    await resume.destroy();

    res.status(200).json({
      success: true,
      message: "Resume Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ADMIN - GET ALL RESUMES
exports.getAllResumes = async (req, res) => {
  try {

    const resumes = await Resume.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};