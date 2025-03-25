import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import NewProject from './pages/NewProject';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import MasterIntakeForm from './pages/MasterIntakeForm';
import FormGeneration from './pages/FormGeneration';
import theme from './theme';

// Import the PA Assistant Widget
import PAAssistantWidget from './components/PAAssistantWidget';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <main style={{ paddingTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/intake" element={<MasterIntakeForm />} />
            <Route path="/generate/:id" element={<FormGeneration />} />
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* PA Assistant Widget - will appear on all pages */}
        <PAAssistantWidget />
      </Router>
    </ThemeProvider>
  );
}

export default App;