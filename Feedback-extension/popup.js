document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  const error = document.getElementById('error');

  // Get current tab URL
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    
    if (!url.includes('flipkart.com')) {
      error.textContent = 'Please open a Flipkart product page';
      error.style.display = 'block';
      return;
    }

    loader.style.display = 'block';
    
    // Send URL to backend
    fetch('http://127.0.0.1:5000/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
      loader.style.display = 'none';
      content.style.display = 'block';
      alert(JSON.stringify(data));
      // Update UI with response data
      document.getElementById('avgRating').textContent = data.summary;
      
      // Update sentiment bars and percentages
      const total = data.sentiments.Positive + data.sentiments.Negative + data.sentiments.Nuetral;
      const posPerc = (data.sentiments.Positive / total * 100).toFixed(1);
      const negPerc = (data.sentiments.Negative / total * 100).toFixed(1);
      const neutPerc = (data.sentiments.Nuetral / total * 100).toFixed(1);
      
      document.getElementById('positiveBar').style.width = `${posPerc}%`;
      document.getElementById('neutralBar').style.width = `${neutPerc}%`;
      document.getElementById('negativeBar').style.width = `${negPerc}%`;
      
      document.getElementById('positivePerc').textContent = posPerc;
      document.getElementById('neutralPerc').textContent = neutPerc;
      document.getElementById('negativePerc').textContent = negPerc;
      
      // Add keywords
      const posKeywords = document.getElementById('positiveKeywords');
      const negKeywords = document.getElementById('negativeKeywords');
      
      posKeywords.innerHTML = data.keywords.positive_keywords
        .map(keyword => `<span class="keyword positive-keyword">${keyword}</span>`)
        .join('');
        
      negKeywords.innerHTML = data.keywords.negative_keywords
        .map(keyword => `<span class="keyword negative-keyword">${keyword}</span>`)
        .join('');
    })
    .catch(err => {
      loader.style.display = 'none';
      error.textContent = `Error fetching review analysis. Please try again.${err}`;
      error.style.display = 'block';
    });
  });
});