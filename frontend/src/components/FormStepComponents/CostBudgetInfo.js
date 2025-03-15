// frontend/src/components/FormStepComponents/CostBudgetInfo.js
import React from 'react';
import { 
  Grid, TextField, Typography, FormControl, 
  InputLabel, Select, MenuItem, FormHelperText,
  FormControlLabel, Radio, RadioGroup, FormLabel
} from '@mui/material';

const CostBudgetInfo = ({ formData, handleChange }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Cost and Budget Information</Typography>
      
      {/* 1. Estimated Cost Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Estimated Cost Breakdown</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="laborCosts"
            name="laborCosts"
            label="Labor Costs"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.laborCosts || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="materialsSupplies"
            name="materialsSupplies"
            label="Materials & Supplies"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.materialsSupplies || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="equipmentCosts"
            name="equipmentCosts"
            label="Equipment Costs"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.equipmentCosts || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="contractedServices"
            name="contractedServices"
            label="Contracted Services"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.contractedServices || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="otherCosts"
            name="otherCosts"
            label="Other (Specify)"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.otherCosts || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Break down the estimated costs of your project into categories like labor, equipment, and materials. If you're unsure, you can provide estimates and update them later.
          </FormHelperText>
        </Grid>
        
        {/* 2. Insurance Coverage */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Insurance Coverage</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Do you have insurance coverage?</FormLabel>
            <RadioGroup
              row
              name="hasInsurance"
              value={formData.hasInsurance || 'no'}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        {formData.hasInsurance === 'yes' && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>If yes, what type of coverage?</Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.insuranceType === 'property'}
                    onChange={handleChange}
                    name="insuranceType"
                    value="property"
                  />
                }
                label="Property"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.insuranceType === 'liability'}
                    onChange={handleChange}
                    name="insuranceType"
                    value="liability"
                  />
                }
                label="Liability"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Radio
                    checked={formData.insuranceType === 'other'}
                    onChange={handleChange}
                    name="insuranceType"
                    value="other"
                  />
                }
                label="Other (Specify)"
              />
            </Grid>
            
            {formData.insuranceType === 'other' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="otherInsuranceType"
                  name="otherInsuranceType"
                  label="Specify Other Insurance Type"
                  value={formData.otherInsuranceType || ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </>
        )}
        
        <Grid item xs={12}>
          <FormHelperText>
            FEMA needs to know if your organization has insurance coverage. If you do, provide the types and details. If not, explain why.
          </FormHelperText>
        </Grid>
        
        {/* 3. Previous Disaster Funding */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Previous Disaster Funding</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Have you received PA funds before?</FormLabel>
            <RadioGroup
              row
              name="hasPreviousFunding"
              value={formData.hasPreviousFunding || 'no'}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        {formData.hasPreviousFunding === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              id="previousFundingDetails"
              name="previousFundingDetails"
              label="Previous Funding Details"
              placeholder="Include disaster number, project title, and amount"
              value={formData.previousFundingDetails || ''}
              onChange={handleChange}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <FormHelperText>
            If your organization has applied for or received FEMA funds in the past, provide details of past grants or projects.
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};

export default CostBudgetInfo;