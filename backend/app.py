from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

urgent_keywords = ['urgent', 'immediate', 'asap', 'action required', 'account suspended']

def check_urgent_language(text):
    return [word for word in urgent_keywords if word in text.lower()]

def extract_urls(text):
    url_pattern = r'https?://[^\s]+'
    return re.findall(url_pattern, text)

def check_sender_info(text):
    footer_indicators = ['contact us at', 'company address', '@', 'phone:', 'email:']
    footer_text = text[-int(len(text)*0.2):].lower()
    return [phrase for phrase in footer_indicators if phrase in footer_text]

@app.route('/api/analyze-email', methods=['POST'])
def analyze_email():
    data = request.get_json(force=True, silent=True)
    if not data or 'email_content' not in data:
        return jsonify({"error": "Missing email_content"}), 400

    email_content = data['email_content']
    if not isinstance(email_content, str):
        return jsonify({"error": "email_content must be a string"}), 400

    indicators = []

    urgent_found = check_urgent_language(email_content)
    if urgent_found:
        indicators.append(f"Urgent language detected: {', '.join(urgent_found)}")

    urls = extract_urls(email_content)
    if urls:
        indicators.append(f"Links found: {', '.join(urls)}")

    sender_info_found = check_sender_info(email_content)
    if not sender_info_found:
        indicators.append("Missing sender contact information in footer")

    if len(indicators) == 0:
        threat_level = "Low Risk"
    elif len(indicators) == 1:
        threat_level = "Medium Risk"
    else:
        threat_level = "High Risk"

    return jsonify({
        "threat_level": threat_level,
        "indicators": indicators
    })

if __name__ == '__main__':
    app.run(debug=True)
