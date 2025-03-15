// frontend/src/components/FormStepComponents/DisasterInfo.js
import React from 'react';
import { 
  Grid, TextField, Typography, FormControl, 
  InputLabel, Select, MenuItem, FormHelperText 
} from '@mui/material';

const DisasterInfo = ({ formData, handleChange }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Disaster Information</Typography>
      
      {/* 1. Disaster Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            id="disasterNumber"
            name="disasterNumber"
            label="Disaster Number (FEMA-assigned)"
            value={formData.disasterNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="disaster-type-label">Disaster Type</InputLabel>
            <Select
              labelId="disaster-type-label"
              id="disasterType"
              name="disasterType"
              value={formData.disasterType || ''}
              onChange={handleChange}
              label="Disaster Type"
            >
              <MenuItem value="flood">Flood</MenuItem>
              <MenuItem value="hurricane">Hurricane</MenuItem>
              <MenuItem value="tornado">Tornado</MenuItem>
              <MenuItem value="earthquake">Earthquake</MenuItem>
              <MenuItem value="fire">Fire</MenuItem>
              <MenuItem value="winter">Winter Storm</MenuItem>
              <MenuItem value="other">Other (Specify)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="incidentDate"
            name="incidentDate"
            label="Date of Incident"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.incidentDate || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="incidentStartDate"
            name="incidentStartDate"
            label="Incident Period Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.incidentStartDate || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="incidentEndDate"
            name="incidentEndDate"
            label="Incident Period End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.incidentEndDate || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormHelperText>
            You can find the Disaster Number and type from FEMA's disaster declaration. If you're unsure of the exact dates, check FEMA's website or the official disaster declaration notice you received.
          </FormHelperText>
        </Grid>
        
        {/* 2. Disaster Area */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Disaster Area</Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="countyNames"
            name="countyNames"
            label="County Name(s)"
            value={formData.countyNames || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            required
            fullWidth
            id="cityNames"
            name="cityNames"
            label="City Name(s)"
            value={formData.cityNames || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            id="tribalLandNames"
            name="tribalLandNames"
            label="Tribal Land Name(s)"
            value={formData.tribalLandNames || ''}
            onChange={handleChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormHelperText>
            Select all areas impacted by the disaster that are applying for aid. If you're unsure, list all areas that experienced significant damage.
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};

export default DisasterInfo;