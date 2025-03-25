// backend/models/intakeFormModel.js
const mongoose = require('mongoose');

const intakeFormSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // NEW: Initial Survey/PDA Upload
    ppdaUpload: {
      hasUploadedFile: {
        type: Boolean,
        default: false
      },
      fileType: {
        type: String,
        enum: ['pda', 'survey123', 'other', ''],
        default: ''
      },
      fileName: String,
      filePath: String,
      extractedData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    // Section 1: Applicant Information
    applicantName: {
      type: String,
      required: true,
    },
    applicantType: {
      type: String,
      required: true,
      enum: ['state', 'local', 'tribal', 'nonprofit', 'other'],
    },
    contactName: {
      type: String,
      required: true,
    },
    contactTitle: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    organizationType: {
      type: String,
      required: true,
      enum: ['government', 'nonprofit', 'other'],
    },
    federalEIN: {
      type: String,
      required: true,
    },
    dunsNumber: String,
    
    // Section 2: Disaster Information
    disasterNumber: {
      type: String,
      required: true,
    },
    disasterType: {
      type: String,
      required: true,
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    incidentStartDate: {
      type: Date,
      required: true,
    },
    incidentEndDate: {
      type: Date,
      required: true,
    },
    countyNames: {
      type: String,
      required: true,
    },
    cityNames: {
      type: String,
      required: true,
    },
    tribalLandNames: String,
    
    // Section 3: Project Information
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    estimatedTotalCost: {
      type: Number,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ['public-infrastructure', 'emergency-response', 'temporary-housing', 'community-services', 'other'],
    },
    projectAddress: {
      type: String,
      required: true,
    },
    projectLatitude: String,
    projectLongitude: String,
    projectAreaLocation: {
      type: String,
      required: true,
    },
    scopeOfWork: {
      type: String,
      required: true,
    },
    
    // Section 4: Cost and Budget Information
    costBreakdown: {
      laborCosts: {
        type: Number,
        default: 0,
      },
      materialsSupplies: {
        type: Number,
        default: 0,
      },
      equipmentCosts: {
        type: Number,
        default: 0,
      },
      contractedServices: {
        type: Number,
        default: 0,
      },
      otherCosts: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    insuranceInfo: {
      hasInsurance: {
        type: Boolean,
        default: false,
      },
      insuranceType: {
        type: String,
        enum: ['property', 'liability', 'other', ''],
        default: '',
      },
      otherInsuranceType: String,
    },
    previousFunding: {
      hasPreviousFunding: {
        type: Boolean,
        default: false,
      },
      previousFundingDetails: String,
    },
    
    // Section 5: Documentation Requirements
    documents: [
      {
        type: String,
        docType: {
          type: String,
          enum: ['projectWorksheets', 'costEstimates', 'mapsPlans', 'insuranceDocs', 'damagePhotos', 'otherDocs'],
        },
        fileName: String,
        filePath: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // Section 6: Compliance and Certification
    compliance: {
      compliesWithGuidelines: {
        type: Boolean,
        default: true,
      },
      nonComplianceAreas: String,
      certificateAgree: {
        type: Boolean,
        default: false,
        required: true,
      },
      signatureName: {
        type: String,
        required: true,
      },
      signatureDate: {
        type: Date,
        required: true,
      },
    },
    
    // Generated Forms
    generatedForms: [
      {
        formType: String,
        fileName: String,
        filePath: String,
        generatedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // Form Status
    status: {
      type: String,
      default: 'Draft',
      enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Denied'],
    },
    
    // AI Processing Status
    aiProcessingResults: {
      approvalProbability: {
        type: Number,
        default: 0,
      },
      validationWarnings: [String],
      recommendations: [String],
      pappgCompliance: {
        isCompliant: {
          type: Boolean,
          default: false,
        },
        complianceIssues: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

const IntakeForm = mongoose.model('IntakeForm', intakeFormSchema);

module.exports = IntakeForm;