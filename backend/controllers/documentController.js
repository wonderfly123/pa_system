const Document = require('../models/documentModel');
const Project = require('../models/projectModel');
const path = require('path');
const fs = require('fs');

// @desc    Get documents by project ID
// @route   GET /api/documents/project/:projectId
// @access  Public
const getDocumentsByProject = async (req, res) => {
  try {
    const documents = await Document.find({ project: req.params.projectId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Public
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if project exists
    const project = await Project.findById(req.body.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create document record
    const document = new Document({
      project: req.body.projectId,
      documentType: getDocumentType(req.file.originalname),
      fileName: req.file.originalname,
      filePath: req.file.path,
      status: 'Uploaded',
    });

    const createdDocument = await document.save();

    // Update project metrics
    project.metrics.totalDocuments += 1;
    await project.save();

    res.status(201).json(createdDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Public
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Update project metrics
    const project = await Project.findById(document.project);
    if (project) {
      project.metrics.totalDocuments -= 1;
      if (document.status === 'Processed') {
        project.metrics.processedDocuments -= 1;
      }
      await project.save();
    }

    await document.remove();
    
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return 'PDF';
    case '.doc':
    case '.docx':
      return 'Word';
    case '.xls':
    case '.xlsx':
      return 'Excel';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'Image';
    default:
      return 'Other';
  }
};

module.exports = {
  getDocumentsByProject,
  uploadDocument,
  deleteDocument,
};