// frontend/src/components/FormStepComponents/SurveyPdaUpload.js
import React, { useState } from 'react';
import { 
  Grid, Typography, Button, Paper, Box, 
  CircularProgress, Alert, List, ListItem, 
  ListItemText, Divider, FormHelperText
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import api from '../../utils/api';

const SurveyPdaUpload = ({ formData, handleChange, updateFormData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProcessedData(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'pda'); // or 'survey123' based on selection

    try {
      const response = await api.processPDADocument(formData);
      setProcessedData(response.data.extractedData);
      
      // Update the main form with extracted data
      if (updateFormData && response.data.extractedData) {
        updateFormData(response.data.extractedData);
      }
    } catch (err) {
      console.error('Error processing document:', err);
      setError(err.response?.data?.message || 'Failed to process document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>Initial Survey123/PDA Upload</Typography>
      <Typography variant="subtitle2" color="text.secondary" paragraph>
        (Optional — Fast-Track Option)
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1" paragraph>
            AI will automatically extract key data from uploaded PDA or Survey123 form and pre-fill intake fields.
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              accept=".pdf,.csv,.xls,.xlsx"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                Upload PDA or Survey123 File (PDF, Excel, CSV)
              </Button>
            </label>
            
            {file && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <Typography variant="body2">
                  Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 1 }}
                >
                  {uploading ? 'Processing...' : 'Process Document'}
                </Button>
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {processedData && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
                  Document processed successfully! The form will be pre-filled with the extracted data.
                </Alert>
                
                <Typography variant="subtitle1" gutterBottom>
                  Extracted Information:
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                  <List dense>
                    {Object.entries(processedData).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <ListItem>
                          <ListItemText 
                            primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                            secondary={value} 
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
            
            <FormHelperText sx={{ mt: 2, textAlign: 'center' }}>
              AI checks for missing/unclear fields and generates follow-up questions automatically.
            </FormHelperText>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default SurveyPdaUpload;