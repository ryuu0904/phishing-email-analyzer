document.getElementById('analyzeBtn').addEventListener('click', async function() {
    const emailContent = document.getElementById('emailContent').value.trim();
    if (!emailContent) {
        alert('Please paste an email to analyze');
        return;
    }

    // Show loading state
    document.getElementById('initialState').classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:5000/api/analyze-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email_content: emailContent })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();

        // Hide loading, show results
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('resultsState').classList.remove('hidden');

        // Update threat level text and color
        const threatLevelText = document.getElementById('threatLevelText');
        threatLevelText.textContent = result.threat_level;

        // Set color based on threat level
        threatLevelText.className = 'font-bold ';
        if (result.threat_level === 'Low Risk') {
            threatLevelText.classList.add('text-green-400');
        } else if (result.threat_level === 'Medium Risk') {
            threatLevelText.classList.add('text-yellow-400');
        } else {
            threatLevelText.classList.add('text-red-400');
        }

        // Update threat indicator bar width (optional)
        let widthPercent = 0;
        if (result.threat_level === 'Low Risk') widthPercent = 25;
        else if (result.threat_level === 'Medium Risk') widthPercent = 60;
        else widthPercent = 90;
        document.getElementById('threatIndicator').style.width = widthPercent + '%';

        // Show indicators list
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';
        if (result.indicators && result.indicators.length > 0) {
            result.indicators.forEach(indicator => {
                const div = document.createElement('div');
                div.className = 'flex items-start';
                div.textContent = indicator;
                resultsList.appendChild(div);
            });
        } else {
            resultsList.innerHTML = '<p class="text-green-400">No obvious phishing indicators detected</p>';
        }

    } catch (error) {
        alert('Error analyzing email: ' + error.message);
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('initialState').classList.remove('hidden');
    }
});


function analyzeEmail(content) {
    // Simple detection logic (in a real app, this would call an AI API)
    const indicators = [];
    let threatScore = 0;
    
    // Check for urgency words
    const urgencyWords = ['urgent', 'immediately', 'action required', 'verify now', 'account suspended'];
    const urgencyMatches = urgencyWords.filter(word => 
        content.toLowerCase().includes(word)
    );
    
    if (urgencyMatches.length > 0) {
        threatScore += 30;
        indicators.push({
            icon: '[WARNING] ',
            text: `Contains urgent language (${urgencyMatches.join(', ')})`,
            severity: 'medium'
        });
    }
    
    // Check for suspicious links
    const linkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>/g;
    const links = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[1]);
    }
    
    const suspiciousLinks = links.filter(link => {
        return !link.includes('trusteddomain.com') && !link.includes('wellknownbrand.org');
    });
    
    if (suspiciousLinks.length > 0) {
        threatScore += 40;
        indicators.push({
            icon: '[LINK] ',
            text: `${suspiciousLinks.length} suspicious link${suspiciousLinks.length > 1 ? 's' : ''} detected`,
            severity: 'high'
        });
    }
    
    // Check for spelling mistakes in common domains
    const domainSpellingMistakes = ['g00gle.com', 'micr0soft.com', 'paypa1.com'];
    const domainMatches = domainSpellingMistakes.filter(domain => 
        content.toLowerCase().includes(domain)
    );
    
    if (domainMatches.length > 0) {
        threatScore += 50;
        indicators.push({
            icon: '[EMAIL] ',
            text: `Contains fake domains (${domainMatches.join(', ')})`,
            severity: 'critical'
        });
    }
    
    // Check for generic greetings
    if (content.includes('Dear Customer') || content.includes('Dear User')) {
        threatScore += 10;
        indicators.push({
            icon: '[PERSON] ',
            text: 'Generic greeting (not personalized)',
            severity: 'low'
        });
    }
    
    // Determine threat level
    threatScore = Math.min(Math.max(threatScore, 0), 100);
    let threatLevel, threatColor;
    
    if (threatScore < 30) {
        threatLevel = 'Low Risk';
        threatColor = 'text-green-400';
    } else if (threatScore < 70) {
        threatLevel = 'Medium Risk';
        threatColor = 'text-yellow-400';
    } else {
        threatLevel = 'High Risk';
        threatColor = 'text-red-400';
    }
    
    // Update UI
    document.getElementById('loadingState').classList.add('hidden');
    
    const threatIndicator = document.getElementById('threatIndicator');
    threatIndicator.style.width = `${threatScore}%`;
    
    const threatLevelText = document.getElementById('threatLevelText');
    threatLevelText.textContent = threatLevel;
    threatLevelText.className = `font-bold ${threatColor}`;
    
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    if (indicators.length > 0) {
        indicators.forEach(indicator => {
            const item = document.createElement('div');
            item.className = 'flex items-start';
            
            let severityColor;
            switch(indicator.severity) {
                case 'low': severityColor = 'text-green-400'; break;
                case 'medium': severityColor = 'text-yellow-400'; break;
                case 'high': severityColor = 'text-orange-500'; break;
                case 'critical': severityColor = 'text-red-500'; break;
                default: severityColor = 'text-gray-400';
            }
            
            item.innerHTML = `
                <span class="${severityColor} mr-2 mt-0.5">${indicator.icon}</span>
                <span>${indicator.text}</span>
            `;
            
            resultsList.appendChild(item);
        });
    } else {
        resultsList.innerHTML = '<p class="text-green-400">No obvious phishing indicators detected</p>';
    }
    
    document.getElementById('resultsState').classList.remove('hidden');
}
