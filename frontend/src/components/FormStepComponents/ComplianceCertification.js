// frontend/src/components/FormStepComponents/ComplianceCertification.js
import React from 'react';
import { 
  Grid, Typography, FormControlLabel, Checkbox,
  TextField, FormHelperText, Button, Box,
  FormControl, FormLabel, RadioGroup, Radio
} from '@mui/material';

const ComplianceCertification = ({ formData, handleChange }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Compliance and Certification</Typography>
      
      <Grid container spacing={3}>
        {/* 1. Compliance with FEMA Guidelines */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Compliance with FEMA Guidelines</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">The project complies with FEMA's Public Assistance Program guidelines (PAPPG)</FormLabel>
            <RadioGroup
              row
              name="compliesWithGuidelines"
              value={formData.compliesWithGuidelines || 'yes'}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        {formData.compliesWithGuidelines === 'no' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="nonComplianceAreas"
              name="nonComplianceAreas"
              label="Describe the areas of non-compliance"
              value={formData.nonComplianceAreas || ''}
              onChange={handleChange}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <FormHelperText>
            The project must align with FEMA's guidelines. If there are any discrepancies or areas that do not comply, note them here.
          </FormHelperText>
        </Grid>
        
        {/* 2. Certification and Signature */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Certification and Signature</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="certificateAgree"
                checked={formData.certificateAgree || false}
                // frontend/src/components/FormStepComponents/ComplianceCertification.js
                onChange={(e) => handleChange({
                    target: {
                      name: 'certificateAgree',
                      value: e.target.checked
                    }
                  })}
                />
              }
              label="By submitting this form, I certify that the information provided is accurate and complies with FEMA's Public Assistance Program guidelines."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="signatureName"
              name="signatureName"
              label="Signature (Full Name)"
              value={formData.signatureName || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="signatureDate"
              name="signatureDate"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.signatureDate || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormHelperText>
              By signing, you're certifying that everything in the application is true and accurate. Be sure all fields are completed before signing.
            </FormHelperText>
          </Grid>
        </Grid>
      </>
    );
  };
  
  export default ComplianceCertification;