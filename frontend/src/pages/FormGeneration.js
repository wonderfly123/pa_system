// src/pages/FormGeneration.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, Paper, Typography, Button, Box, Grid, 
  List, ListItem, ListItemIcon, ListItemText, CircularProgress 
} from '@mui/material';
import { Article, CheckCircle, Warning } from '@mui/icons-material';
import api from '../utils/api';

const FormGeneration = () => {
  const { id } = useParams();
  const [intakeForm, setIntakeForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await api.getIntakeForm(id);
        setIntakeForm(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load form data');
        setLoading(false);
      }
    };
    
    fetchForm();
  }, [id]);
  
  const handleGenerateForms = async () => {
    setGenerating(true);
    try {
      const { data } = await api.generateFemaForms(id);
      setIntakeForm(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate forms');
    }
    setGenerating(false);
  };
  
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!intakeForm) return <Typography>Form not found</Typography>;
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          FEMA Form Generation
        </Typography>
        <Typography variant="subtitle1" paragraph>
          Project: {intakeForm.projectName}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Validation Results
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Project Information Complete" 
                secondary="All required fields are filled out" 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Work Description Needs Detail" 
                secondary="Consider adding specific measurements and materials details" 
              />
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Forms to Generate
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Article sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1">Project Worksheet (PW)</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Article sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1">Request for Public Assistance (RPA)</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Article sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1">Damage Description (DDD)</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {intakeForm.generatedForms && intakeForm.generatedForms.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Generated Forms
            </Typography>
            <List>
              {intakeForm.generatedForms.map((form, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Article color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${form.formType} Form`} 
                    secondary={new Date(form.generatedDate).toLocaleString()} 
                  />
                  <Button variant="outlined" size="small">
                    Download
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerateForms}
              disabled={generating}
              startIcon={generating ? <CircularProgress size={20} /> : null}
            >
              {generating ? 'Generating...' : 'Generate FEMA Forms'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FormGeneration;