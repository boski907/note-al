const fs = require('fs');
const path = require('path');

/**
 * Parse a file and return its text content.
 * Supports PDF, DOCX, TXT, MD.
 */
async function parseFile(filePath, mimeType, originalName) {
  const ext = path.extname(originalName).toLowerCase().replace('.', '');

  try {
    if (ext === 'pdf') {
      return await parsePDF(filePath);
    } else if (ext === 'docx') {
      return await parseDOCX(filePath);
    } else if (['txt', 'md', 'csv', 'json'].includes(ext)) {
      return fs.readFileSync(filePath, 'utf8');
    } else {
      // Attempt to read as plain text
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch {
        return `[Binary file: ${originalName}]`;
      }
    }
  } catch (err) {
    console.error('Parse error:', err.message);
    return `[Could not parse file: ${originalName}. Error: ${err.message}]`;
  }
}

async function parsePDF(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || '[PDF contained no extractable text]';
}

async function parseDOCX(filePath) {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '[DOCX contained no extractable text]';
}

/**
 * Truncate content to a max character length (for LLM context window).
 * Keeps first N chars, adds a note if truncated.
 */
function truncate(text, maxChars = 80000) {
  if (!text || text.length <= maxChars) return text;
  return text.slice(0, maxChars) + `\n\n[Content truncated at ${maxChars} characters]`;
}

/**
 * Generate a short summary (first 300 non-whitespace chars).
 */
function makeSummary(content, maxLen = 300) {
  if (!content) return '';
  const clean = content.replace(/\s+/g, ' ').trim();
  return clean.length <= maxLen ? clean : clean.slice(0, maxLen) + '…';
}

module.exports = { parseFile, truncate, makeSummary };
