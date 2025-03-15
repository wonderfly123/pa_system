import React, { useState } from 'react';
import { 
  Container, Grid, Paper, Typography, TextField, 
  Button, CircularProgress, Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import api from '../utils/api';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    disasterId: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For demo, using a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = '60d21b4667d0d8992e610c85';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData = {
        ...formData,
        user: userId,
        status: 'New',
      };

      const response = await api.createProject(projectData);
      navigate(`/projects/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Project
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Message severity="error">{error}</Message>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Project Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Disaster ID"
                    name="disasterId"
                    value={formData.disasterId}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Enter the FEMA Disaster Declaration Number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Project Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                      {loading ? 'Creating...' : 'Create Project'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewProject;