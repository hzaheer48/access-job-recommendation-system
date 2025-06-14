# PDF Parsing Troubleshooting Guide

## Overview

This guide helps resolve common issues when uploading PDF resumes for automatic parsing in the Access Job Recommendation System.

## Common Issues and Solutions

### 1. "Resume Parsed Successfully (Demo Mode)" Message

**Problem**: The system shows demo mode instead of parsing your actual PDF content.

**Causes**:
- Novita AI API key is not configured
- API key is invalid or expired

**Solutions**:
1. **Configure API Key**:
   - Copy `.env.example` to `.env.local`
   - Get your API key from [Novita AI](https://novita.ai/settings/key-management)
   - Add your key: `REACT_APP_NOVITA_API_KEY=your_actual_api_key`
   - Restart the development server

2. **Verify API Key**:
   - Ensure the key is valid and active
   - Check your Novita AI account for usage limits

### 2. "Unable to Extract Text" Errors

**Problem**: The system cannot read text from your PDF.

**Common Causes**:
- **Scanned PDFs**: Images of documents without text layer
- **Password-protected PDFs**: Encrypted files
- **Corrupted files**: Damaged or incomplete PDFs
- **Image-only PDFs**: Documents containing only images

**Solutions**:
1. **For Scanned PDFs**:
   - Use OCR software to convert to text-searchable PDF
   - Export as text file from your PDF viewer
   - Manually enter information

2. **For Password-protected PDFs**:
   - Remove password protection
   - Export as unprotected PDF
   - Use alternative file format (DOC, DOCX, TXT)

3. **For Image-only PDFs**:
   - Convert images to text using OCR
   - Recreate as text-based document
   - Manual data entry

### 3. File Type Issues

**Supported Formats**:
- ✅ PDF (text-based)
- ✅ DOC/DOCX (Microsoft Word)
- ✅ TXT (Plain text)

**Unsupported Formats**:
- ❌ Images (JPG, PNG, etc.)
- ❌ RTF files
- ❌ Pages files
- ❌ OpenDocument formats

### 4. File Size Limitations

**Maximum Size**: 5MB

**If your file is too large**:
- Compress the PDF
- Remove unnecessary images
- Split into smaller sections
- Convert to text format

## Best Practices for PDF Resumes

### 1. Create Text-Based PDFs
- Use word processors (Word, Google Docs)
- Export directly to PDF
- Avoid scanning paper documents

### 2. Use Standard Fonts
- Stick to common fonts (Arial, Times New Roman, Calibri)
- Avoid decorative or custom fonts
- Ensure text is selectable

### 3. Simple Formatting
- Use clear section headers
- Avoid complex layouts
- Minimize graphics and images
- Use standard resume structure

### 4. Test Your PDF
- Try selecting text in a PDF viewer
- Search for keywords in the document
- If you can't select text, the parser won't work

## Fallback Options

### 1. Alternative File Formats
- Export resume as Word document (.docx)
- Save as plain text (.txt)
- Copy and paste content

### 2. Manual Entry
- Use the profile form directly
- Copy sections from your resume
- Build profile step by step

### 3. Demo Mode
- System provides sample data
- Replace with your actual information
- Use as template for manual entry

## Technical Details

### PDF Parsing Method
The system uses a basic PDF text extraction approach that:
- Reads PDF binary data
- Extracts text objects from PDF structure
- Validates content for resume keywords
- Falls back to general text extraction

### Limitations
- Cannot process scanned images
- Limited support for complex layouts
- May miss text in unusual encodings
- Requires readable text layer

## Getting Help

### 1. Check Browser Console
- Open Developer Tools (F12)
- Look for error messages
- Note specific error details

### 2. Try Different Files
- Test with a simple text-based PDF
- Use a Word document instead
- Try plain text format

### 3. API Key Issues
- Verify key in `.env.local`
- Check Novita AI dashboard
- Ensure sufficient credits

## Error Messages Reference

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Demo Mode" | No API key | Configure Novita AI key |
| "Unable to extract sufficient text" | Scanned/image PDF | Use text-based PDF |
| "Failed to extract text from PDF" | Corrupted/protected PDF | Try different file |
| "File Too Large" | >5MB file | Compress or split file |
| "Invalid File Type" | Unsupported format | Use PDF/DOC/TXT |
| "AI service unavailable" | API error | Try again later |

## Contact Support

If you continue experiencing issues:
1. Note the exact error message
2. Check your file meets requirements
3. Verify API key configuration
4. Try manual entry as alternative

The system is designed to work with most standard resume PDFs, but manual entry is always available as a reliable fallback option.