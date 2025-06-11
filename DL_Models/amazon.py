
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
# Download necessary NLTK resources (if not already downloaded)
nltk.download('stopwords')
nltk.download('punkt')

app = Flask(__name__)

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

options = Options()
options.add_argument("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0")
webdriver_service = Service(r"C:\Users\siddh\Downloads\edgedriver_win64\msedgedriver.exe")

API_KEY = "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"
API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": f"Bearer {API_KEY}"}

def get_driver():
    return webdriver.Edge(service=webdriver_service, options=options)

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
    with open('tfidf_vectorizer.pkl', 'rb') as f:
        tfidf_vectorizer = pickle.load(f)

    

    model = torch.load('best_model.pth')
    model.eval()

    def predict_review(review):
        review_tfidf = tfidf_vectorizer.transform([review]).toarray()

        inputs = torch.tensor(review_tfidf, dtype=torch.float32)

        with torch.no_grad():
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            probabilities = torch.softmax(outputs, dim=1).squeeze().numpy()

        predicted_label = predicted.item()
        return predicted_label, probabilities

    review = "This product is waste of money."
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



def get_reviews_from_focal_reviews_section(url):
    browser = get_driver()
    reviews = {'review_text': [], 'rating': []}

    def open_url(url):
        browser.get(url)
        sleep(3)

    def get_reviewtext_and_ratings():
        try:
            focal_reviews_section = browser.find_element(By.CLASS_NAME, "cr-widget-FocalReviews")
            
            review_elements = focal_reviews_section.find_elements(By.CSS_SELECTOR, 'span[data-hook="review-body"]')
            for item in review_elements:
                body = item.text
                if len(reviews["review_text"]) >= 20:
                    break
                reviews['review_text'].append(body if body else None)

            rating_elements = focal_reviews_section.find_elements(By.CSS_SELECTOR, '.review-rating')
            for value in rating_elements:
                rating = value.get_attribute('textContent').replace(' out of 5 stars', '')
                try:
                    rating = float(rating)
                    if len(reviews["rating"]) >= 20:
                        break
                    reviews['rating'].append(rating)
                except ValueError:
                    reviews['rating'].append(None)
        except Exception as e:
            print(f"Error extracting focal reviews: {e}")

    open_url(url)
    get_reviewtext_and_ratings()
    browser.quit()

    while len(reviews['review_text']) > len(reviews['rating']):
        reviews['rating'].append(None)
    while len(reviews['rating']) > len(reviews['review_text']):
        reviews['review_text'].append(None)

    return reviews


@app.route('/reviews', methods=['POST'])
def reviews():
    data = request.get_json()
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required in the JSON body"}), 400
    
    try:
        reviews_data = {"get_reviews": [], "keywords": {}, "sentiments":{}, "summary":{}}
        reviews_data['get_reviews'] = get_reviews_from_focal_reviews_section(url)
        # reviews_data['get_reviews'] = send_data(url)
        # uuu = "http://172.28.0.12:5000/analyze_sentiment"
        # print(reviews_data['get_reviews']['review_text'])
        reviews_data['sentiments'] = getSentiment(reviews_data['get_reviews']['review_text'])
        reviews_data["summary"] = summarize_reviews(reviews_data['get_reviews']['review_text'])
        reviews_data['keywords'] = extract_unique_keywords(reviews_data["summary"])
        print(reviews_data)
        return jsonify(reviews_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)