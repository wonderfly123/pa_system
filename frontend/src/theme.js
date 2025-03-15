// Create a new file src/theme.js
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50', // Green for "Packet Ready"
    },
    warning: {
      main: '#ff9800', // Orange for "Incomplete" 
    },
    error: {
      main: '#f44336', // Red for "Denied"
    },
    info: {
      main: '#2196f3', // Blue for "Missing"
    },
  },
});

export default theme;