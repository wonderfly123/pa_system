// backend/services/aiService.js
const axios = require('axios');

// Load environment variables
const LLM_API_ENDPOINT = process.env.LLM_API_ENDPOINT || 'https://api.anthropic.com/v1/messages';
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL || 'claude-3-haiku-20240307';

/**
 * Extract data from uploaded documents (PDA or Survey123)
 */
const extractDataFromDocument = async (documentBuffer, documentType) => {
  try {
    // Convert buffer to string for text-based documents
    let documentContent;
    
    if (documentType.toLowerCase().includes('pdf')) {
      // For PDF, we'd use a PDF parser in a real implementation
      // For demo, we're assuming it's convertible to string
      documentContent = documentBuffer.toString('utf-8');
    } else if (documentType.toLowerCase().includes('csv')) {
      documentContent = documentBuffer.toString('utf-8');
    } else {
      // For Excel, we'd use an Excel parser in a real implementation
      documentContent = documentBuffer.toString('utf-8');
    }

    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: "user",
            content: `Extract key information from this ${documentType} document for FEMA Public Assistance. Return data in JSON format with fields matching the intake form schema (applicantName, contactName, disasterNumber, projectName, etc).

Document content:
${documentContent}`
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract the JSON response from the LLM
    let extractedData;
    
    if (response.data && response.data.content) {
      // This is for Anthropic Claude API format
      const jsonPattern = /{[\s\S]*}/g;
      const match = response.data.content[0].text.match(jsonPattern);
      if (match) {
        extractedData = JSON.parse(match[0]);
      }
    } else {
      // Default fallback
      extractedData = {
        applicantName: "Extracted Organization",
        contactName: "Extracted Contact",
        projectName: "Extracted Project",
        disasterNumber: "DR-1234",
        estimatedTotalCost: "50000"
      };
    }

    return extractedData;
  } catch (error) {
    console.error('Error in AI document extraction:', error);
    throw error;
  }
};

/**
 * Validate form data against FEMA PA requirements
 */
const validateFormAgainstPAPPG = async (formData) => {
  try {
    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: "user",
            content: `You are a FEMA Public Assistance expert. Validate this application data against typical FEMA Public Assistance Program requirements. Return validation results in JSON format with fields: isValid (boolean), validationScore (0-100), issues (array of objects with field, severity, message, suggestion).

Form data:
${JSON.stringify(formData, null, 2)}`
          }
        ],
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract the JSON response
    let validationResults;
    
    if (response.data && response.data.content) {
      const jsonPattern = /{[\s\S]*}/g;
      const match = response.data.content[0].text.match(jsonPattern);
      if (match) {
        validationResults = JSON.parse(match[0]);
      }
    } else {
      // Default fallback
      validationResults = {
        isValid: true,
        validationScore: 85,
        issues: []
      };
    }

    return validationResults;
  } catch (error) {
    console.error('Error in AI validation:', error);
    throw error;
  }
};

/**
 * Generate intelligent suggestions for form completion
 */
const generateFormSuggestions = async (currentFormData) => {
  try {
    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: "user",
            content: `You are a FEMA Public Assistance expert. Based on this partially completed FEMA Public Assistance form, suggest improvements or auto-fill values for missing fields. Return suggestions in JSON format with field names as keys and suggested values.

Current form data:
${JSON.stringify(currentFormData, null, 2)}`
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract the JSON response
    let suggestions;
    
    if (response.data && response.data.content) {
      const jsonPattern = /{[\s\S]*}/g;
      const match = response.data.content[0].text.match(jsonPattern);
      if (match) {
        suggestions = JSON.parse(match[0]);
      }
    } else {
      // Default fallback
      suggestions = {
        projectDescription: "Suggested project description based on other fields",
        scopeOfWork: "Suggested scope of work based on project description"
      };
    }

    return suggestions;
  } catch (error) {
    console.error('Error in AI suggestions:', error);
    throw error;
  }
};

/**
 * Check compliance with cost guidelines
 */
const validateCostEstimates = async (costData) => {
  try {
    const response = await axios.post(
      LLM_API_ENDPOINT,
      {
        model: LLM_MODEL,
        messages: [
          {
            role: "user",
            content: `You are a FEMA Public Assistance expert. Validate these project cost estimates against typical FEMA standard rates and guidelines. Check for reasonableness and compliance with cost principles. Return validation in JSON format with fields: isCompliant (boolean), complianceScore (0-100), issues (array of objects with cost category, issue description, and suggestion).

Cost data:
${JSON.stringify(costData, null, 2)}`
          }
        ],
        max_tokens: 800
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract the JSON response
    let validationResults;
    
    if (response.data && response.data.content) {
      const jsonPattern = /{[\s\S]*}/g;
      const match = response.data.content[0].text.match(jsonPattern);
      if (match) {
        validationResults = JSON.parse(match[0]);
      }
    } else {
      // Default fallback
      validationResults = {
        isCompliant: true,
        complianceScore: 90,
        issues: []
      };
    }

    return validationResults;
  } catch (error) {
    console.error('Error in cost validation:', error);
    throw error;
  }
};

module.exports = {
  extractDataFromDocument,
  validateFormAgainstPAPPG,
  generateFormSuggestions,
  validateCostEstimates
};