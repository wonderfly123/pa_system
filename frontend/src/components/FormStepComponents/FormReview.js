// frontend/src/components/FormStepComponents/FormReview.js
import React from 'react';
import { 
  Grid, Typography, Paper, Divider, Button,
  Box, List, ListItem, ListItemText, Alert
} from '@mui/material';

const FormReview = ({ formData, handleSubmit, goToStep }) => {
  const sections = [
    {
      title: "Applicant Information",
      fields: [
        { label: "Applicant Name", value: formData.applicantName },
        { label: "Applicant Type", value: formData.applicantType },
        { label: "Contact Name", value: formData.contactName },
        { label: "Contact Email", value: formData.contactEmail },
        { label: "Contact Phone", value: formData.contactPhone },
        { label: "Federal EIN", value: formData.federalEIN },
      ],
      stepIndex: 0
    },
    {
      title: "Disaster Information",
      fields: [
        { label: "Disaster Number", value: formData.disasterNumber },
        { label: "Disaster Type", value: formData.disasterType },
        { label: "Incident Date", value: formData.incidentDate },
        { label: "Incident Period", value: `${formData.incidentStartDate} to ${formData.incidentEndDate}` },
        { label: "Affected Areas", value: `${formData.countyNames}, ${formData.cityNames}` },
      ],
      stepIndex: 1
    },
    {
      title: "Project Information",
      fields: [
        { label: "Project Name", value: formData.projectName },
        { label: "Project Type", value: formData.projectType },
        { label: "Estimated Total Cost", value: `$${formData.estimatedTotalCost}` },
        { label: "Project Location", value: formData.projectAddress },
        { label: "Scope of Work", value: formData.scopeOfWork },
      ],
      stepIndex: 2
    },
    {
      title: "Cost and Budget Information",
      fields: [
        { label: "Labor Costs", value: `$${formData.laborCosts}` },
        { label: "Materials & Supplies", value: `$${formData.materialsSupplies}` },
        { label: "Equipment Costs", value: `$${formData.equipmentCosts}` },
        { label: "Contracted Services", value: `$${formData.contractedServices}` },
        { label: "Insurance Coverage", value: formData.hasInsurance === 'yes' ? 'Yes' : 'No' },
        { label: "Previous PA Funding", value: formData.hasPreviousFunding === 'yes' ? 'Yes' : 'No' },
      ],
      stepIndex: 3
    },
    {
      title: "Documentation & Compliance",
      fields: [
        { label: "Required Documents", value: "Refer to uploaded documents" },
        { label: "Complies with FEMA Guidelines", value: formData.compliesWithGuidelines === 'yes' ? 'Yes' : 'No' },
        { label: "Certification", value: formData.certificateAgree ? 'Agreed' : 'Not agreed' },
      ],
      stepIndex: 5
    }
  ];

  // Check for missing required fields
  const missingFields = [];
  const requiredFields = [
    'applicantName', 'applicantType', 'contactName', 'contactEmail', 'contactPhone',
    'disasterNumber', 'disasterType', 'incidentDate', 'projectName', 'projectType',
    'estimatedTotalCost', 'scopeOfWork', 'certificateAgree', 'signatureName', 'signatureDate'
  ];
  
  requiredFields.forEach(field => {
    if (!formData[field]) {
      missingFields.push(field);
    }
  });

  return (
    <>
      <Typography variant="h6" gutterBottom>Review & Generate Forms</Typography>
      
      {missingFields.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Missing Required Information</Typography>
          <Typography variant="body2">
            Please complete the following required fields before generating FEMA forms:
          </Typography>
          <List dense>
            {missingFields.map((field, index) => (
              <ListItem key={index}>
                <ListItemText primary={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {sections.map((section, sectionIndex) => (
          <Grid item xs={12} key={sectionIndex}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">{section.title}</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => goToStep(section.stepIndex)}
                >
                  Edit
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {section.fields.map((field, fieldIndex) => (
                  <React.Fragment key={fieldIndex}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">{field.label}:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">{field.value || 'Not provided'}</Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Generate FEMA Forms</Typography>
          <Typography variant="body2" paragraph>
            Once you submit this application, the system will generate the following FEMA forms based on your information:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="FEMA Form 009-0-91 (Project Worksheet)" 
                secondary="Main form for project details and costs" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="FEMA Form 009-0-91B (PROJECT WORKSHEET - Cost Estimate Continuation Sheet)" 
                secondary="Detailed breakdown of project costs" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="FEMA Form 009-0-123 (Force Account Labor Summary)" 
                secondary="For labor costs, if applicable" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="FEMA Form 009-0-127 (Equipment Summary)" 
                secondary="For equipment costs, if applicable" 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="FEMA Form 009-0-124 (Materials Summary)" 
                secondary="For materials costs, if applicable" 
              />
            </ListItem>
          </List>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={missingFields.length > 0 || !formData.certificateAgree}
            >
              Generate FEMA Forms
            </Button>
          </Box>
          
          {(missingFields.length > 0 || !formData.certificateAgree) && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
              Please complete all required fields and agree to the certification before generating forms.
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default FormReview;