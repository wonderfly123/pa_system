// src/pages/MasterIntakeForm.js
import React, { useState } from 'react';
import { 
  Container, Paper, Typography, Stepper, Step, StepLabel, 
  Button, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ApplicantInfo from '../components/FormStepComponents/ApplicantInfo';
import DisasterInfo from '../components/FormStepComponents/DisasterInfo';
import ProjectInfo from '../components/FormStepComponents/ProjectInfo';
import CostBudgetInfo from '../components/FormStepComponents/CostBudgetInfo';
import DocumentRequirements from '../components/FormStepComponents/DocumentRequirements';
import ComplianceCertification from '../components/FormStepComponents/ComplianceCertification';
import FormReview from '../components/FormStepComponents/FormReview';
import api from '../utils/api';

const MasterIntakeForm = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Initialize with empty values for all fields
    // Applicant Information
    applicantName: '',
    applicantType: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    organizationType: '',
    federalEIN: '',
    dunsNumber: '',
    
    // Disaster Information
    disasterNumber: '',
    disasterType: '',
    incidentDate: '',
    incidentStartDate: '',
    incidentEndDate: '',
    countyNames: '',
    cityNames: '',
    tribalLandNames: '',
    
    // Project Information
    projectName: '',
    projectDescription: '',
    estimatedTotalCost: '',
    projectType: '',
    projectAddress: '',
    projectLatitude: '',
    projectLongitude: '',
    projectAreaLocation: '',
    scopeOfWork: '',
    
    // Cost and Budget Information
    laborCosts: '',
    materialsSupplies: '',
    equipmentCosts: '',
    contractedServices: '',
    otherCosts: '',
    hasInsurance: 'no',
    insuranceType: '',
    otherInsuranceType: '',
    hasPreviousFunding: 'no',
    previousFundingDetails: '',
    
    // Compliance and Certification
    compliesWithGuidelines: 'yes',
    nonComplianceAreas: '',
    certificateAgree: false,
    signatureName: '',
    signatureDate: ''
  });

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    'Applicant Information',
    'Disaster Information',
    'Project Information',
    'Cost and Budget',
    'Documentation',
    'Compliance & Certification',
    'Review & Generate'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = (files, docType) => {
    // In a real app, you would send these files to your server
    // For now, just track them in state
    const newDocuments = files.map(file => ({
      type: docType,
      name: file.name,
      size: file.size,
      file: file
    }));
    
    setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      // First, create or update the intake form
      const formResponse = await api.createIntakeForm(formData);
      
      // Then upload any documents
      if (uploadedDocuments.length > 0) {
        // In a real app, you would upload files here
        console.log('Uploading documents:', uploadedDocuments);
      }
      
      // Generate FEMA forms
      await api.generateFemaForms(formResponse.data._id);
      
      // Navigate to dashboard with success message
      navigate('/dashboard', { 
        state: { 
          message: 'FEMA forms generated successfully!', 
          severity: 'success' 
        } 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors([error.response?.data?.message || 'Failed to submit form. Please try again.']);
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return <ApplicantInfo formData={formData} handleChange={handleChange} />;
      case 1: return <DisasterInfo formData={formData} handleChange={handleChange} />;
      case 2: return <ProjectInfo formData={formData} handleChange={handleChange} />;
      case 3: return <CostBudgetInfo formData={formData} handleChange={handleChange} />;
      case 4: return <DocumentRequirements formData={formData} handleChange={handleChange} handleFileUpload={handleFileUpload} />;
      case 5: return <ComplianceCertification formData={formData} handleChange={handleChange} />;
      case 6: return <FormReview formData={formData} handleSubmit={handleSubmit} goToStep={setActiveStep} />;
      default: return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          FEMA Public Assistance Application
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
          Complete this form to generate required FEMA documents
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {formErrors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {formErrors.map((error, index) => (
              <Alert severity="error" key={index} sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}
        
        <Box sx={{ mt: 2, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Generating Forms...' : 'Generate FEMA Forms'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default MasterIntakeForm;