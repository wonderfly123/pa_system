// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText, Divider, 
  FormControl, InputLabel, Select, MenuItem, Button, Chip,
  Card, CardContent, CardActions, Snackbar, Alert, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Check, Warning, Error, Info, Assignment, Delete as DeleteIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import api from '../utils/api';

const Dashboard = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('Damage Assessment');
  const [phaseCompletion, setPhaseCompletion] = useState(65);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [openAlert, setOpenAlert] = useState(false);
  
  // Dummy funding data - would come from API in production
  const fundingData = [
    { month: 'FEB', amount: 0 },
    { month: 'MAR', amount: 10000 },
    { month: 'APR', amount: 25000 },
    { month: 'MAY', amount: 22000 },
    { month: 'JUN', amount: 30000 },
    { month: 'JUL', amount: 35000 },
  ];
  
  // Dummy alerts - would come from API in production
  const actionAlerts = [
    { id: 1, type: 'success', text: 'Packet Ready for Approval & Submission', priority: 'low' },
    { id: 2, type: 'error', text: 'Project Worksheet Denied', priority: 'high' },
    { id: 3, type: 'warning', text: 'Incomplete Scope of Work', priority: 'medium' },
    { id: 4, type: 'info', text: 'Missing Labor Cost Justification', priority: 'medium' },
  ];

  // Project Worksheet summary data
  const pwSummary = {
    submitted: 5,
    approved: 3,
    denied: 1,
    pending: 1,
    successRate: 75
  };

  // AI recommendations
  const aiRecommendations = [
    { id: 1, text: 'Missing insurance documentation' },
    { id: 2, text: 'Cost estimate exceeds guidelines' },
    { id: 3, text: 'Missing permits for environmental review' },
  ];

  // For demo, using a hardcoded user ID
  const userId = '60d21b4667d0d8992e610c85';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.getUserProjects(userId);
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProjectToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await api.deleteProject(projectToDelete);
      
      // Update the local state to remove the deleted project
      setProjects(projects.filter(project => project._id !== projectToDelete));
      
      // Show success message
      setAlertMessage('Project deleted successfully');
      setAlertSeverity('success');
      setOpenAlert(true);
    } catch (error) {
      console.error('Error deleting project:', error);
      setAlertMessage('Failed to delete project');
      setAlertSeverity('error');
      setOpenAlert(true);
    }

    setOpenDeleteDialog(false);
    setProjectToDelete(null);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <Check sx={{ color: 'success.main' }} />;
      case 'warning': return <Warning sx={{ color: 'warning.main' }} />;
      case 'error': return <Error sx={{ color: 'error.main' }} />;
      case 'info': default: return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handlePhaseChange = (event) => {
    setCurrentPhase(event.target.value);
  };

  if (loading) return <Loader />;

  return (
    <Container maxWidth="lg">
      {location.state?.message && (
        <Message severity={location.state.severity || 'info'}>
          {location.state.message}
        </Message>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            FEMA Public Assistance Dashboard
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Message severity="error">{error}</Message>
          </Grid>
        )}

        {/* Overall PA Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200 }}>
            <Typography variant="h6" gutterBottom>
              Overall PA Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={phaseCompletion} size={100} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.secondary">
                    {phaseCompletion}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body1" align="center">
              Current Phase: <strong>{currentPhase}</strong>
            </Typography>
          </Paper>
        </Grid>

        {/* Action Alerts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Action Alerts - Fixing Compliance Issues
            </Typography>
            <List dense>
              {actionAlerts.map((alert) => (
                <ListItem key={alert.id} button>
                  <ListItemIcon>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={alert.text} 
                    secondary={
                      <Chip 
                        size="small" 
                        label={alert.priority} 
                        color={getPriorityColor(alert.priority)} 
                        variant="outlined" 
                      />
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Project Worksheet (PW) Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Project Worksheet (PW) Status
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h5">{pwSummary.submitted}</Typography>
                  <Typography variant="body2">Total PWs</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="h5">{pwSummary.approved}</Typography>
                  <Typography variant="body2">Approved</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography variant="h5">{pwSummary.denied}</Typography>
                  <Typography variant="body2">Denied</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="h5">{pwSummary.pending}</Typography>
                  <Typography variant="body2">Pending</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2">PW Success Rate</Typography>
              <Typography variant="h6" color={pwSummary.successRate > 70 ? 'success.main' : 'warning.main'}>
                {pwSummary.successRate}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* AI-Powered Insights */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Insights
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Top 3 AI Recommendations:
            </Typography>
            <List dense>
              {aiRecommendations.map((rec, index) => (
                <ListItem key={rec.id}>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={rec.text} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="subtitle2">Approval Probability:</Typography>
              <Chip 
                label="68%" 
                color="warning" 
                variant="outlined" 
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Funding Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Funding Status
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Total Approved:</Typography>
              <Typography variant="body1" fontWeight="bold">$250,000</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Total Obligated:</Typography>
              <Typography variant="body1" fontWeight="bold">$125,000</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2">Total Pending:</Typography>
              <Typography variant="body1" fontWeight="bold">$125,000</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Funding Trend (Last 6 months)
            </Typography>
            <Box sx={{ height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={fundingData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Projects List */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              Your Projects
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/intake"
              startIcon={<Assignment />}
            >
              NEW APPLICATION
            </Button>
          </Box>

          <Grid container spacing={3}>
            {projects.length === 0 ? (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography>
                    You don't have any projects yet. Create your first project to get started.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              projects.map((project) => (
                <Grid item xs={12} md={4} key={project._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {project.projectName || 'Unnamed Project'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Disaster ID: {project.disasterId || 'N/A'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" gutterBottom>
                        Status: {project.status || 'New'}
                      </Typography>
                      <Typography variant="body2">
                        Estimated Cost: ${project.estimatedCost || 0}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Box>
                        <Button size="small" component={Link} to={`/projects/${project._id}`}>
                          VIEW DETAILS
                        </Button>
                        <Button 
                          size="small" 
                          component={Link} 
                          to={`/projects/${project._id}/forms`}
                          color="secondary"
                        >
                          VIEW FORMS
                        </Button>
                      </Box>
                      <IconButton 
                        aria-label="delete project"
                        color="error"
                        onClick={() => handleDeleteClick(project._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Project Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar 
        open={openAlert} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;