
from flask import Flask, request, jsonify
import requests
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.service import Service
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import torch
import torch.nn as nn
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import nltk
from rake_nltk import Rake
from transformers import pipeline
from textblob import TextBlob
import time
from nltk.probability import FreqDist
from nltk.corpus import stopwords
from keybert import KeyBERT
from selenium.webdriver.support.ui import Select
from flask_cors import CORS
from keyPhraseExtraction import extract_sentiment_phrases

# Download necessary NLTK resources (if not already downloaded)
nltk.download('stopwords')
nltk.download('punkt')

app = Flask(__name__)
CORS(app) 

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# options = Options()
# options.add_argument("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0")
# webdriver_service = Service(r"C:\Users\siddh\Downloads\edgedriver_win64\msedgedriver.exe")

def configure_browser():
    options = Options()
    # options.add_argument("--headless")  # Run in headless mode
    # options.add_argument("--disable-gpu")
    # options.add_argument("--no-sandbox")
    # options.add_argument("--disable-blink-features=AutomationControlled")
    # options.add_argument("--start-maximized")
    options.add_argument(
        "uMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0"
    )
    webdriver_service = Service(r"C:\Users\karli\OneDrive\Desktop\Feedback Analysis\FeedbackAnalysisUsingGenAI-G206-PS24\Backend\DL_Models\edgedriver_win64\msedgedriver.exe")
    return webdriver.Edge(service=webdriver_service, options=options)



API_KEY = "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"
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": f"Bearer {API_KEY}"}

# def get_driver():
#     return webdriver.Edge(service=webdriver_service, options=options)

class NeuralNetwork(nn.Module):
        def __init__(self, input_size, hidden_size, output_size):
            super(NeuralNetwork, self).__init__()
            self.fc1 = nn.Linear(input_size, hidden_size)
            self.relu = nn.ReLU()
            self.fc2 = nn.Linear(hidden_size, output_size)
            self.softmax = nn.Softmax(dim=1)

        def forward(self, X):
            out = self.fc1(X)
            out = self.relu(out)
            out = self.fc2(out)
            out = self.softmax(out)
            return out

def getSentiment(data):
    print(data)
    with open('tfidf_vectorizer.pkl', 'rb') as f:
        tfidf_vectorizer = pickle.load(f)

    model = torch.load('best_model.pth')
    model.eval()

    def predict_review(review):
        # print(review)
        review_tfidf = tfidf_vectorizer.transform([review]).toarray()

        inputs = torch.tensor(review_tfidf, dtype=torch.float32)

        with torch.no_grad():
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            probabilities = torch.softmax(outputs, dim=1).squeeze().numpy()

        predicted_label = predicted.item()
        # print(predicted_label)
        return predicted_label, probabilities

    # review = "This product is waste of money."
    label_mapping = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    total_count = {'Negative':0, 'Nuetral':0, 'Positive':0}

    for review in data:
        predicted_label, probabilities = predict_review(review)
        if(predicted_label==0):
            total_count['Negative']+=1
        elif(predicted_label==1):
            total_count['Nuetral']+=1
        else:
            total_count['Positive']+=1
    
    return total_count


def extract_unique_keywords(reviews):
    # print(reviews)
    rake = Rake()
    unique_keywords = set()
    # for review in reviews:
    # print(reviews)
    rake.extract_keywords_from_text(reviews)
    keywords_with_scores = rake.get_ranked_phrases_with_scores()
    
    for score, phrase in keywords_with_scores:
        if score > 0.6:
            unique_keywords.add(phrase)

    
    keywords_sentiments = [{"keyword": keyword, "sentiment": TextBlob(keyword).sentiment.polarity} for keyword in unique_keywords]

    sorted_keywords = sorted(keywords_sentiments, key=lambda x: x["sentiment"], reverse=True)

    positive_keywords = [item['keyword'] for item in sorted_keywords if item["sentiment"]>0][:5]
    negative_keywords = [item['keyword'] for item in sorted_keywords if item["sentiment"]<0][:5]

    result = {}
    result["positive_keywords"] = positive_keywords
    result["negative_keywords"] = negative_keywords
    # print(result)
    return result



def split_reviews(reviews, max_tokens=500):
    # Split combined reviews into smaller chunks based on max tokens.
    combined_reviews = " ".join(reviews)
    words = combined_reviews.split()
    chunks = []
    while len(words) > 0:
        chunks.append(" ".join(words[:max_tokens]))
        words = words[max_tokens:]
    return chunks






def extract_keywords(sentences):
    
    # Initialize KeyBERT model
    kw_model = KeyBERT()
    
    
    # sentiment_analyzer = pipeline("sentiment-analysis")

    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="distilbert-base-uncased-finetuned-sst-2-english"
    )
    
    stop_words = set(stopwords.words("english"))
    positive_phrases = []
    negative_phrases = []
    
    for sentence in sentences:
        
        extracted_phrases = kw_model.extract_keywords(sentence, keyphrase_ngram_range=(1, 2), stop_words="english", top_n=5)
        
        
        for phrase, _ in extracted_phrases:
            clean_phrase = ' '.join(word for word in phrase.split() if word.lower() not in stop_words)
            if clean_phrase:  # Ensure it's not empty after cleaning
                sentiment = sentiment_analyzer(clean_phrase)[0]['label']
                if sentiment == "POSITIVE":
                    positive_phrases.append(clean_phrase)
                elif sentiment == "NEGATIVE":
                    negative_phrases.append(clean_phrase)
    
    pos_freq = FreqDist(positive_phrases)
    neg_freq = FreqDist(negative_phrases)
    
    return {
    "positive_keywords": [phrase for phrase, _ in pos_freq.most_common(5)],  
    "negative_keywords": [phrase for phrase, _ in neg_freq.most_common(5)]   
    }




def extract_keywords_using_roberta(sentences):
    # Initialize KeyBERT model
    kw_model = KeyBERT()
    
    # Initialize sentiment analyzer with Wiki-Roberta model
    sentiment_analyzer = pipeline(
        "sentiment-analysis",
        model="cardiffnlp/twitter-roberta-base-sentiment"
    )
    
    stop_words = set(stopwords.words("english"))
    positive_phrases = []
    negative_phrases = []
    
    def is_subset(new_phrase, existing_phrases):
        """Check if the new_phrase is a subset of any existing phrase."""
        for phrase in existing_phrases:
            if new_phrase in phrase or phrase in new_phrase:
                return True
        return False
    
    for sentence in sentences:
        # Extract keywords using KeyBERT
        extracted_phrases = kw_model.extract_keywords(
            sentence, 
            keyphrase_ngram_range=(1, 3), 
            stop_words="english", 
            top_n=5
        )
        
        for phrase, _ in extracted_phrases:
            # Remove stopwords from the phrase
            clean_phrase = ' '.join(word for word in phrase.split() if word.lower() not in stop_words)
            if clean_phrase:  # Ensure it's not empty after cleaning
                sentiment = sentiment_analyzer(clean_phrase)[0]['label']
                
                # Add to positive or negative list only if it's not a subset of existing keywords
                if sentiment == "Positive" and not is_subset(clean_phrase, positive_phrases):
                    positive_phrases.append(clean_phrase)
                elif sentiment == "Negative" and not is_subset(clean_phrase, negative_phrases):
                    negative_phrases.append(clean_phrase)
    
    return {
        "positive_keywords": positive_phrases[:10],  # Get top 10 unique phrases
        "negative_keywords": negative_phrases[:10]   # Get top 10 unique phrases
    }


# sentences = [
#     "The new product is outstanding and delivers great value.",
#     "Customer support is awful and they never respond on time.",
#     "I love the sleek design of the phone.",
#     "The battery life is disappointing and doesn't last long."
# ]

# results = extract_keywords(sentences)
# print("Positive Phrases:", results['positive'])
# print("Negative Phrases:", results['negative'])








def summarize_reviews(reviews, max_length=120, min_length=50):
    review_chunks = split_reviews(reviews, max_tokens=500)
    summaries = []
    for chunk in review_chunks:
        payload = {
            "inputs": chunk,
            "parameters": {
                "max_length": max_length,
                "min_length": min_length,
                "do_sample": False
            }
        }

        response = requests.post(API_URL, headers=headers, json=payload)

        if response.status_code == 200:
            summaries.append(response.json()[0]['summary_text'])
        else:
            raise Exception(f"Request failed with status code {response.status_code}: {response.text}")
    
    # Combine the summaries into a final summary
    return " ".join(summaries)



# Open the specified URL
def open_url(browser, url):
    browser.get(url)
    time.sleep(3)

# Extract review text from the page
def get_reviewtext(browser, reviews):
    review_elements = browser.find_elements(By.CLASS_NAME, "ZmyHeo")
    for item in review_elements:
        body = item.text
        if body:
            reviews["review_text"].append(body)

# Extract ratings from the page
def get_ratings(browser, reviews):
    rating_elements = browser.find_elements(By.CLASS_NAME, "XQDdHH")
    for value in rating_elements:
        try:
            rating = float(value.text)
            reviews["rating"].append(rating)
        except ValueError:
            pass

# Main function to extract reviews and ratings
def get_reviews_ratings(browser, url, max_reviews=20):
    reviews = {"review_text": [], "rating": [], "categories": []}
    open_url(browser, url)

    try:
        try:
            category_elements = browser.find_elements(By.CLASS_NAME, "R0cyWM")
            eles = []
            for element in category_elements:
                print(f"Category element: {element.text}")
                eles.append(element.text)
            reviews["categories"] = eles
        except Exception as e:
            print(f"Error extracting categories: {e}")
            reviews["categories"] = ["No categories found"]



        # Wait for the "All Reviews" button to be clickable and click it
        all_reviews = WebDriverWait(browser, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//div[@class="_23J90q RcXBOT"]/span[contains(text(),"All")]'))
        )
        all_reviews.click()
        time.sleep(3)  # Allow time for the reviews page to load

        # Select the "POSITIVE_FIRST" option from the dropdown
        select_element = WebDriverWait(browser, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "OZuttk.JEZ5ey"))
        )
        select = Select(select_element)

        # Extract positive reviews first
        select.select_by_value("POSITIVE_FIRST")
        time.sleep(2)  # Allow time for the dropdown to apply the filter

        while len(reviews["review_text"]) < max_reviews/2:
            try:
                # Extract reviews and ratings from the current page
                get_reviewtext(browser, reviews)
                get_ratings(browser, reviews)

                # Stop if the required number of reviews is reached
                if len(reviews["review_text"]) >= max_reviews:
                    break

                # Click the "Next" button to go to the next page
                try:
                    next_button = WebDriverWait(browser, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//a[@class="_9QVEpD"]/span[contains(text(),"Next")]'))
                    )
                    browser.execute_script("arguments[0].scrollIntoView();", next_button)
                    next_button.click()
                    time.sleep(3)  # Allow time for the next page to load
                except Exception as e:
                    print("Reached the last page or error in clicking 'Next' button.")
                    break
            except Exception as e:
                print(f"Error extracting positive reviews: {e}")
                break

        # Now, select the "NEGATIVE_FIRST" option to extract negative reviews
        select.select_by_value("NEGATIVE_FIRST")
        time.sleep(2)  # Allow time for the dropdown to apply the filter

        while len(reviews["review_text"]) < max_reviews:
            try:
                # Extract reviews and ratings from the current page
                get_reviewtext(browser, reviews)
                get_ratings(browser, reviews)

                # Stop if the required number of reviews is reached
                if len(reviews["review_text"]) >= max_reviews:
                    break

                # Click the "Next" button to go to the next page
                try:
                    next_button = WebDriverWait(browser, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//a[@class="_9QVEpD"]/span[contains(text(),"Next")]'))
                    )
                    browser.execute_script("arguments[0].scrollIntoView();", next_button)
                    next_button.click()
                    time.sleep(3)  # Allow time for the next page to load
                except Exception as e:
                    print("Reached the last page or error in clicking 'Next' button.")
                    break
            except Exception as e:
                print(f"Error extracting negative reviews: {e}")
                break

    except Exception as e:
        print(f"Error clicking 'All Reviews' button or selecting options: {e}")

    return reviews



@app.route('/reviews', methods=['POST'])
def reviews():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required in the JSON body"}), 400
    browser = configure_browser()
    try:
        reviews_data = {"get_reviews": [], "keywords": {}, "sentiments":{}, "summary":{}}
        reviews_data['get_reviews'] = get_reviews_ratings(browser=browser, url=url, max_reviews=50)
        # reviews_data['get_reviews'] = send_data(url)
        # uuu = "http://172.28.0.12:5000/analyze_sentiment"
        reviews_data['sentiments'] = getSentiment(reviews_data['get_reviews']['review_text'])
        print(reviews_data['sentiments'])
        reviews_data["summary"] = summarize_reviews(reviews_data['get_reviews']['review_text'])
        reviews_data['keywords'] = extract_sentiment_phrases(reviews_data['get_reviews']['review_text'])
        # print(reviews_data)
        return jsonify(reviews_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)















# import time
# import pandas as pd
# from flask import Flask, request, jsonify
# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC


# # Flask app setup
# app = Flask(_name_)

# # Allow CORS for all routes
# from flask_cors import CORS
# CORS(app)

# # Configure Selenium WebDriver
# def configure_browser():
#     options = Options()
#     options.add_argument("--headless")  # Run in headless mode
#     options.add_argument("--disable-gpu")
#     options.add_argument("--no-sandbox")
#     options.add_argument("--disable-blink-features=AutomationControlled")
#     options.add_argument("--start-maximized")
#     options.add_argument(
#         "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
#     )
#     return webdriver.Chrome(options=options)

# # Open the specified URL
# def open_url(browser, url):
#     browser.get(url)
#     time.sleep(3)

# # Extract review text from the page
# def get_reviewtext(browser, reviews):
#     review_elements = browser.find_elements(By.CLASS_NAME, "ZmyHeo")
#     for item in review_elements:
#         body = item.text
#         reviews["review_text"].append(body if body else None)

# # Extract ratings from the page
# def get_ratings(browser, reviews):
#     rating_elements = browser.find_elements(By.CLASS_NAME, "XQDdHH")
#     for value in rating_elements:
#         try:
#             rating = float(value.text)
#             reviews["rating"].append(rating)
#         except ValueError:
#             reviews["rating"].append(None)

# # Main function to extract reviews and ratings
# def get_reviews_ratings(browser, url, max_reviews=20):
#     reviews = {"review_text": [], "rating": []}
#     open_url(browser, url)

#     # Step 1: Click on "All Reviews" button
#     try:
#         all_reviews = WebDriverWait(browser, 10).until(
#             EC.element_to_be_clickable((By.XPATH, '//div[@class="_23J90q RcXBOT"]/span[contains(text(),"All")]'))
#         )
#         all_reviews.click()
#         time.sleep(3)  # Allow time for the reviews page to load
#     except Exception as e:
#         print(f"Error clicking 'All Reviews' button: {e}")
#         return reviews

#     # Step 2: Loop through each page and extract reviews
#     while len(reviews["review_text"]) < max_reviews:
#         try:
#             # Extract reviews and ratings from the current page
#             get_reviewtext(browser, reviews)
#             get_ratings(browser, reviews)

#             # Stop if the required number of reviews is reached
#             if len(reviews["review_text"]) >= max_reviews:
#                 break

#             # Ensure reviews and ratings lists are the same length
#             while len(reviews["review_text"]) > len(reviews["rating"]):
#                 reviews["rating"].append(None)
#             while len(reviews["rating"]) > len(reviews["review_text"]):
#                 reviews["review_text"].append(None)

#             # Click the "Next" button to go to the next page
#             try:
#                 next_button = WebDriverWait(browser, 10).until(
#                     EC.element_to_be_clickable((By.XPATH, '//a[@class="_9QVEpD"]/span[contains(text(),"Next")]'))
#                 )
#                 browser.execute_script("arguments[0].scrollIntoView();", next_button)
#                 next_button.click()
#                 time.sleep(3)  # Allow time for the next page to load
#             except Exception as e:
#                 print("Reached the last page or error in clicking 'Next' button.")
#                 break

#         except Exception as e:
#             print(f"Error extracting reviews or ratings: {e}")
#             break

#     # Trim to the specified number of reviews
#     reviews["review_text"] = reviews["review_text"][:max_reviews]
#     reviews["rating"] = reviews["rating"][:max_reviews]

#     return reviews

# @app.route('/get-reviews', methods=['POST','GET'])
# def get_reviews():
#     data = request.json
#     url = data.get('url')

#     if not url:
#         return jsonify({"error": "URL is required"}), 400

#     browser = configure_browser()
#     try:
#         reviews_data = get_reviews_ratings(browser, url, max_reviews=20)
#         return jsonify(reviews_data)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         browser.quit()

# if _name_ == "_main_":
#     app.run(debug=True,host='0.0.0.0')