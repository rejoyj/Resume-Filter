from flask import Flask, render_template, request, jsonify, send_file, flash, redirect, url_for
from flask_cors import CORS
import os
import json
import tempfile
import zipfile
from datetime import datetime
from werkzeug.utils import secure_filename
from resume_parser import ResumeParser
from excel_export import ExcelExporter
import pandas as pd

app = Flask(__name__)  # Fixed: __name_ instead of name
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}})

app.secret_key = 'your-secret-key-here'

UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    try:
        print("Upload endpoint hit")  # Debug log
        
        if 'files' not in request.files:
            return jsonify({'success': False, 'message': 'No files selected'})
        
        files = request.files.getlist('files')
        uploaded_files = []
        
        for file in files:
            if file.filename == '':
                continue
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
                filename = timestamp + filename
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                uploaded_files.append({
                    'original_name': file.filename,
                    'saved_name': filename,
                    'filepath': filepath
                })
            else:
                return jsonify({
                    'success': False, 
                    'message': f'Invalid file type: {file.filename}. Only PDF, DOCX, and TXT files are allowed.'
                })
        
        if not uploaded_files:
            return jsonify({'success': False, 'message': 'No valid files uploaded'})
        
        print(f"Successfully uploaded {len(uploaded_files)} files")  # Debug log
        
        return jsonify({
            'success': True, 
            'message': f'{len(uploaded_files)} files uploaded successfully',
            'files': uploaded_files
        })
        
    except Exception as e:
        print(f"Upload error: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': f'Upload error: {str(e)}'})

@app.route('/process', methods=['POST'])
def process_resumes():
    try:
        print("Process endpoint hit")  # Debug log
        
        parser = ResumeParser()
        upload_files = []
        
        # Get all uploaded files
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                upload_files.append(filepath)

        if not upload_files:
            return jsonify({'success': False, 'message': 'No files to process'})
        
        print(f"Processing {len(upload_files)} files")  # Debug log
        
        parsed_resumes = []
        processing_results = []
        
        for filepath in upload_files:
            filename = os.path.basename(filepath)
            try:
                print(f"Processing: {filename}")  # Debug log
                parsed_data = parser.parse_resume(filepath)
                
                if parsed_data:
                    # Ensure file_name is included in the parsed data
                    parsed_data['file_name'] = filename
                    parsed_resumes.append(parsed_data)
                    processing_results.append({
                        'filename': filename,
                        'status': 'success',
                        'message': 'Processed successfully'
                    })
                    print(f"Successfully processed: {filename}")  # Debug log
                else:
                    processing_results.append({
                        'filename': filename,
                        'status': 'error',
                        'message': 'Failed to extract data'
                    })
                    print(f"Failed to process: {filename}")  # Debug log
                    
            except Exception as e:
                processing_results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': str(e)
                })
                print(f"Error processing {filename}: {str(e)}")  # Debug log
        
        if not parsed_resumes:
            return jsonify({
                'success': False, 
                'message': 'No resumes were successfully processed',
                'results': processing_results
            })
        
        # Save JSON file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        json_filename = f'parsed_resumes_{timestamp}.json'
        json_filepath = os.path.join(app.config['RESULTS_FOLDER'], json_filename)
        
        with open(json_filepath, 'w', encoding='utf-8') as f:
            json.dump(parsed_resumes, f, indent=2, ensure_ascii=False)
        
        # Calculate statistics
        stats = {
            'total_processed': len(parsed_resumes),
            'with_name': sum(1 for r in parsed_resumes if r.get('name')),
            'with_email': sum(1 for r in parsed_resumes if r.get('email')),
            'with_phone': sum(1 for r in parsed_resumes if r.get('phone_number')),
            'with_skills': sum(1 for r in parsed_resumes if r.get('skills')),
            'with_education': sum(1 for r in parsed_resumes if r.get('education')),
            'with_location': sum(1 for r in parsed_resumes if r.get('location')),
            'with_experience': sum(1 for r in parsed_resumes if r.get('total_experience'))
        }
        
        print(f"Successfully processed {len(parsed_resumes)} resumes")  # Debug log
        print(f"Sample data: {parsed_resumes[0] if parsed_resumes else 'No data'}")  # Debug log
        
        response_data = {
            'success': True,
            'message': f'Successfully processed {len(parsed_resumes)} resumes',
            'data': parsed_resumes,
            'stats': stats,
            'json_file': json_filename,
            'processing_results': processing_results
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Processing error: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': f'Processing error: {str(e)}'})

@app.route('/export-excel', methods=['POST'])
def export_to_excel():
    try:
        print("Export Excel endpoint hit")  # Debug log
        
        data = request.json
        parsed_resumes = data.get('data', [])
        
        if not parsed_resumes:
            return jsonify({'success': False, 'message': 'No data to export'})
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_filename = f'parsed_resumes_{timestamp}.xlsx'
        excel_filepath = os.path.join(app.config['RESULTS_FOLDER'], excel_filename)
        
        try:
            # Try using the ExcelExporter class first
            exporter = ExcelExporter()
            exporter.export_to_excel(parsed_resumes, excel_filepath)
        except (ImportError, AttributeError, Exception) as e:
            print(f"ExcelExporter failed, using pandas: {str(e)}")  # Debug log
            # Fallback to pandas
            df_data = []
            for resume in parsed_resumes:
                row = {
                    'File Name': resume.get('file_name', ''),
                    'Name': resume.get('name', ''),
                    'Email': resume.get('email', ''),
                    'Phone': resume.get('phone_number', ''),
                    'Skills': ', '.join(resume.get('skills', [])) if resume.get('skills') else '',
                    'Education': ', '.join(resume.get('education', [])) if resume.get('education') else '',
                    'Location': resume.get('location', ''),
                    'Experience (Years)': resume.get('total_experience', '')
                }
                df_data.append(row)
            
            df = pd.DataFrame(df_data)
            df.to_excel(excel_filepath, index=False, engine='openpyxl')
        
        return jsonify({
            'success': True,
            'message': 'Excel file created successfully',
            'filename': excel_filename
        })
        
    except Exception as e:
        print(f"Export error: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': f'Export error: {str(e)}'})

@app.route('/download/<filename>')
def download_file(filename):
    try:
        filepath = os.path.join(app.config['RESULTS_FOLDER'], filename)
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True)
        else:
            return jsonify({'success': False, 'message': 'File not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': f'Download error: {str(e)}'}), 500

@app.route('/clear', methods=['POST'])
def clear_files():
    try:
        print("Clear files endpoint hit")  # Debug log
        
        # Clear upload folder
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
        
        # Clear results folder
        for filename in os.listdir(app.config['RESULTS_FOLDER']):
            file_path = os.path.join(app.config['RESULTS_FOLDER'], filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                
        return jsonify({'success': True, 'message': 'All files cleared successfully'})
    except Exception as e:
        print(f"Clear error: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': f'Clear error: {str(e)}'})

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

# Remove or fix the duplicate export_excel endpoint
@app.route('/export_excel', methods=['GET'])
def export_excel_get():
    try:
        parser = ResumeParser()
        upload_files = []
        
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                upload_files.append(filepath)
                
        if not upload_files:
            return jsonify({'success': False, 'message': 'No files to export'})
        
        parsed_resumes = []
        for filepath in upload_files:
            parsed_data = parser.parse_resume(filepath)
            if parsed_data:
                parsed_resumes.append(parsed_data)
        
        if not parsed_resumes:
            return jsonify({'success': False, 'message': 'No data to export'})
            
        excel_filename = f'parsed_resumes_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        excel_filepath = os.path.join(app.config['RESULTS_FOLDER'], excel_filename)
        
        # Use the same export logic as the POST endpoint
        try:
            exporter = ExcelExporter()
            exporter.export_to_excel(parsed_resumes, excel_filepath)
        except:
            df_data = []
            for resume in parsed_resumes:
                row = {
                    'File Name': resume.get('file_name', ''),
                    'Name': resume.get('name', ''),
                    'Email': resume.get('email', ''),
                    'Phone': resume.get('phone_number', ''),
                    'Skills': ', '.join(resume.get('skills', [])) if resume.get('skills') else '',
                    'Education': ', '.join(resume.get('education', [])) if resume.get('education') else '',
                    'Location': resume.get('location', ''),
                    'Experience (Years)': resume.get('total_experience', '')
                }
                df_data.append(row)
            df = pd.DataFrame(df_data)
            df.to_excel(excel_filepath, index=False, engine='openpyxl')
        
        return send_file(excel_filepath, as_attachment=True)
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Export error: {str(e)}'})

# Add error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({'success': False, 'message': 'File too large. Maximum size is 16MB.'}), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':  # Fixed: __name_ and _main_ instead of name and main
    print("Starting Flask app on http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)