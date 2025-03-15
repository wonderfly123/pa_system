import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Button, 
  Tabs, Tab, Divider, Box, LinearProgress 
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import api from '../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await api.getProject(id);
        setProject(projectResponse.data);
        
        const documentsResponse = await api.getProjectDocuments(id);
        setDocuments(documentsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project data');
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', id);

    setUploadLoading(true);
    try {
      const response = await api.uploadDocument(formData);
      setDocuments([...documents, response.data]);
      
      // Update project metrics
      setProject({
        ...project,
        metrics: {
          ...project.metrics,
          totalDocuments: project.metrics.totalDocuments + 1
        }
      });
      
      setUploadLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document');
      setUploadLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) return <Loader />;
  if (error) return <Message severity="error">{error}</Message>;
  if (!project) return <Message severity="error">Project not found</Message>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            {project.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Disaster ID: {project.disasterId}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>Project Status</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Typography variant="body1">{project.status}</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary">Completion</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={project.metrics.completionPercentage} 
                    />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body1">
                      {project.metrics.completionPercentage}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary">Documents</Typography>
                <Typography variant="body1">
                  {project.metrics.processedDocuments} / {project.metrics.totalDocuments}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="body2" color="text.secondary">Forms</Typography>
                <Typography variant="body1">
                  {project.metrics.completedForms} / {project.metrics.pendingForms + project.metrics.completedForms}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Documents" />
              <Tab label="Q&A Process" />
              <Tab label="Forms" />
            </Tabs>
            
            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2 
                  }}>
                    <Typography variant="h6">Project Documents</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component="label"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? 'Uploading...' : 'Upload Document'}
                      <input
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                        disabled={uploadLoading}
                      />
                    </Button>
                  </Box>
                  
                  {uploadLoading && <LinearProgress sx={{ mb: 2 }} />}
                  
                  <Divider />
                  
                  {documents.length === 0 ? (
                    <Typography sx={{ padding: 2 }}>
                      No documents uploaded yet. Upload documents to get started.
                    </Typography>
                  ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {documents.map(doc => (
                        <Grid item xs={12} key={doc._id}>
                          <Paper sx={{ padding: 1.5 }}>
                            <Typography variant="body1">{doc.fileName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Type: {doc.documentType} | Status: {doc.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Uploaded: {new Date(doc.createdAt).toLocaleString()}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
              
              {activeTab === 1 && (
                <Typography>
                  The Q&A process functionality will be implemented in the next phase.
                </Typography>
              )}
              
              {activeTab === 2 && (
                <Typography>
                  The Forms functionality will be implemented in the next phase.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetail;