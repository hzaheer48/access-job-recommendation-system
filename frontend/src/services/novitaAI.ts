import { Experience, Education } from '../types';

// Novita AI API configuration
const NOVITA_API_BASE_URL = 'https://api.novita.ai/v3/openai';
const NOVITA_API_KEY = process.env.REACT_APP_NOVITA_API_KEY || '';

interface ResumeParseResult {
  skills: string[];
  experience: Experience[];
  education: Education[];
  summary: string;
}

/**
 * Parse resume content using Novita AI's LLM API
 * @param resumeText - The extracted text content from the resume file
 * @returns Parsed resume data
 */
export const parseResumeWithAI = async (resumeText: string): Promise<ResumeParseResult> => {
  if (!NOVITA_API_KEY) {
    throw new Error('Novita AI API key is not configured. Please set REACT_APP_NOVITA_API_KEY environment variable.');
  }

  const prompt = `
You are a professional resume parser. Extract the following information from the resume text and return it as a valid JSON object with this exact structure:

{
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "id": "exp_1",
      "company": "Company Name",
      "position": "Job Title",
      "description": "Job description",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null for current",
      "location": "City, State/Country",
      "skills": ["relevant skills for this role"]
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "institution": "School Name",
      "degree": "Degree Type",
      "fieldOfStudy": "Field of Study",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "gpa": "GPA if mentioned (optional)"
    }
  ],
  "summary": "Professional summary or objective"
}

Important guidelines:
- Extract all technical and soft skills mentioned
- For experience, create unique IDs starting with "exp_"
- For education, create unique IDs starting with "edu_"
- Use ISO date format (YYYY-MM-DD) for dates
- If end date is current/present, use null
- Include location information when available
- Extract relevant skills for each work experience
- Create a concise professional summary
- Return only valid JSON, no additional text

Resume text:
${resumeText}`;

  try {
    const response = await fetch(`${NOVITA_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NOVITA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume parser that extracts structured data from resume text. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.1 // Low temperature for consistent parsing
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Novita AI API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from Novita AI API');
    }

    // Parse the JSON response
    try {
      const parsedData = JSON.parse(content);
      
      // Validate the structure
      if (!parsedData.skills || !Array.isArray(parsedData.skills)) {
        throw new Error('Invalid skills format in AI response');
      }
      if (!parsedData.experience || !Array.isArray(parsedData.experience)) {
        throw new Error('Invalid experience format in AI response');
      }
      if (!parsedData.education || !Array.isArray(parsedData.education)) {
        throw new Error('Invalid education format in AI response');
      }
      if (!parsedData.summary || typeof parsedData.summary !== 'string') {
        throw new Error('Invalid summary format in AI response');
      }

      return parsedData as ResumeParseResult;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      throw new Error('Invalid JSON response from AI service');
    }

  } catch (error) {
    console.error('Novita AI API error:', error);
    throw error;
  }
};

/**
 * Extract text content from uploaded file
 * @param file - The uploaded resume file
 * @returns Extracted text content
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        // For text files, return content directly
        if (file.type === 'text/plain') {
          resolve(result);
          return;
        }
        
        // For other file types, we'll need a more sophisticated approach
        // For now, we'll extract basic text content
        // In a real implementation, you'd use libraries like pdf-parse for PDFs
        // or mammoth for Word documents
        
        // Simple text extraction (this is a basic implementation)
        // You should replace this with proper file parsing libraries
        const textContent = result.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (textContent.length < 50) {
          reject(new Error('Unable to extract sufficient text from file. Please ensure the file contains readable text.'));
          return;
        }
        
        resolve(textContent);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read file as text
    reader.readAsText(file);
  });
};

/**
 * Complete resume parsing workflow
 * @param file - The uploaded resume file
 * @returns Parsed resume data
 */
export const parseResumeFile = async (file: File): Promise<ResumeParseResult> => {
  try {
    // Step 1: Extract text from file
    const textContent = await extractTextFromFile(file);
    
    // Step 2: Parse with AI
    const parsedData = await parseResumeWithAI(textContent);
    
    return parsedData;
  } catch (error) {
    console.error('Resume parsing failed:', error);
    throw error;
  }
};