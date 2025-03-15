import React from 'react';
import { Card, CardContent, Typography, Button, LinearProgress, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {project.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Disaster ID: {project.disasterId}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {project.description}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Status: {project.status}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={project.metrics.completionPercentage} 
            />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">
              {project.metrics.completionPercentage}%
            </Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={RouterLink} 
          to={`/projects/${project._id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;