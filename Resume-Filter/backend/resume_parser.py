#!/usr/bin/env python3
"""
AI-Powered Resume Parser with Enhanced Name, Phone, Education, and Location Extraction
"""

import os
import re
import json
import logging
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
import tempfile

# Web framework
from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Document processing
import fitz  # PyMuPDF for PDF processing
from docx import Document
import pandas as pd

# AI and NLP
import openai
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Vector database (using FAISS for simplicity)
import faiss

# Excel export
import openpyxl
from openpyxl.styles import Font, Alignment, PatternFill

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'doc'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize AI models
try:
    # Load sentence transformer for semantic search
    semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Sentence transformer model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load sentence transformer: {e}")
    semantic_model = None

# Vector database setup
vector_db = None
resume_texts = []
resume_embeddings = []

class ResumeParser:
    """Main class for parsing resumes using AI and semantic search"""
    
    def __init__(self):
        self.skills_patterns = [
            r'\b(?:Python|Java|JavaScript|C\+\+|C#|PHP|Ruby|Go|Rust|Swift|Kotlin|Scala|R|MATLAB|SQL|HTML|CSS|React|Angular|Vue|Node\.js|Django|Flask|Spring|Laravel|Bootstrap|jQuery|MongoDB|MySQL|PostgreSQL|SQLite|Redis|Docker|Kubernetes|AWS|Azure|GCP|Git|Jenkins|Terraform|Ansible|Linux|Windows|MacOS)\b',
            r'\b(?:Machine Learning|AI|Artificial Intelligence|Data Science|Deep Learning|Neural Networks|TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy|Matplotlib|Seaborn|Tableau|Power BI|Excel|Word|PowerPoint|Photoshop|Illustrator|InDesign|Figma|Sketch)\b'
        ]
        
        self.experience_patterns = [
            r'(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)',
            r'(?:experience|exp)\s*(?:of\s*)?(\d+(?:\.\d+)?)\s*(?:years?|yrs?)',
            r'(\d+)\+?\s*(?:years?|yrs?)',
            r'over\s*(\d+)\s*(?:years?|yrs?)',
            r'more\s*than\s*(\d+)\s*(?:years?|yrs?)'
        ]

        # Common non-name words to filter out
        self.non_name_words = {
            'resume', 'cv', 'curriculum', 'vitae', 'profile', 'summary', 'objective',
            'contact', 'information', 'details', 'about', 'me', 'personal', 'data',
            'phone', 'email', 'address', 'location', 'city', 'state', 'country',
            'education', 'experience', 'skills', 'projects', 'achievements', 'awards',
            'references', 'hobbies', 'interests', 'languages', 'certifications',
            'professional', 'career', 'work', 'employment', 'job', 'position',
            'title', 'role', 'responsibility', 'duties', 'qualification', 'degree'
        }

    def allowed_file(self, filename: str) -> bool:
        """Check if file extension is allowed"""
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return ""

    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {e}")
            return ""

    def extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file with proper encoding handling"""
        try:
            # Try UTF-8 first
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Fallback to latin-1
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except UnicodeDecodeError:
                # Final fallback - read as binary and decode with errors='ignore'
                try:
                    with open(file_path, 'rb') as file:
                        content = file.read()
                        return content.decode('utf-8', errors='ignore')
                except Exception as e:
                    logger.error(f"Error reading text file with encoding fallbacks: {e}")
                    return ""
        except Exception as e:
            logger.error(f"Error reading text file: {e}")
            return ""

    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from various file formats"""
        extension = Path(file_path).suffix.lower()
        
        if extension == '.pdf':
            return self.extract_text_from_pdf(file_path)
        elif extension in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        elif extension == '.txt':
            return self.extract_text_from_txt(file_path)
        else:
            return ""

    def is_likely_name(self, text: str) -> bool:
        """Check if text is likely to be a person's name"""
        words = text.strip().split()
        
        # Basic checks
        if len(words) < 1 or len(words) > 5:
            return False
        
        # Check if all words are alphabetic (allowing for apostrophes and hyphens)
        for word in words:
            if not re.match(r"^[A-Za-z'-]+$", word):
                return False
            
            # Check if word is too short or too long
            if len(word) < 2 or len(word) > 20:
                return False
            
            # Check if it's a common non-name word
            if word.lower() in self.non_name_words:
                return False
        
        # Names typically have title case
        proper_case_count = sum(1 for word in words if word[0].isupper() and word[1:].islower())
        if proper_case_count < len(words) * 0.5:  # At least half should be proper case
            return False
        
        return True

    def extract_name_with_ai(self, text: str) -> Optional[str]:
        """Enhanced name extraction using multiple strategies"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Strategy 1: Look for name at the beginning of the document
        for i, line in enumerate(lines[:8]):  # Check first 8 lines
            # Skip lines that are clearly headers or metadata
            if any(keyword in line.lower() for keyword in ['resume', 'cv', 'curriculum vitae']):
                continue
            
            # Clean the line
            cleaned_line = re.sub(r'[^\w\s\'-]', ' ', line)
            cleaned_line = re.sub(r'\s+', ' ', cleaned_line).strip()
            
            if self.is_likely_name(cleaned_line):
                return cleaned_line
        
        # Strategy 2: Look for name patterns with labels
        name_patterns = [
            r'(?:Name|Full Name|Candidate|Applicant)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$',  # Simple first/last name pattern
        ]
        
        for pattern in name_patterns:
            matches = re.findall(pattern, text, re.MULTILINE)
            for match in matches:
                if self.is_likely_name(match):
                    return match
        
        # Strategy 3: Find standalone proper nouns that could be names
        lines_text = '\n'.join(lines[:10])
        potential_names = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b', lines_text)
        
        for name in potential_names:
            if self.is_likely_name(name) and len(name.split()) >= 2:
                return name
        
        return None

    def extract_email(self, text: str) -> Optional[str]:
        """Enhanced email extraction with better patterns"""
        email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'\b[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,}\b'
        ]
        
        all_emails = []
        for pattern in email_patterns:
            matches = re.findall(pattern, text)
            all_emails.extend(matches)
        
        # Filter out invalid emails and return the most likely one
        valid_emails = []
        for email in all_emails:
            # Basic validation
            if '@' in email and '.' in email.split('@')[1]:
                # Avoid emails that are too generic or fake
                if not any(fake in email.lower() for fake in ['example', 'test', 'dummy', 'sample']):
                    valid_emails.append(email)
        
        return valid_emails[0] if valid_emails else None

    def extract_phone(self, text: str) -> Optional[str]:
        """Enhanced phone number extraction with comprehensive patterns"""
        # Remove common phone prefixes for better extraction
        cleaned_text = re.sub(r'(?i)(?:phone|tel|mobile|cell|contact|number)[\s:]*', '', text)
        
        phone_patterns = [
            # International formats
            r'\+\d{1,4}[\s\-\.]?\(?\d{1,4}\)?[\s\-\.]?\d{1,4}[\s\-\.]?\d{1,9}',
            # US formats with country code
            r'\+1[\s\-\.]?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}',
            # Standard US formats
            r'\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}',
            # International without +
            r'\b\d{1,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}\b',
            # 10-digit numbers
            r'\b\d{10}\b',
            # Various separators
            r'\b\d{3}[\s\-\.]\d{3}[\s\-\.]\d{4}\b',
            # With parentheses
            r'\(\d{3}\)[\s\-\.]?\d{3}[\s\-\.]?\d{4}',
            # Indian format
            r'\+91[\s\-]?\d{10}|\b[6-9]\d{9}\b',
            # Other international formats
            r'\b\d{2,4}[\s\-]\d{2,4}[\s\-]\d{2,4}[\s\-]\d{2,4}\b'
        ]
        
        found_numbers = []
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, cleaned_text)
            for match in matches:
                # Clean the number
                clean_number = re.sub(r'[^\d+]', '', match)
                if len(clean_number) >= 7:  # Minimum reasonable phone number length
                    found_numbers.append(match.strip())
        
        if found_numbers:
            # Return the first valid number, preferring longer/more complete formats
            found_numbers.sort(key=len, reverse=True)
            return found_numbers[0]
        
        return None

    def extract_location(self, text: str) -> Optional[str]:
        """Enhanced location extraction with multiple strategies"""
        location_patterns = [
            # Explicit location labels
            r'(?i)(?:Location|Address|Based in|Located in|City|Residence|Lives in)[\s:]+([^\n\r]+?)(?=\n|$|\||•)',
            # City, State format
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2}(?:\s+\d{5})?)\b',
            # City, State, Country
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+,\s*[A-Z][a-z]+)\b',
            # ZIP code patterns (US)
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?)\b',
            # International postal codes
            r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z0-9]{2,8})\b',
            # Common address patterns
            r'\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd))?[,\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,?\s*[A-Z]{2,})',
        ]
        
        locations = []
        
        for pattern in location_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                location = match.strip(' ,.')
                if len(location) > 3 and len(location) < 100:  # Reasonable location length
                    locations.append(location)
        
        # Also look for common location keywords in context
        location_keywords = [
            'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
            'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
            'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
            'Seattle', 'Denver', 'Washington', 'Boston', 'Nashville', 'Baltimore',
            'London', 'Paris', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Mumbai',
            'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
            'California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois'
        ]
        
        for keyword in location_keywords:
            if keyword in text:
                # Find the context around the keyword
                pattern = rf'.{{0,50}}\b{re.escape(keyword)}\b.{{0,50}}'
                matches = re.findall(pattern, text, re.IGNORECASE)
                if matches:
                    context = matches[0].strip()
                    # Extract the cleanest location part
                    location_match = re.search(rf'\b{re.escape(keyword)}\b[^.\n]*', context, re.IGNORECASE)
                    if location_match:
                        locations.append(location_match.group().strip())
        
        if locations:
            # Return the most complete location (usually the longest)
            locations.sort(key=len, reverse=True)
            return locations[0]
        
        return None

    def extract_education(self, text: str) -> Optional[str]:
        """Enhanced education extraction with better pattern matching"""
        education_sections = []
        
        # Strategy 1: Find education sections
        education_section_patterns = [
            r'(?i)(Education|Academic|Qualification|Degree|University|College|School)[\s:]*\n?(.*?)(?=\n(?:[A-Z][^a-z]*|Experience|Work|Skills|Projects|$))',
            r'(?i)(?:Education|Academic Background|Educational Background)[\s:]*\n?(.*?)(?=\n\n|\n[A-Z]|$)'
        ]
        
        for pattern in education_section_patterns:
            matches = re.findall(pattern, text, re.DOTALL)
            for match in matches:
                if isinstance(match, tuple):
                    education_sections.append(match[1].strip())
                else:
                    education_sections.append(match.strip())
        
        # Strategy 2: Look for degree patterns throughout the text
        degree_patterns = [
            # Full degree names
            r'(?i)\b(Bachelor(?:\s+of\s+(?:Science|Arts|Engineering|Technology|Business|Commerce|Computer Science|Information Technology))?)\b(?:\s+(?:in|of)\s+([^,\n.]+))?',
            r'(?i)\b(Master(?:\s+of\s+(?:Science|Arts|Engineering|Technology|Business|Commerce|Computer Science|Information Technology))?)\b(?:\s+(?:in|of)\s+([^,\n.]+))?',
            r'(?i)\b((?:PhD|Ph\.D|Doctorate|Doctoral)(?:\s+in\s+([^,\n.]+))?)\b',
            r'(?i)\b(MBA|MCA|BCA|B\.Tech|M\.Tech|B\.Sc|M\.Sc|B\.A|M\.A|B\.Com|M\.Com)\b(?:\s+(?:in|of)\s+([^,\n.]+))?',
            # Abbreviated forms
            r'\b([BM]\.?[AES]\.?|PhD|MBA|MCA|BCA)\b',
            # University names
            r'(?i)\b(University|Institute|College|School)\s+of\s+([^,\n.]+)',
            r'(?i)\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(University|Institute|College)',
        ]
        
        degrees = []
        for pattern in degree_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if isinstance(match, tuple):
                    degree_info = ' '.join(filter(None, match))
                else:
                    degree_info = match
                
                if len(degree_info.strip()) > 2:
                    degrees.append(degree_info.strip())
        
        # Strategy 3: Look for graduation years and institutions
        year_institution_patterns = [
            r'(?i)(?:graduated|graduation|completed|earned|received|obtained)[\s,]*(?:in|from)?[\s,]*(\d{4})[\s,]*(?:from|at)?[\s,]*([A-Z][^,\n.]+)',
            r'(\d{4})[\s,]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:University|Institute|College|School)))',
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:University|Institute|College|School)))[\s,]*(\d{4})'
        ]
        
        for pattern in year_institution_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                year, institution = match
                education_info = f"{institution} ({year})"
                degrees.append(education_info)
        
        # Combine all education information
        all_education = education_sections + degrees
        
        if all_education:
            # Remove duplicates and combine
            unique_education = list(set(all_education))
            # Sort by length to prioritize more complete information
            unique_education.sort(key=len, reverse=True)
            
            # Limit to top 3 most relevant entries
            final_education = unique_education[:3]
            return '; '.join(final_education)
        
        return None

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills using pattern matching and semantic search"""
        skills = set()
        
        # Pattern-based extraction
        for pattern in self.skills_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            skills.update(matches)
        
        # Look for skills section
        skills_section_pattern = r'(?:Skills?|Technical Skills?|Core Competencies|Technologies?):(.*?)(?:\n\n|\n[A-Z]|$)'
        skills_match = re.search(skills_section_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if skills_match:
            skills_text = skills_match.group(1)
            # Split by common delimiters
            skill_items = re.split(r'[,;•\-\n]', skills_text)
            for skill in skill_items:
                skill = skill.strip()
                if skill and len(skill) < 50:  # Reasonable skill length
                    skills.add(skill)
        
        return list(skills)

    def extract_experience_years(self, text: str) -> Optional[str]:
        """Extract years of experience using pattern matching"""
        for pattern in self.experience_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    years = float(matches[0])
                    return f"{years} years"
                except ValueError:
                    continue
        
        return None

    def semantic_search_enhancement(self, text: str, field: str) -> Optional[str]:
        """Enhance extraction using semantic search"""
        if not semantic_model:
            return None
        
        try:
            # Create embeddings for the text
            sentences = text.split('.')
            embeddings = semantic_model.encode(sentences)
            
            # Define query embeddings for different fields
            field_queries = {
                'name': 'person name full name individual',
                'email': 'email address contact information',
                'phone': 'phone number telephone contact',
                'location': 'address location city state country',
                'education': 'education degree university college bachelor master phd',
                'skills': 'skills technical abilities competencies programming languages',
                'experience': 'experience years worked professional background'
            }
            
            if field not in field_queries:
                return None
            
            query_embedding = semantic_model.encode([field_queries[field]])
            
            # Find most similar sentences
            similarities = cosine_similarity(query_embedding, embeddings)[0]
            top_indices = np.argsort(similarities)[-3:]  # Top 3 most similar
            
            relevant_sentences = [sentences[i].strip() for i in top_indices if similarities[i] > 0.3]
            
            return ' '.join(relevant_sentences) if relevant_sentences else None
            
        except Exception as e:
            logger.error(f"Semantic search error: {e}")
            return None

    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """Main method to parse resume and extract all information"""
        # Extract text from file
        text = self.extract_text_from_file(file_path)
        
        if not text:
            return {
                'error': 'Could not extract text from file',
                'name': None,
                'email': None,
                'phone': None,
                'location': None,
                'education': None,
                'skills': [],
                'experience': None
            }
        
        # Store in vector database for future semantic searches
        if semantic_model:
            try:
                embedding = semantic_model.encode([text])
                resume_texts.append(text)
                resume_embeddings.append(embedding[0])
            except Exception as e:
                logger.error(f"Error creating embeddings: {e}")
        
        # Extract information with enhanced methods
        result = {
            'name': self.extract_name_with_ai(text),
            'email': self.extract_email(text),
            'phone': self.extract_phone(text),
            'location': self.extract_location(text),
            'education': self.extract_education(text),
            'skills': self.extract_skills(text),
            'experience': self.extract_experience_years(text)
        }
        
        # Enhance with semantic search for fields that weren't found
        for field in ['name', 'location', 'education']:
            if not result[field]:
                enhanced = self.semantic_search_enhancement(text, field)
                if enhanced:
                    result[field] = enhanced[:200]  # Limit length
        
        return result

# Initialize parser
parser = ResumeParser()

@app.route('/')
def index():
    """Serve the main HTML page"""
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Please ensure index.html is in the same directory as this script"
    except UnicodeDecodeError:
        # Fallback for encoding issues
        try:
            with open('index.html', 'r', encoding='latin-1') as f:
                return f.read()
        except Exception:
            return "Error reading HTML file. Please check file encoding."

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume_api():
    """API endpoint to parse uploaded resume"""
    try:
        if 'resume' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not parser.allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        try:
            # Parse the resume
            result = parser.parse_resume(file_path)
            
            # Clean up uploaded file
            os.remove(file_path)
            
            return jsonify(result)
            
        except Exception as e:
            # Clean up on error
            if os.path.exists(file_path):
                os.remove(file_path)
            raise e
            
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/export-excel', methods=['POST'])
def export_excel():
    """Export parsed data to Excel"""
    try:
        data = request.json.get('data', [])
        
        if not data:
            return jsonify({'error': 'No data to export'}), 400
        
        # Create Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Resume Data"
        
        # Define headers
        headers = ['Name', 'Email', 'Phone', 'Location', 'Education', 'Skills', 'Experience']
        
        # Style headers
        header_font = Font(bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
        header_alignment = Alignment(horizontal="center", vertical="center")
        
        # Write headers
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment
        
        # Write data
        for row, resume_data in enumerate(data, 2):
            ws.cell(row=row, column=1, value=resume_data.get('name', ''))
            ws.cell(row=row, column=2, value=resume_data.get('email', ''))
            ws.cell(row=row, column=3, value=resume_data.get('phone', ''))
            ws.cell(row=row, column=4, value=resume_data.get('location', ''))
            ws.cell(row=row, column=5, value=resume_data.get('education', ''))
            
            # Handle skills (convert list to string)
            skills = resume_data.get('skills', [])
            skills_str = ', '.join(skills) if isinstance(skills, list) else str(skills)
            ws.cell(row=row, column=6, value=skills_str)
            
            ws.cell(row=row, column=7, value=resume_data.get('experience', ''))
        
        # Auto-adjust column widths
        for col in ws.columns:
            max_length = 0
            column = col[0].column_letter
            for cell in col:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            ws.column_dimensions[column].width = adjusted_width
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
        wb.save(temp_file.name)
        
        return send_file(
            temp_file.name,
            as_attachment=True,
            download_name='resume_data.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        
    except Exception as e:
        logger.error(f"Error exporting Excel: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/semantic-search', methods=['POST'])
def semantic_search_api():
    """API endpoint for semantic search across stored resumes"""
    try:
        query = request.json.get('query', '')
        
        if not query or not semantic_model or not resume_embeddings:
            return jsonify({'error': 'No query provided or no resumes stored'}), 400
        
        # Create query embedding
        query_embedding = semantic_model.encode([query])
        
        # Convert stored embeddings to numpy array
        embeddings_array = np.array(resume_embeddings)
        
        # Calculate similarities
        similarities = cosine_similarity(query_embedding, embeddings_array)[0]
        
        # Get top 5 most similar resumes
        top_indices = np.argsort(similarities)[-5:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Minimum similarity threshold
                results.append({
                    'index': int(idx),
                    'similarity': float(similarities[idx]),
                    'text_snippet': resume_texts[idx][:200] + '...'
                })
        
        return jsonify({'results': results})
        
    except Exception as e:
        logger.error(f"Error in semantic search: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'semantic_model_loaded': semantic_model is not None,
        'stored_resumes': len(resume_texts)
    })

if __name__ == '__main__':
    print("""
    🚀 Enhanced AI Resume Parser Server Starting...
    
    Features:
    - Enhanced name extraction with multiple validation strategies
    - Improved phone number extraction supporting international formats
    - Better education parsing with degree and institution recognition
    - Enhanced location extraction with city, state, country patterns
    - AI-powered text extraction from PDF, DOCX, DOC, TXT files
    - Semantic search using sentence transformers
    - Vector database for similarity search
    - Excel export functionality
    - RESTful API endpoints
    
    Key Improvements:
    ✅ Better name detection with proper validation
    ✅ Comprehensive phone number patterns (US, International, Indian formats)
    ✅ Enhanced education extraction with degree patterns and institutions
    ✅ Improved location detection with multiple strategies
    ✅ More robust text processing and validation
    
    Endpoints:
    - / : Main application interface
    - /api/parse-resume : Parse uploaded resume files
    - /api/export-excel : Export data to Excel
    - /api/semantic-search : Semantic search across resumes
    - /api/health : Health check
    
    Requirements Installation:
    pip install flask flask-cors PyMuPDF python-docx pandas sentence-transformers
    pip install scikit-learn faiss-cpu openpyxl numpy
    
    """)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)