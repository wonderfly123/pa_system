import React from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              404 - Page Not Found
            </Typography>
            <Typography variant="body1" paragraph>
              The page you are looking for does not exist.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/"
            >
              Go to Dashboard
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;