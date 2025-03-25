// backend/controllers/intakeFormController.js
const IntakeForm = require('../models/intakeFormModel');
const aiService = require('../services/aiService');

// @desc    Create a new intake form
// @route   POST /api/intake
// @access  Public
const createIntakeForm = async (req, res) => {
  try {
    const formData = req.body;
    
    // Calculate total cost
    const laborCosts = parseFloat(formData.laborCosts) || 0;
    const materialsSupplies = parseFloat(formData.materialsSupplies) || 0;
    const equipmentCosts = parseFloat(formData.equipmentCosts) || 0;
    const contractedServices = parseFloat(formData.contractedServices) || 0;
    const otherCosts = parseFloat(formData.otherCosts) || 0;
    const totalCost = laborCosts + materialsSupplies + equipmentCosts + contractedServices + otherCosts;
    
    const intakeForm = new IntakeForm({
      user: req.body.userId,
      
      // NEW: PDA Upload Information (if provided)
      ppdaUpload: formData.ppdaUpload || {
        hasUploadedFile: false
      },
      
      // Section 1: Applicant Information
      applicantName: formData.applicantName,
      applicantType: formData.applicantType,
      contactName: formData.contactName,
      contactTitle: formData.contactTitle,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      organizationType: formData.organizationType,
      federalEIN: formData.federalEIN,
      dunsNumber: formData.dunsNumber,
      
      // Section 2: Disaster Information
      disasterNumber: formData.disasterNumber,
      disasterType: formData.disasterType,
      incidentDate: formData.incidentDate,
      incidentStartDate: formData.incidentStartDate,
      incidentEndDate: formData.incidentEndDate,
      countyNames: formData.countyNames,
      cityNames: formData.cityNames,
      tribalLandNames: formData.tribalLandNames,
      
      // Section 3: Project Information
      projectName: formData.projectName,
      projectDescription: formData.projectDescription,
      estimatedTotalCost: parseFloat(formData.estimatedTotalCost) || 0,
      projectType: formData.projectType,
      projectAddress: formData.projectAddress,
      projectLatitude: formData.projectLatitude,
      projectLongitude: formData.projectLongitude,
      projectAreaLocation: formData.projectAreaLocation,
      scopeOfWork: formData.scopeOfWork,
      
      // Section 4: Cost and Budget Information
      costBreakdown: {
        laborCosts,
        materialsSupplies,
        equipmentCosts,
        contractedServices,
        otherCosts,
        total: totalCost
      },
      insuranceInfo: {
        hasInsurance: formData.hasInsurance === 'yes',
        insuranceType: formData.insuranceType,
        otherInsuranceType: formData.otherInsuranceType
      },
      previousFunding: {
        hasPreviousFunding: formData.hasPreviousFunding === 'yes',
        previousFundingDetails: formData.previousFundingDetails
      },
      
      // Section 6: Compliance and Certification
      compliance: {
        compliesWithGuidelines: formData.compliesWithGuidelines === 'yes',
        nonComplianceAreas: formData.nonComplianceAreas,
        certificateAgree: formData.certificateAgree,
        signatureName: formData.signatureName,
        signatureDate: formData.signatureDate
      },
      
      // Set initial status
      status: 'Draft',
      
      // Mock AI processing results
      aiProcessingResults: {
        approvalProbability: 0.68,
        validationWarnings: [],
        recommendations: [
          'Complete all required fields',
          'Upload supporting documentation',
          'Ensure cost estimates are detailed and accurate'
        ],
        pappgCompliance: {
          isCompliant: true,
          complianceIssues: []
        }
      }
    });
    
    const createdForm = await intakeForm.save();
    res.status(201).json(createdForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all intake forms for a user
// @route   GET /api/intake/user/:userId
// @access  Public
const getIntakeFormsByUser = async (req, res) => {
  try {
    const forms = await IntakeForm.find({ user: req.params.userId });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an intake form by ID
// @route   GET /api/intake/:id
// @access  Public
const getIntakeFormById = async (req, res) => {
  try {
    const form = await IntakeForm.findById(req.params.id);
    
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an intake form
// @route   PUT /api/intake/:id
// @access  Public
const updateIntakeForm = async (req, res) => {
  try {
    const form = await IntakeForm.findById(req.params.id);
    
    if (form) {
      const formData = req.body;
      
      // Calculate total cost
      const laborCosts = parseFloat(formData.laborCosts) || 0;
      const materialsSupplies = parseFloat(formData.materialsSupplies) || 0;
      const equipmentCosts = parseFloat(formData.equipmentCosts) || 0;
      const contractedServices = parseFloat(formData.contractedServices) || 0;
      const otherCosts = parseFloat(formData.otherCosts) || 0;
      const totalCost = laborCosts + materialsSupplies + equipmentCosts + contractedServices + otherCosts;
      
      // Update PDA Upload Information
      if (formData.ppdaUpload) {
        form.ppdaUpload = formData.ppdaUpload;
      }
      
      // Update Section 1: Applicant Information
      form.applicantName = formData.applicantName || form.applicantName;
      form.applicantType = formData.applicantType || form.applicantType;
      form.contactName = formData.contactName || form.contactName;
      form.contactTitle = formData.contactTitle || form.contactTitle;
      form.contactEmail = formData.contactEmail || form.contactEmail;
      form.contactPhone = formData.contactPhone || form.contactPhone;
      form.organizationType = formData.organizationType || form.organizationType;
      form.federalEIN = formData.federalEIN || form.federalEIN;
      form.dunsNumber = formData.dunsNumber || form.dunsNumber;
      
      // Update Section 2: Disaster Information
      form.disasterNumber = formData.disasterNumber || form.disasterNumber;
      form.disasterType = formData.disasterType || form.disasterType;
      form.incidentDate = formData.incidentDate || form.incidentDate;
      form.incidentStartDate = formData.incidentStartDate || form.incidentStartDate;
      form.incidentEndDate = formData.incidentEndDate || form.incidentEndDate;
      form.countyNames = formData.countyNames || form.countyNames;
      form.cityNames = formData.cityNames || form.cityNames;
      form.tribalLandNames = formData.tribalLandNames || form.tribalLandNames;
      
      // Update Section 3: Project Information
      form.projectName = formData.projectName || form.projectName;
      form.projectDescription = formData.projectDescription || form.projectDescription;
      form.estimatedTotalCost = parseFloat(formData.estimatedTotalCost) || form.estimatedTotalCost;
      form.projectType = formData.projectType || form.projectType;
      form.projectAddress = formData.projectAddress || form.projectAddress;
      form.projectLatitude = formData.projectLatitude || form.projectLatitude;
      form.projectLongitude = formData.projectLongitude || form.projectLongitude;
      form.projectAreaLocation = formData.projectAreaLocation || form.projectAreaLocation;
      form.scopeOfWork = formData.scopeOfWork || form.scopeOfWork;
      
      // Update Section 4: Cost and Budget Information
      form.costBreakdown = {
        laborCosts,
        materialsSupplies,
        equipmentCosts,
        contractedServices,
        otherCosts,
        total: totalCost
      };
      
      form.insuranceInfo = {
        hasInsurance: formData.hasInsurance === 'yes',
        insuranceType: formData.insuranceType,
        otherInsuranceType: formData.otherInsuranceType
      };
      
      form.previousFunding = {
        hasPreviousFunding: formData.hasPreviousFunding === 'yes',
        previousFundingDetails: formData.previousFundingDetails
      };
      
      // Update Section 6: Compliance and Certification
      form.compliance = {
        compliesWithGuidelines: formData.compliesWithGuidelines === 'yes',
        nonComplianceAreas: formData.nonComplianceAreas,
        certificateAgree: formData.certificateAgree,
        signatureName: formData.signatureName,
        signatureDate: formData.signatureDate
      };
      
      // Update status if specified
      if (formData.status) {
        form.status = formData.status;
      }
      
      // Run validation to check for PAPPG compliance
      // This would be replaced with actual AI integration
      const validationWarnings = [];
      let approvalProbability = 0.90;
      
      // Simple validation examples (in real app, this would be more complex)
      if (!form.scopeOfWork || form.scopeOfWork.length < 50) {
        validationWarnings.push('Scope of Work lacks sufficient detail');
        approvalProbability -= 0.10;
      }
      
      if (form.costBreakdown.total > 1000000 && (!form.insuranceInfo.hasInsurance)) {
        validationWarnings.push('Large projects require insurance documentation');
        approvalProbability -= 0.15;
      }
      
      if (!form.compliance.certificateAgree) {
        validationWarnings.push('Application must be certified before submission');
        approvalProbability -= 0.20;
      }
      
      // Update AI processing results
      form.aiProcessingResults = {
        approvalProbability: Math.max(0, Math.min(1, approvalProbability)),
        validationWarnings,
        recommendations: validationWarnings.length > 0 ? 
          ['Address all validation warnings to improve approval chance'] : 
          ['Application appears complete and ready for submission'],
        pappgCompliance: {
          isCompliant: validationWarnings.length === 0,
          complianceIssues: validationWarnings
        }
      };
      
      const updatedForm = await form.save();
      res.json(updatedForm);
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Generate FEMA forms from intake data
// @route   POST /api/intake/:id/generate
// @access  Public
const generateFemaForms = async (req, res) => {
  try {
    const form = await IntakeForm.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Intake form not found' });
    }
    
    // This is where we would call AI service to generate forms
    // For now, we'll simulate by adding placeholder generated forms
    
    const generatedForms = [
      {
        formType: 'FEMA Form 009-0-91',
        fileName: `PW_${form._id}.pdf`,
        filePath: `/generated/PW_${form._id}.pdf`,
        generatedDate: new Date()
      },
      {
        formType: 'FEMA Form 009-0-91B',
        fileName: `PW_CostEstimate_${form._id}.pdf`,
        filePath: `/generated/PW_CostEstimate_${form._id}.pdf`,
        generatedDate: new Date()
      },
      {
        formType: 'FEMA Form 009-0-123',
        fileName: `LaborSummary_${form._id}.pdf`,
        filePath: `/generated/LaborSummary_${form._id}.pdf`,
        generatedDate: new Date()
      },
      {
        formType: 'FEMA Form 009-0-127',
        fileName: `EquipmentSummary_${form._id}.pdf`,
        filePath: `/generated/EquipmentSummary_${form._id}.pdf`,
        generatedDate: new Date()
      },
      {
        formType: 'FEMA Form 009-0-124',
        fileName: `MaterialsSummary_${form._id}.pdf`,
        filePath: `/generated/MaterialsSummary_${form._id}.pdf`,
        generatedDate: new Date()
      }
    ];
    
    form.generatedForms = generatedForms;
    form.status = 'Submitted';
    
    // Update AI approval probability after full submission
    form.aiProcessingResults.approvalProbability = 0.85;
    
    await form.save();
    
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Run PAPPG compliance check on form data
// @route   POST /api/intake/:id/validate
// @access  Public
const validatePappgCompliance = async (req, res) => {
  try {
    const form = await IntakeForm.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Intake form not found' });
    }
    
    // Here we'll use our AI service for PAPPG validation
    try {
      const validationResults = await aiService.validateFormAgainstPAPPG(form);
      
      // Update the form with validation results
      form.aiProcessingResults.pappgCompliance = {
        isCompliant: validationResults.isValid,
        complianceIssues: validationResults.issues.map(issue => issue.message),
        complianceScore: validationResults.validationScore
      };
      
      await form.save();
      
      res.json(validationResults);
    } catch (aiError) {
      console.error('Error calling AI service:', aiError);
      
      // Fallback to basic validation if AI service fails
      const validationIssues = [];
      let complianceScore = 100;
      
      // Basic compliance checks
      if (!form.projectName || form.projectName.trim() === '') {
        validationIssues.push('Project Name is required');
        complianceScore -= 5;
      }
      
      if (!form.scopeOfWork || form.scopeOfWork.length < 100) {
        validationIssues.push('Scope of Work requires more detailed description (min. 100 characters)');
        complianceScore -= 10;
      }
      
      if (form.costBreakdown.total <= 0) {
        validationIssues.push('Project must have estimated costs greater than $0');
        complianceScore -= 15;
      }
      
      if (form.documents && form.documents.length === 0) {
        validationIssues.push('Supporting documentation is required for FEMA review');
        complianceScore -= 20;
      }
      
      // Update the form with validation results
     form.aiProcessingResults.pappgCompliance = {
      isCompliant: validationIssues.length === 0,
      complianceIssues: validationIssues,
      complianceScore: Math.max(0, complianceScore)
    };
    
    await form.save();
    
    res.json({
      isValid: validationIssues.length === 0,
      validationScore: complianceScore,
      issues: validationIssues.map(issue => ({
        field: 'unknown',
        severity: 'warning',
        message: issue,
        suggestion: `Fix: ${issue}`
      }))
    });
  }
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

// NEW CONTROLLER FUNCTIONS FOR AI INTEGRATION

// @desc    Process PDA or Survey123 document and extract data
// @route   POST /api/intake/process-pda
// @access  Public
const processPDADocument = async (req, res) => {
try {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Extract data from the document using AI
  const extractedData = await aiService.extractDataFromDocument(
    req.file.buffer,
    req.body.fileType || 'PDA'
  );

  res.json({
    success: true,
    extractedData,
    message: 'Document processed successfully'
  });
} catch (error) {
  console.error('Error processing PDA document:', error);
  res.status(500).json({ 
    message: 'Failed to process document',
    error: error.message
  });
}
};

// @desc    Validate form data against PAPPG using AI
// @route   POST /api/intake/validate-ai
// @access  Public
const validateWithAI = async (req, res) => {
try {
  const formData = req.body;
  
  // Validate form against PAPPG using AI
  const validationResults = await aiService.validateFormAgainstPAPPG(formData);
  
  res.json(validationResults);
} catch (error) {
  console.error('Error validating with AI:', error);
  res.status(500).json({ 
    message: 'Failed to validate form',
    error: error.message
  });
}
};

// @desc    Get AI suggestions for form completion
// @route   POST /api/intake/suggestions
// @access  Public
const getFormSuggestions = async (req, res) => {
try {
  const currentFormData = req.body;
  
  // Generate suggestions using AI
  const suggestions = await aiService.generateFormSuggestions(currentFormData);
  
  res.json(suggestions);
} catch (error) {
  console.error('Error getting form suggestions:', error);
  res.status(500).json({ 
    message: 'Failed to generate suggestions',
    error: error.message
  });
}
};

// @desc    Check cost estimates against FEMA guidelines
// @route   POST /api/intake/validate-costs
// @access  Public
const validateCosts = async (req, res) => {
try {
  const costData = req.body;
  
  // Validate costs using AI
  const validationResults = await aiService.validateCostEstimates(costData);
  
  res.json(validationResults);
} catch (error) {
  console.error('Error validating costs:', error);
  res.status(500).json({ 
    message: 'Failed to validate cost estimates',
    error: error.message
  });
}
};

module.exports = {
createIntakeForm,
getIntakeFormsByUser,
getIntakeFormById,
updateIntakeForm,
generateFemaForms,
validatePappgCompliance,
processPDADocument,
validateWithAI,
getFormSuggestions,
validateCosts
};