// frontend/src/components/FormStepComponents/ApplicantInfo.js
import React from 'react';
import { 
  Grid, TextField, Typography, FormControl, 
  InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';

const ApplicantInfo = ({ formData, handleChange }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Applicant Information</Typography>
      
      {/* 1. Applicant Name */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="applicantName"
            name="applicantName"
            label="Applicant Name"
            value={formData.applicantName || ''}
            onChange={handleChange}
            helperText="Enter the name of the organization or agency that is applying for FEMA assistance"
          />
        </Grid>
        
        {/* 2. Applicant Type */}
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="applicant-type-label">Applicant Type</InputLabel>
            <Select
              labelId="applicant-type-label"
              id="applicantType"
              name="applicantType"
              value={formData.applicantType || ''}
              onChange={handleChange}
              label="Applicant Type"
            >
              <MenuItem value="state">State Government</MenuItem>
              <MenuItem value="local">Local Government</MenuItem>
              <MenuItem value="tribal">Tribal Government</MenuItem>
              <MenuItem value="nonprofit">Private Non-Profit</MenuItem>
              <MenuItem value="other">Other (Specify)</MenuItem>
            </Select>
            <FormHelperText>
              Choose the option that best describes the type of organization you represent. If you're unsure, "Local Government" is the most common selection for city or county applicants.
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {/* 3. Applicant Contact Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Applicant Contact Information</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="contactName"
            name="contactName"
            label="Name of Contact Person"
            value={formData.contactName || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="contactTitle"
            name="contactTitle"
            label="Title"
            value={formData.contactTitle || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="contactEmail"
            name="contactEmail"
            label="Email Address"
            type="email"
            value={formData.contactEmail || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="contactPhone"
            name="contactPhone"
            label="Phone Number"
            value={formData.contactPhone || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormHelperText>
            Provide the contact information for the person who is most familiar with the disaster recovery efforts and can answer questions from FEMA.
          </FormHelperText>
        </Grid>
        
        {/* 4. Organization Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Organization Information</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="org-type-label">Organization Type</InputLabel>
            <Select
              labelId="org-type-label"
              id="organizationType"
              name="organizationType"
              value={formData.organizationType || ''}
              onChange={handleChange}
              label="Organization Type"
            >
              <MenuItem value="government">Government</MenuItem>
              <MenuItem value="nonprofit">Non-profit</MenuItem>
              <MenuItem value="other">Other (Specify)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="federalEIN"
            name="federalEIN"
            label="Federal EIN (Employer Identification Number)"
            value={formData.federalEIN || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="dunsNumber"
            name="dunsNumber"
            label="DUNS Number (if applicable)"
            value={formData.dunsNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormHelperText>
            Your Federal EIN is used to identify your organization to FEMA. The DUNS number may be required for non-profit organizations or private entities.
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};

export default ApplicantInfo;