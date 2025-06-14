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
 * Truncate text to fit within token limits
 * Very conservative estimation: 1 token ≈ 2.5 characters (extra safe)
 * @param text - Text to truncate
 * @param maxTokens - Maximum number of tokens allowed
 * @returns Truncated text
 */
const truncateTextForTokenLimit = (text: string, maxTokens: number): string => {
  // Very conservative estimation: 1 token ≈ 2.5 characters (extra safe)
  const maxChars = Math.floor(maxTokens * 2.5);
  
  if (text.length <= maxChars) {
    return text;
  }
  
  // Try to truncate at word boundaries
  const truncated = text.substring(0, maxChars);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxChars * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * Parse resume content using Novita AI's LLM API
 * @param resumeText - The extracted text content from the resume file
 * @returns Parsed resume data
 */
export const parseResumeWithAI = async (resumeText: string): Promise<ResumeParseResult> => {
  if (!NOVITA_API_KEY) {
    throw new Error('Novita AI API key is not configured. Please set REACT_APP_NOVITA_API_KEY environment variable.');
  }

  // Model context limit is 16,384 tokens
  // Reserve tokens for: system message (~50), prompt template (~500), response (2048)
  // Available for resume text: ~8,000 tokens (very conservative to prevent errors)
  const maxResumeTokens = 8000;
  const truncatedResumeText = truncateTextForTokenLimit(resumeText, maxResumeTokens);
  
  const prompt = `IMPORTANT: Return ONLY valid JSON, no explanations or code.

Extract this exact JSON structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [{
    "id": "exp_1",
    "company": "Company Name",
    "position": "Job Title",
    "description": "Job description",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD or null",
    "location": "City, State",
    "skills": ["relevant skills"]
  }],
  "education": [{
    "id": "edu_1",
    "institution": "School Name",
    "degree": "Degree Type",
    "fieldOfStudy": "Field",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "gpa": "GPA (optional)"
  }],
  "summary": "Professional summary"
}

Rules:
- Extract all skills from resume
- Use "exp_" prefix for experience IDs
- Use "edu_" prefix for education IDs
- ISO dates (YYYY-MM-DD)
- null for current positions
- NO explanations, NO code, ONLY JSON

Resume text:
${truncatedResumeText}`;

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
            content: 'You must respond with valid JSON only. No explanations, no code, no text - just JSON.'
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
 * Extract text content from PDF using basic parsing
 * @param arrayBuffer - PDF file as ArrayBuffer
 * @returns Extracted text content
 */
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to string and look for text content
    let text = '';
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const pdfString = decoder.decode(uint8Array);
    
    // Basic PDF text extraction - look for text between stream objects
    // This is a simplified approach and may not work for all PDFs
    const textRegex = /BT[\s\S]*?ET/g;
    const matches = pdfString.match(textRegex);
    
    if (matches) {
      matches.forEach(match => {
        // Extract text from PDF text objects
        const textContent = match.replace(/BT|ET|Tf|Td|TJ|Tj|'|"|\[|\]|\(|\)/g, ' ')
          .replace(/[\d\.]+\s+[\d\.]+\s+[\d\.]+\s+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        text += textContent + ' ';
      });
    }
    
    // Fallback: try to extract any readable text
    if (text.length < 50) {
      const fallbackText = pdfString.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Look for common resume keywords to validate content
      const resumeKeywords = ['experience', 'education', 'skills', 'work', 'university', 'college', 'job', 'position', 'company'];
      const hasResumeContent = resumeKeywords.some(keyword => 
        fallbackText.toLowerCase().includes(keyword)
      );
      
      if (hasResumeContent && fallbackText.length > 100) {
        text = fallbackText;
      }
    }
    
    return text.trim();
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to extract text from PDF file');
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
    
    reader.onload = async (event) => {
      const result = event.target?.result;
      
      try {
        let textContent = '';
        
        if (file.type === 'text/plain') {
          // Handle plain text files
          if (typeof result === 'string') {
            textContent = result;
          } else {
            reject(new Error('Failed to read text file'));
            return;
          }
        } else if (file.type === 'application/pdf') {
          // Handle PDF files
          if (result instanceof ArrayBuffer) {
            textContent = await extractTextFromPDF(result);
          } else {
            reject(new Error('Failed to read PDF file'));
            return;
          }
        } else if (file.type.includes('word') || file.type.includes('document')) {
          // Handle Word documents (basic approach)
          if (result instanceof ArrayBuffer) {
            const decoder = new TextDecoder('utf-8', { fatal: false });
            const docString = decoder.decode(new Uint8Array(result));
            textContent = docString.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          } else {
            reject(new Error('Failed to read document file'));
            return;
          }
        } else {
          reject(new Error(`Unsupported file type: ${file.type}`));
          return;
        }
        
        // Validate extracted content
        if (textContent.length < 50) {
          reject(new Error('Unable to extract sufficient text from file. The file may be empty, corrupted, or in an unsupported format. Please try a different file or enter information manually.'));
          return;
        }
        
        // Clean up the text
        const cleanedText = textContent.replace(/\s+/g, ' ').trim();
        resolve(cleanedText);
        
      } catch (error) {
        console.error('Text extraction error:', error);
        reject(new Error('Failed to extract text from file. Please try a different file format or enter information manually.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // Read file based on type
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};

/**
 * Complete resume parsing workflow using AI
 * @param file - The uploaded resume file
 * @returns Parsed resume data
 */
export const parseResumeWithNovitaAI = async (file: File): Promise<ResumeParseResult> => {
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