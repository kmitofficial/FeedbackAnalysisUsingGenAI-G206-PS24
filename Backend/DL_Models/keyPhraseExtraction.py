import spacy
import numpy as np
from textblob import TextBlob
import re
from g4f.client import Client
import json

client = Client()

def generateKeywords(keywords):
    response = client.chat.completions.create(
        model = "gpt-4",
        messages=[{"role":"user", "content":"Keyphrases: "+" ".join(keywords)+"\nOnly give me the best 5 positive and negative keyphrases in a json format (WITHOUT BACKTICKS OR JSON WORD) from the above list with keys as positive_keywords and negative_keywords. Please give efficient and straight forward keyphrases. Pros and cons should be related to each other which makes sense"}],
    )
    return response.choices[0].message.content

def clean_text(text: str) -> str:
    """
    Clean and normalize text
    """
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and extra whitespace
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def extract_meaningful_phrases(reviews: list, nlp) -> list:
    """
    Extract meaningful phrases with advanced preprocessing
    """
    all_phrases = []
    
    for review in reviews:
        # Clean the text
        cleaned_review = clean_text(review)
        
        # Process with spaCy
        doc = nlp(cleaned_review)
        
        # Extract phrases
        current_phrase = []
        for token in doc:
            # Focus on nouns, adjectives, and meaningful words
            if token.pos_ in ['NOUN', 'ADJ', 'PROPN'] and not token.is_stop:
                current_phrase.append(token.text)
            
            # Create phrases of 2-3 words
            if len(current_phrase) >= 2:
                phrase = ' '.join(current_phrase)
                all_phrases.append(phrase)
                
                # Slide the window
                current_phrase = current_phrase[1:]
    
    return all_phrases

def score_phrases(reviews: list, phrases: list, positive_words, negative_words, negative_context_phrases) -> dict:
    """
    Score phrases based on sentiment and occurrence
    """
    phrase_sentiments = {}
    
    for phrase in phrases:
        # Track sentiment for this phrase
        phrase_occurrences = []
        phrase_contexts = []
        
        for review in reviews:
            # Check if phrase is in review
            if phrase.lower() in review.lower():
                # Analyze sentiment of the entire review
                blob = TextBlob(review)
                
                # Enhance sentiment with custom lexicon
                sentiment_score = blob.sentiment.polarity
                
                # Check for negative context
                negative_context = any(
                    context in review.lower() 
                    for context in negative_context_phrases
                )
                
                # Boost or reduce sentiment based on context
                if negative_context:
                    sentiment_score = min(sentiment_score, -0.3)
                
                # Boost sentiment if phrase contains positive/negative words
                if any(word in phrase.lower() for word in positive_words):
                    sentiment_score = max(sentiment_score, 0.5)
                elif any(word in phrase.lower() for word in negative_words):
                    sentiment_score = min(sentiment_score, -0.5)
                
                # Find negative context around the phrase
                words_around_phrase = review.lower().split(phrase.lower())
                if len(words_around_phrase) > 1:
                    context = words_around_phrase[0][-50:] + ' ' + words_around_phrase[1][:50]
                    phrase_contexts.append(context)
                
                phrase_occurrences.append(sentiment_score)
        
        # Only consider phrases with multiple occurrences
        if len(phrase_occurrences) > 1:
            phrase_sentiments[phrase] = {
                'positive_score': max(0, np.mean(phrase_occurrences)),
                'negative_score': abs(min(0, np.mean(phrase_occurrences))),
                'frequency': len(phrase_occurrences),
                'contexts': phrase_contexts
            }
    
    return phrase_sentiments

def extract_sentiment_phrases(reviews: list, top_n: int = 5) -> dict:
    """
    Extract top sentiment phrases
    """
    # Load spaCy model
    nlp = spacy.load('en_core_web_sm')

    # Comprehensive sentiment lexicons
    positive_words = {
        'good', 'great', 'excellent', 'awesome', 'superb', 'amazing', 
        'fantastic', 'best', 'perfect', 'nice', 'impressive', 'wonderful', 
        'smooth', 'fast', 'quick'
    }
    
    negative_words = {
        'bad', 'poor', 'terrible', 'worst', 'buggy', 'slow', 'issue', 
        'problem', 'disappointing', 'weak', 'average', 'lacking', 
        'drainage', 'defective', 'difficult', 'frustrating', 'limited', 
        'complaint', 'concerns', 'drawback', 'downside'
    }
    
    # Negative context phrases
    negative_context_phrases = {
        'not good', 'not working', 'does not', 'cannot', 'can not', 
        'little bit', 'minor issue', 'slight problem'
    }
    
    # Extract meaningful phrases
    phrases = extract_meaningful_phrases(reviews, nlp)
    
    # Remove duplicates while preserving order
    unique_phrases = list(dict.fromkeys(phrases))
    
    # Score phrases
    scored_phrases = score_phrases(reviews, unique_phrases, positive_words, negative_words, negative_context_phrases)
    
    # Sort and select top phrases
    
    # positive_phrases = sorted(
    #     [{'phrase': k, **v} for k, v in scored_phrases.items() if v['positive_score'] > 0], 
    #     key=lambda x: (x['positive_score'], x['frequency']), 
    #     reverse=True
    # )[:top_n]
    
    # negative_phrases = sorted(
    #     [{'phrase': k, **v} for k, v in scored_phrases.items() if v['negative_score'] > 0], 
    #     key=lambda x: (x['negative_score'], x['frequency']), 
    #     reverse=True
    # )[:top_n]


    
    # return {
    #     'positive_phrases': positive_phrases,
    #     'negative_phrases': negative_phrases
    # }

    keys = generateKeywords(unique_phrases)

    keys = re.sub(r"^json", "", keys)

    keys = re.sub(r',\s*]', ']', keys)
    keys = re.sub(r'\]\s*,\s*]', ']]', keys)
    keys = re.sub(r'(?<=")\s+(?=")', ',', keys)

    print(keys)
    data = json.loads(keys)

    return data





