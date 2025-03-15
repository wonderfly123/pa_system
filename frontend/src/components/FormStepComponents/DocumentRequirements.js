// frontend/src/components/FormStepComponents/DocumentRequirements.js
import React, { useState } from 'react';
import { 
  Grid, Typography, Button, List, ListItem, 
  ListItemText, ListItemIcon, FormHelperText,
  Paper
} from '@mui/material';
import { 
  InsertDriveFile, Check, CloudUpload, CheckCircle,
  Warning
} from '@mui/icons-material';

const DocumentRequirements = ({ formData, handleChange, handleFileUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    projectWorksheets: [],
    costEstimates: [],
    mapsPlans: [],
    insuranceDocs: [],
    damagePhotos: [],
    otherDocs: []
  });
  
  const handleFileSelect = (e, docType) => {
    const files = Array.from(e.target.files);
    
    // In a real implementation, you would upload these files to your server
    // For this demo, we'll just update the local state
    setUploadedFiles({
      ...uploadedFiles,
      [docType]: [...uploadedFiles[docType], ...files]
    });
    
    // Call the parent handler if it exists
    if (handleFileUpload) {
      handleFileUpload(files, docType);
    }
  };
  
  const documentTypes = [
    { 
      id: 'projectWorksheets', 
      label: 'Project Worksheets (PWs)', 
      required: true 
    },
    { 
      id: 'costEstimates', 
      label: 'Cost Estimates', 
      required: true 
    },
    { 
      id: 'mapsPlans', 
      label: 'Maps or Site Plans', 
      required: false 
    },
    { 
      id: 'insuranceDocs', 
      label: 'Insurance Documentation (if applicable)', 
      required: formData.hasInsurance === 'yes' 
    },
    { 
      id: 'damagePhotos', 
      label: 'Photos of Damage', 
      required: true 
    },
    { 
      id: 'otherDocs', 
      label: 'Other (Specify)', 
      required: false 
    }
  ];
  
  return (
    <>
      <Typography variant="h6" gutterBottom>Documentation Requirements</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Required Documents (Upload Section)</Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <List>
              {documentTypes.map((docType) => (
                <ListItem key={docType.id}>
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText 
                    primary={docType.label}
                    secondary={docType.required ? 'Required' : 'Optional'} 
                  />
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    color={uploadedFiles[docType.id].length > 0 ? "success" : "primary"}
                  >
                    {uploadedFiles[docType.id].length > 0 ? 'Add More Files' : 'Upload Files'}
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => handleFileSelect(e, docType.id)}
                    />
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>Uploaded Files</Typography>
          
          {Object.keys(uploadedFiles).map((docType) => (
            uploadedFiles[docType].length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }} key={docType}>
                <Typography variant="subtitle2" gutterBottom>
                  {documentTypes.find(d => d.id === docType)?.label}
                </Typography>
                <List dense>
                  {uploadedFiles[docType].map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={file.name} 
                        secondary={`Size: ${(file.size / 1024).toFixed(2)} KB`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )
          ))}
          
          {Object.values(uploadedFiles).every(files => files.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No files uploaded yet. Please upload the required documents.
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <FormHelperText>
            Upload all required documents here. These documents support your application and show that the project is necessary, reasonable, and within FEMA's guidelines. Make sure each document is clear and legible.
          </FormHelperText>
        </Grid>
      </Grid>
    </>
  );
};

export default DocumentRequirements;