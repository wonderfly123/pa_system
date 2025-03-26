// PAAssistantWidget.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  useTheme
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Remove';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import LaunchIcon from '@mui/icons-material/Launch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CompressIcon from '@mui/icons-material/Compress';

// For API requests
import axios from 'axios';

// Constants
// Updated to use port 5001 (matching your server port)
const API_URL = "http://localhost:5001/api/pa-assistant";
// Bearer token is handled by the backend proxy
const BEARER_TOKEN = "12345"; 

// For debugging - create a proxy URL using a CORS proxy service
const USE_CORS_PROXY = false; // Set to true if direct API call fails with CORS errors
const CORS_PROXY = "https://corsproxy.io/?"; 

// Add fallback logic to use mock response if API fails
const USE_FALLBACK = false; // Change to true if API is not working

const PAAssistantWidget = () => {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSampleQueries, setShowSampleQueries] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '👋 Hello! I\'m your FEMA Public Assistance guide. How can I help you today? You can ask me about application processes, funding eligibility, or documentation requirements.'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const widgetRef = useRef(null);

  // Sample queries
  const sampleQueries = [
    "What are the eligibility requirements for FEMA Public Assistance funding?",
    "How do I document damage for a successful claim?",
    "What is the timeline for receiving funds after approval?",
    "How do I determine if my project qualifies as emergency work?",
    "What documentation is required for reimbursement?"
  ];

  // Load saved position and visibility state from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('paWidgetPosition');
    const savedVisibility = localStorage.getItem('paWidgetVisible');
    const savedMinimized = localStorage.getItem('paWidgetMinimized');
    const savedExpanded = localStorage.getItem('paWidgetExpanded');
    const savedMessages = localStorage.getItem('paWidgetMessages');
    
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
    
    if (savedVisibility) {
      setIsVisible(savedVisibility === 'true');
    }
    
    if (savedMinimized) {
      setIsMinimized(savedMinimized === 'true');
    }
    
    if (savedExpanded) {
      setIsExpanded(savedExpanded === 'true');
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save position and visibility state to localStorage when they change
  useEffect(() => {
    localStorage.setItem('paWidgetPosition', JSON.stringify(position));
    localStorage.setItem('paWidgetVisible', isVisible.toString());
    localStorage.setItem('paWidgetMinimized', isMinimized.toString());
    localStorage.setItem('paWidgetExpanded', isExpanded.toString());
    localStorage.setItem('paWidgetMessages', JSON.stringify(messages));
  }, [position, isVisible, isMinimized, isExpanded, messages]);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep widget within viewport
  useEffect(() => {
    const handleResize = () => {
      if (widgetRef.current) {
        const { width, height } = widgetRef.current.getBoundingClientRect();
        const maxX = window.innerWidth - width;
        const maxY = window.innerHeight - height;
        
        setPosition(prev => ({
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        }));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse events for dragging
  const handleMouseDown = (e) => {
    if (isMinimized) return;
    
    const rect = widgetRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep widget within viewport
    const rect = widgetRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // Toggle widget visibility
  const toggleWidget = () => {
    setIsVisible(!isVisible);
    if (isMinimized && !isVisible) {
      setIsMinimized(false);
    }
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Toggle expanded state
  const toggleWidgetSize = () => {
    setIsExpanded(!isExpanded);
  };

  // Clear conversation
  const clearConversation = () => {
    // Keep the initial greeting message
    setMessages([messages[0]]);
  };

  // Close widget
  const closeWidget = () => {
    setIsVisible(false);
  };

  // Handle sample query click
  const handleSampleQueryClick = (query) => {
    setUserInput(query);
    setShowSampleQueries(false);
  };

  // Simple fallback message for API connection issues
  const getFallbackMessage = () => {
    return "I'm sorry, I'm currently unable to connect to the service. Please check your internet connection or try again later.";
  };
  
  // Store API test results in state
  const [apiTestResult, setApiTestResult] = useState("Waiting to test API...");
  
  // Test the API connection and log results
  useEffect(() => {
    // Only run the test when widget becomes visible
    if (!isVisible) return;
    
    const testApiConnection = async () => {
      try {
        setApiTestResult("Testing API connection...");
        console.log('🔍 TESTING API CONNECTION TO:', API_URL);
        
        const response = await axios.post(
          API_URL,
          { message: "test message" },
          {
            headers: {
              'Authorization': `Bearer ${BEARER_TOKEN}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: false
            // Removed timeout to avoid timeout errors
          }
        );
        
        console.log('✅ API TEST SUCCESSFUL:', response.status);
        console.log('RESPONSE DATA:', response.data);
        setApiTestResult(`API test successful! Status: ${response.status}`);
      } catch (error) {
        console.error('❌ API TEST FAILED:', error.message);
        if (error.response) {
          console.error('Error Response Status:', error.response.status);
          console.error('Error Response Data:', error.response.data);
          setApiTestResult(`API test failed! Status: ${error.response?.status}, Error: ${error.message}`);
        } else {
          console.error('Full error:', error);
          setApiTestResult(`API test failed! Error: ${error.message}`);
        }
      }
    };
    
    // Run the test after a short delay
    const timer = setTimeout(testApiConnection, 1000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  // Send message to API
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage = userInput.trim();
    setUserInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Set loading state
    setIsLoading(true);
    
    // Use fallback if enabled
    if (USE_FALLBACK) {
      // Simulate network delay for more realistic behavior
      setTimeout(() => {
        const fallbackMessage = getFallbackMessage();
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackMessage }]);
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    try {
      console.log('Attempting API request to:', API_URL);
      console.log('Request payload:', { message: userMessage });
      
      // Determine which URL to use (direct or CORS proxy)
      const requestURL = USE_CORS_PROXY ? CORS_PROXY + encodeURIComponent(API_URL) : API_URL;
      console.log('Using request URL:', requestURL);
      
      const response = await axios.post(
        requestURL,
        { message: userMessage },
        {
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: false
          // Removed timeout to avoid timeout errors
        }
      );
      
      // Process response
      let assistantMessage = '';
      const data = response.data;
      
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      console.log('API Response Data:', data); // Full response data
      
      // Handle different response structures
      if (Array.isArray(data) && data.length > 0) {
        console.log('Handling array response');
        assistantMessage = data[0].response || "I'm having trouble processing your request.";
      } else if (typeof data === 'object') {
        console.log('Handling object response');
        assistantMessage = data.response || data.message || data.result || JSON.stringify(data);
      } else {
        console.log('Handling string/other response type');
        assistantMessage = String(data);
      }
      
      console.log('Final message to display:', assistantMessage);
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('API Error occurred:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
        console.error('Error Response Data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error Request (no response received):', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      console.error('Error Config:', error.config);
      
      // Add detailed error message
      const errorDetails = error.response ? 
        `Status: ${error.response.status}, Message: ${error.response.data?.message || error.response.statusText}` : 
        error.message;
        
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error while connecting to the service: ${errorDetails}. Please try again later or contact support if the issue persists.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Typing indicator animation styles */}
      <style>{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        .typing-indicator .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          margin: 0 1px;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
      
      {/* Widget toggle button */}
      <IconButton
        aria-label="Open PA Assistant"
        onClick={toggleWidget}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          bgcolor: 'primary.main',
          color: '#fff',
          zIndex: 999,
          width: '60px',
          height: '60px',
          boxShadow: 4,
          '&:hover': {
            bgcolor: 'primary.dark',
          }
        }}
      >
        <ChatIcon fontSize="large" />
      </IconButton>
      
      {/* Widget container */}
      {isVisible && (
        <Paper
          ref={widgetRef}
          elevation={3}
          sx={{
            position: 'fixed',
            width: isMinimized ? 'auto' : (isExpanded ? '450px' : '320px'),
            height: isMinimized ? 'auto' : (isExpanded ? '600px' : '450px'),
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 1000,
            overflow: 'hidden',
            resize: isMinimized ? 'none' : 'both',
            minWidth: isMinimized ? 'auto' : '280px',
            minHeight: isMinimized ? 'auto' : '300px',
            maxWidth: '600px',
            maxHeight: '800px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '8px'
          }}
        >
          {/* Widget header */}
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              bgcolor: 'grey.100',
              padding: (theme) => theme.spacing(1, 2),
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                🏛️ PA System Assistant
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '8px', color: 'text.secondary' }}>
                {apiTestResult}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" onClick={clearConversation} title="Clear conversation">
                <DeleteSweepIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={toggleWidgetSize} title={isExpanded ? "Reduce size" : "Expand size"}>
                {isExpanded ? <CompressIcon fontSize="small" /> : <AspectRatioIcon fontSize="small" />}
              </IconButton>
              <IconButton size="small" onClick={toggleMinimize} title={isMinimized ? "Expand" : "Minimize"}>
                {isMinimized ? <LaunchIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
              </IconButton>
              <IconButton size="small" onClick={closeWidget} title="Close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* Widget body (hidden when minimized) */}
          {!isMinimized && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 48px)',
                padding: 2
              }}
            >
              {/* Chat messages */}
              <Box
                sx={{
                  flex: '1',
                  overflow: 'auto',
                  mb: 2,
                  pr: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      bgcolor: msg.role === 'user' ? 'grey.100' : 'primary.light',
                      color: msg.role === 'user' ? 'inherit' : 'primary.contrastText',
                      borderRadius: '4px',
                      padding: 1,
                      marginBottom: 1,
                      maxWidth: '80%'
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{msg.role === 'user' ? '👤 You:' : '🤖 Assistant:'}</strong> {msg.content}
                    </Typography>
                  </Box>
                ))}
                {isLoading && (
                  <Box
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: '4px',
                      padding: 1,
                      marginBottom: 1,
                      maxWidth: '80%'
                    }}
                  >
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <strong>🤖 Assistant:</strong>&nbsp;
                      <span className="typing-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                    </Typography>
                  </Box>
                )}
                <div ref={messageEndRef} />
              </Box>

              {/* Input area */}
              <Box sx={{ display: 'flex', gap: 1, position: 'relative' }}>
                <IconButton 
                  size="small" 
                  onClick={() => setShowSampleQueries(!showSampleQueries)}
                  sx={{ color: 'primary.main' }}
                  title="Sample questions"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
                
                {showSampleQueries && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      bottom: '60px',
                      left: '10px',
                      width: 'calc(100% - 20px)',
                      zIndex: 1001,
                      maxHeight: '200px',
                      overflow: 'auto',
                      p: 1
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                      Sample Questions:
                    </Typography>
                    {sampleQueries.map((query, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          p: 1, 
                          cursor: 'pointer', 
                          '&:hover': { bgcolor: 'grey.100' },
                          borderRadius: 1,
                          mb: 0.5
                        }}
                        onClick={() => handleSampleQueryClick(query)}
                      >
                        <Typography variant="body2">{query}</Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
                
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Ask about FEMA Public Assistance..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <IconButton
                  color="primary"
                  onClick={sendMessage}
                  disabled={!userInput.trim() || isLoading}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default PAAssistantWidget;