# Novita AI Integration for Resume Parsing

This document explains how the Access Job Recommendation System integrates with Novita AI's LLM API to provide intelligent resume parsing capabilities.

## Overview

The resume parsing feature has been enhanced to use Novita AI's powerful language models for extracting structured data from uploaded resume files. This integration provides more accurate and intelligent parsing compared to traditional rule-based approaches.

## Features

### 🤖 AI-Powered Parsing
- Uses Novita AI's `meta-llama/llama-3.1-8b-instruct` model
- Extracts skills, work experience, education, and professional summary
- Handles various resume formats and layouts intelligently
- Provides structured JSON output for seamless integration

### 🔄 Smart Fallback System
- Automatically falls back to mock data when API key is not configured
- Maintains full functionality in development and demo environments
- Clear user feedback about which parsing method is being used

### 📁 File Support
- **Supported Formats**: PDF, DOC, DOCX, TXT
- **File Size Limit**: 5MB maximum
- **Text Extraction**: Basic text extraction with plans for enhanced parsing

## Setup Instructions

### 1. Get Novita AI API Key

1. Visit [Novita AI](https://novita.ai/settings/key-management)
2. Create an account or sign in
3. Navigate to API Key Management
4. Generate a new API key
5. Copy the API key for configuration

### 2. Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key to `.env.local`:
   ```env
   REACT_APP_NOVITA_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm start
   ```

## Technical Implementation

### API Service (`src/services/novitaAI.ts`)

The integration consists of three main functions:

#### `parseResumeWithAI(resumeText: string)`
- Sends resume text to Novita AI's chat completion endpoint
- Uses a carefully crafted prompt for structured data extraction
- Returns parsed data in the required format
- Includes comprehensive error handling

#### `extractTextFromFile(file: File)`
- Extracts text content from uploaded files
- Currently supports basic text extraction
- Can be enhanced with specialized libraries for better PDF/DOC parsing

#### `parseResumeFile(file: File)`
- Complete workflow combining text extraction and AI parsing
- Handles the entire process from file upload to structured data

### Component Integration (`src/components/shared/ResumeParser.tsx`)

The ResumeParser component has been updated to:
- Check for API key availability
- Use AI parsing when configured
- Fall back to mock data when not configured
- Provide appropriate user feedback
- Handle various error scenarios gracefully

## Usage Examples

### With API Key Configured
```typescript
// When REACT_APP_NOVITA_API_KEY is set
// The component will use real AI parsing
const resumeData = await parseResumeFile(uploadedFile);
// Returns: { skills, experience, education, summary }
```

### Without API Key (Demo Mode)
```typescript
// When REACT_APP_NOVITA_API_KEY is not set
// The component falls back to mock data
const resumeData = getMockResumeData(fileName);
// Returns: Mock data based on filename patterns
```

## Data Structure

The AI parsing returns data in this structure:

```typescript
interface ResumeParseResult {
  skills: string[];                    // Extracted technical and soft skills
  experience: Experience[];            // Work history with details
  education: Education[];              // Educational background
  summary: string;                     // Professional summary
}

interface Experience {
  id: string;                         // Unique identifier
  company: string;                    // Company name
  position: string;                   // Job title
  description: string;                // Job description
  startDate: string;                  // ISO date format
  endDate: string | null;             // ISO date or null for current
  location: string;                   // Work location
  skills: string[];                   // Skills used in this role
}

interface Education {
  id: string;                         // Unique identifier
  institution: string;                // School/University name
  degree: string;                     // Degree type
  fieldOfStudy: string;               // Field of study
  startDate: string;                  // ISO date format
  endDate: string;                    // ISO date format
  gpa?: number;                       // Optional GPA
}
```

## Error Handling

The integration includes comprehensive error handling:

### API Configuration Errors
- Missing API key detection
- Clear user guidance for setup
- Graceful fallback to demo mode

### File Processing Errors
- Invalid file type validation
- File size limit enforcement
- Text extraction failure handling

### AI Service Errors
- Network connectivity issues
- API rate limiting
- Invalid response handling
- JSON parsing errors

## Security Considerations

### API Key Management
- API keys are stored in environment variables
- Never committed to version control
- Client-side configuration for development
- Server-side configuration recommended for production

### Data Privacy
- Resume content is sent to Novita AI for processing
- Consider data privacy implications
- Implement user consent mechanisms if required
- Review Novita AI's privacy policy

## Performance Optimization

### Current Implementation
- Low temperature (0.1) for consistent parsing
- 2048 token limit for comprehensive extraction
- Basic text extraction for file processing

### Future Enhancements
- Implement proper PDF parsing with libraries like `pdf-parse`
- Add Word document parsing with `mammoth`
- Implement caching for repeated parsing requests
- Add batch processing capabilities

## Monitoring and Analytics

### Success Metrics
- Track parsing success rates
- Monitor API response times
- Measure user satisfaction with extracted data

### Error Tracking
- Log API failures and error types
- Monitor file processing issues
- Track fallback usage patterns

## Development Guidelines

### Testing
- Test with various resume formats
- Verify fallback behavior
- Test error scenarios
- Validate data structure compliance

### Code Quality
- Follow TypeScript best practices
- Implement proper error boundaries
- Add comprehensive logging
- Document API interactions

## Troubleshooting

### Common Issues

1. **"API key is not configured" Error**
   - Ensure `.env.local` file exists
   - Verify API key is correctly set
   - Restart development server

2. **"Unable to extract sufficient text" Error**
   - Check file format compatibility
   - Ensure file contains readable text
   - Try converting to TXT format

3. **"AI service is temporarily unavailable" Error**
   - Check internet connectivity
   - Verify Novita AI service status
   - Check API key validity

### Debug Mode

Enable debug logging by checking browser console:
```javascript
// Look for these log messages:
console.warn('Novita AI API key not configured, falling back to mock data');
console.error('Resume parsing error:', error);
```

## Future Roadmap

### Short Term
- Enhanced file parsing with specialized libraries
- Improved error messages and user guidance
- Better text extraction for complex documents

### Medium Term
- Batch processing capabilities
- Resume quality scoring
- Multi-language support

### Long Term
- Custom model fine-tuning
- Advanced resume analytics
- Integration with other AI services

## Support

For issues related to:
- **Novita AI API**: Contact [Novita AI Support](https://novita.ai/support)
- **Integration Issues**: Check the troubleshooting section above
- **Feature Requests**: Submit through the project's issue tracker

---

*This integration enhances the Access Job Recommendation System with cutting-edge AI capabilities while maintaining backward compatibility and user-friendly fallback options.*