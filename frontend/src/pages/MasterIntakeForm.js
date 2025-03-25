// src/pages/MasterIntakeForm.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Stepper, Step, StepLabel, 
  Button, Box, Alert, CircularProgress, Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SurveyPdaUpload from '../components/FormStepComponents/SurveyPdaUpload';
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
    // PDA Upload
    ppdaUpload: {
      hasUploadedFile: false,
      fileType: '',
      fileName: ''
    },
    
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
  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [aiNotification, setAiNotification] = useState({ open: false, message: '', severity: 'info' });

  // For demo, using a hardcoded user ID
  const userId = '60d21b4667d0d8992e610c85';

  // Updated steps array to include new Survey/PDA Upload step
  const steps = [
    'Survey/PDA Upload',
    'Applicant Information',
    'Disaster Information',
    'Project Information',
    'Cost and Budget',
    'Documentation',
    'Compliance & Certification',
    'Review & Generate'
  ];

  // Request AI suggestions when moving between steps or when key fields change
  useEffect(() => {
    // Only get suggestions if we have some basic data
    const getSuggestions = async () => {
      if (formData.projectName || formData.applicantName || formData.disasterNumber) {
        setLoadingSuggestions(true);
        try {
          const response = await api.getFormSuggestions(formData);
          setSuggestions(response.data);
          
          // If we got new suggestions, show a notification
          if (response.data && Object.keys(response.data).length > 0) {
            setAiNotification({
              open: true, 
              message: 'AI has suggested improvements to your form',
              severity: 'info'
            });
          }
        } catch (error) {
          console.error('Error getting suggestions:', error);
        } finally {
          setLoadingSuggestions(false);
        }
      }
    };

    // Don't call for suggestions on every change - only when steps change
    if (activeStep > 0) {
      getSuggestions();
    }
  }, [activeStep]);

  // Validate costs when reaching the budget step
  useEffect(() => {
    const validateCostEstimates = async () => {
      if (activeStep === 4 && 
          (formData.laborCosts || formData.equipmentCosts || formData.materialsSupplies)) {
        try {
          const costData = {
            laborCosts: formData.laborCosts,
            equipmentCosts: formData.equipmentCosts,
            materialsSupplies: formData.materialsSupplies,
            contractedServices: formData.contractedServices,
            otherCosts: formData.otherCosts,
            total: parseFloat(formData.estimatedTotalCost) || 0
          };
          
          const response = await api.validateCosts(costData);
          
          if (response.data && !response.data.isCompliant) {
            setAiNotification({
              open: true,
              message: 'AI detected potential issues with cost estimates',
              severity: 'warning'
            });
          }
        } catch (error) {
          console.error('Error validating costs:', error);
        }
      }
    };
    
    validateCostEstimates();
  }, [activeStep, formData.laborCosts, formData.equipmentCosts, formData.materialsSupplies]);

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

  // Function to update the form with extracted data from PDA/Survey123
  const updateFormWithExtractedData = (extractedData) => {
    setFormData(prevData => ({
      ...prevData,
      ...extractedData,
      ppdaUpload: {
        hasUploadedFile: true,
        fileType: 'pda',
        fileName: extractedData.fileName || '',
      }
    }));
    
    // Show success notification
    setAiNotification({
      open: true,
      message: 'AI has pre-filled your form with extracted data',
      severity: 'success'
    });
  };

  // Function to apply AI suggestions
  const applySuggestion = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Show success notification
    setAiNotification({
      open: true,
      message: `Applied AI suggestion for ${field}`,
      severity: 'success'
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setAiNotification({
      ...aiNotification,
      open: false
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFormErrors([]);
      
      // Validate form against PAPPG before submitting
      try {
        const validation = await api.validateWithAI(formData);
        if (validation.data && !validation.data.isValid) {
          setFormErrors([
            'AI validation detected compliance issues. Please review the form before submitting.'
          ]);
          setIsSubmitting(false);
          return;
        }
      } catch (validationError) {
        console.error('Validation error:', validationError);
        // Continue with submission even if validation fails
      }
      
      // Create or update the intake form
      const formResponse = await api.createIntakeForm({
        ...formData,
        userId // Add the user ID to the form data
      });
      
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
      case 0: return <SurveyPdaUpload 
                        formData={formData} 
                        handleChange={handleChange} 
                        updateFormData={updateFormWithExtractedData} 
                      />;
      case 1: return <ApplicantInfo 
                        formData={formData} 
                        handleChange={handleChange} 
                        suggestions={suggestions} 
                        applySuggestion={applySuggestion} 
                      />;
      case 2: return <DisasterInfo 
                        formData={formData} 
                        handleChange={handleChange} 
                        suggestions={suggestions} 
                        applySuggestion={applySuggestion} 
                      />;
      case 3: return <ProjectInfo 
                        formData={formData} 
                        handleChange={handleChange} 
                        suggestions={suggestions} 
                        applySuggestion={applySuggestion} 
                      />;
      case 4: return <CostBudgetInfo 
                        formData={formData} 
                        handleChange={handleChange} 
                        suggestions={suggestions} 
                        applySuggestion={applySuggestion} 
                      />;
      case 5: return <DocumentRequirements 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleFileUpload={handleFileUpload} 
                      />;
      case 6: return <ComplianceCertification 
                        formData={formData} 
                        handleChange={handleChange} 
                      />;
      case 7: return <FormReview 
                        formData={formData} 
                        handleSubmit={handleSubmit} 
                        goToStep={setActiveStep} 
                      />;
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
        
        {loadingSuggestions && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              AI is analyzing your form...
            </Typography>
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
      
      {/* AI Notifications */}
      <Snackbar 
        open={aiNotification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={aiNotification.severity} 
          sx={{ width: '100%' }}
        >
          {aiNotification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MasterIntakeForm;