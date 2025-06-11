from transformers import pipeline

def extract_keywords(sentences):
    # Use token classification for keyphrase extraction
    keyphrase_extractor = pipeline("ner", model="ml6team/keyphrase-extraction-distilbert-inspec")
    
    # Initialize sentiment analyzer
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    
    positive_phrases = []
    negative_phrases = []
    
    for sentence in sentences:
        extracted_phrases = keyphrase_extractor(sentence)
        keyphrases = list({item['word'] for item in extracted_phrases})  # Deduplicate keyphrases
        
        for phrase in keyphrases:
            sentiment = sentiment_analyzer(phrase)[0]['label']
            if sentiment == "POSITIVE":
                positive_phrases.append(phrase)
            elif sentiment == "NEGATIVE":
                negative_phrases.append(phrase)
    
    return {
        "positive_keywords": positive_phrases[:10],
        "negative_keywords": negative_phrases[:10]
    }





sentences = [
    "The product quality is excellent and delivery was very fast.",
    "Terrible customer service and the item was damaged on arrival.",
    "I love the user-friendly interface and sleek design of this app."
]

keywords = extract_keywords(sentences)
print("Positive Keywords:", keywords["positive_keywords"])
print("Negative Keywords:", keywords["negative_keywords"])
