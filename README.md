# Phishing Email Analyzer
# Description
A web application that analyzes email content to detect phishing threats by checking for urgent language, suspicious links, and sender contact information. The backend is built with Flask, and the frontend uses HTML, CSS, and JavaScript.

# Project Structure

phising_ai/
├── backend/       # Flask backend API
│   └── app.py
├── frontend/      # Frontend files (HTML, CSS, JS)
│   └── index.html
│   └── script.js
│   └── style.css

# Features
Detects urgent language in emails.
Extracts and flags suspicious URLs.
Checks for sender contact info in the footer.
Returns a threat level: Low, Medium, or High risk.

# Prerequisites
Python 3.x
Flask
Flask-CORS
Installation and Running

# Backend
Open terminal/command prompt.
Navigate to backend folder:
cd path/to/phising_ai/backend
(Optional) Create and activate a virtual environment:
python -m venv venv
    # Windows PowerShell:
    .\venv\Scripts\Activate.ps1
    # Windows CMD:
    .\venv\Scripts\activate

# Install dependencies:
pip install flask flask-cors
Run the backend server:
python app.py
Backend runs at http://localhost:5000.

# Frontend
Open a new terminal.
Navigate to frontend folder:
cd path/to/phising_ai/frontend
Run a simple HTTP server:
python -m http.server 8000
Open browser and go to:
http://localhost:8000

# Usage
Enter or paste email content in the frontend input box.
Click "Analyze Email".
View the threat level and phishing indicators.

# Technologies Used
Python 3
Flask
Flask-CORS
HTML, CSS, JavaScript

