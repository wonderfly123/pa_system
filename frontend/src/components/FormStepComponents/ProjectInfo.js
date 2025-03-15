// frontend/src/components/FormStepComponents/ProjectInfo.js
import React from 'react';
import { 
  Grid, TextField, Typography, FormControl, 
  InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';

const ProjectInfo = ({ formData, handleChange }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Project Information</Typography>
      
      {/* 1. Project Name */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="projectName"
            name="projectName"
            label="Project Name"
            value={formData.projectName || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Name the project you are applying for. This could be something like "Public Infrastructure Repair" or "Emergency Sheltering Program." Keep it simple and descriptive.
          </FormHelperText>
        </Grid>
        
        {/* 2. Project Description */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            id="projectDescription"
            name="projectDescription"
            label="Project Description"
            value={formData.projectDescription || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Describe the project in as much detail as possible. Explain the purpose and how it will help your community recover. FEMA needs to understand exactly what you're requesting funding for.
          </FormHelperText>
        </Grid>
        
        {/* 3. Estimated Total Project Cost */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="estimatedTotalCost"
            name="estimatedTotalCost"
            label="Estimated Total Project Cost"
            type="number"
            InputProps={{ startAdornment: '$' }}
            value={formData.estimatedTotalCost || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Provide an estimate of the total cost for the project. Be as accurate as possible based on available cost estimates. If you're not sure, list your best approximation and let FEMA know you'll be submitting more detailed estimates later.
          </FormHelperText>
        </Grid>
        
        {/* 4. Project Type */}
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="project-type-label">Project Type</InputLabel>
            <Select
              labelId="project-type-label"
              id="projectType"
              name="projectType"
              value={formData.projectType || ''}
              onChange={handleChange}
              label="Project Type"
            >
              <MenuItem value="public-infrastructure">Public Infrastructure</MenuItem>
              <MenuItem value="emergency-response">Emergency Response</MenuItem>
              <MenuItem value="temporary-housing">Temporary Housing</MenuItem>
              <MenuItem value="community-services">Community Services</MenuItem>
              <MenuItem value="other">Other (Specify)</MenuItem>
            </Select>
            <FormHelperText>
              Choose the project type that best fits the nature of your request. If you're working on infrastructure like roads or buildings, select "Public Infrastructure." For emergency services like shelters, select "Emergency Response."
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {/* 5. Project Location */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Project Location</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="projectAddress"
            name="projectAddress"
            label="Address"
            value={formData.projectAddress || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            id="projectLatitude"
            name="projectLatitude"
            label="Latitude (optional)"
            value={formData.projectLatitude || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            id="projectLongitude"
            name="projectLongitude"
            label="Longitude (optional)"
            value={formData.projectLongitude || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="projectAreaLocation"
            name="projectAreaLocation"
            label="City/County/Tribal Area"
            value={formData.projectAreaLocation || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Provide the project's exact location. If the location spans multiple areas, list all impacted locations. Adding latitude and longitude can help FEMA pinpoint the location, but it's optional.
          </FormHelperText>
        </Grid>
        
        {/* 6. Scope of Work */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            multiline
            rows={6}
            id="scopeOfWork"
            name="scopeOfWork"
            label="Scope of Work"
            value={formData.scopeOfWork || ''}
            onChange={handleChange}
          />
          <FormHelperText>
            Be detailed here. Describe the work that needs to be done, including any repairs, installations, or actions taken to support the disaster recovery.
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectInfo;