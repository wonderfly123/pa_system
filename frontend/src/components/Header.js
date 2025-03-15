import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const TitleLink = styled(RouterLink)({
  color: 'white',
  textDecoration: 'none',
  flexGrow: 1,
});

const Header = () => {
  return (
    <AppBar position="static">
      <Container>
        <StyledToolbar>
          <Typography variant="h6" component="div">
            <TitleLink to="/">
              FEMA PA Assistant
            </TitleLink>
          </Typography>
          <div>
            <Button color="inherit" component={RouterLink} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={RouterLink} to="/intake">
              New Application
            </Button>
            <Button color="inherit" component={RouterLink} to="/projects">
              Projects
            </Button>
          </div>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Header;