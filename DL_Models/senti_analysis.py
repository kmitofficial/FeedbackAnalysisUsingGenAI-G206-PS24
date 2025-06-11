import torch
import pickle
import numpy as np
from torch import nn
from sklearn.feature_extraction.text import TfidfVectorizer

# Load the saved TfidfVectorizer
with open('tfidf_vectorizer.pkl', 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

# Define the model class (should match the class used during training)
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

# Load the saved model
model = torch.load('best_model.pth')
model.eval()

# Function to predict sentiment of a new review
def predict_review(review):
    # Transform the review into TF-IDF vector
    review_tfidf = tfidf_vectorizer.transform([review]).toarray()

    # Convert to tensor
    inputs = torch.tensor(review_tfidf, dtype=torch.float32)

    # Predict sentiment
    with torch.no_grad():
        outputs = model(inputs)
        _, predicted = torch.max(outputs, 1)
        probabilities = torch.softmax(outputs, dim=1).squeeze().numpy()

    predicted_label = predicted.item()
    return predicted_label, probabilities

# Example usage
review = "This product is waste of money."
label_mapping = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}  # Adjust according to your dataset's labels

predicted_label, probabilities = predict_review(review)
print(f'The review sentiment is: {label_mapping[predicted_label]}')
print(f'Probabilities of each class: {probabilities}')
