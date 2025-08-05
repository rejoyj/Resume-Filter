#!/usr/bin/env python3
"""
Setup script for Resume Parser Web Application
"""

import os
import subprocess
import sys

def run_command(command):
    """Run a command and return success status"""
    try:
        subprocess.run(command, shell=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e}")
        return False

def setup_environment():
    """Setup the environment for the resume parser"""
    print("="*60)
    print("        RESUME PARSER WEB APPLICATION SETUP")
    print("="*60)
    
    # Create necessary directories
    directories = ['uploads', 'results', 'templates', 'static']
    
    print("\n1. Creating directories...")
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✓ Created directory: {directory}")
        else:
            print(f"✓ Directory already exists: {directory}")
    
    # Install Python requirements
    print("\n2. Installing Python requirements...")
    if run_command("pip install -r requirements.txt"):
        print("✓ Python requirements installed successfully")
    else:
        print("❌ Failed to install Python requirements")
        return False
    
    # Download NLTK data
    print("\n3. Downloading NLTK data...")
    nltk_downloads = [
        'punkt',
        'stopwords',
        'averaged_perceptron_tagger',
        'maxent_ne_chunker',
        'words'
    ]
    
    for dataset in nltk_downloads:
        try:
            import nltk
            nltk.download(dataset, quiet=True)
            print(f"✓ Downloaded NLTK dataset: {dataset}")
        except Exception as e:
            print(f"❌ Failed to download {dataset}: {e}")
    
    # Download spaCy model
    print("\n4. Downloading spaCy model...")
    if run_command("python -m spacy download en_core_web_sm"):
        print("✓ spaCy model downloaded successfully")
    else:
        print("⚠️  Warning: spaCy model download failed. The application will still work with reduced functionality.")
    
    # Create templates directory with index.html
    print("\n5. Setting up templates...")
    templates_dir = 'templates'
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
    
    # Move index.html to templates directory if it exists in current directory
    if os.path.exists('index.html'):
        import shutil
        shutil.move('index.html', os.path.join(templates_dir, 'index.html'))
        print("✓ Moved index.html to templates directory")
    
    print("\n" + "="*60)
    print("                    SETUP COMPLETE!")
    print("="*60)
    print("\nTo start the application, run:")
    print("python app.py")
    print("\nThen open your browser to: http://localhost:5000")
    print("\nMake sure all your Python files are in the same directory:")
    print("- app.py")
    print("- resume_parser.py") 
    print("- excel_export.py")
    print("- templates/index.html")
    print("="*60)
    
    return True

if __name__ == "__main__":
    success = setup_environment()
    if not success:
        sys.exit(1)