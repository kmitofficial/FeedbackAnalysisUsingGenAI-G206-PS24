import spacy
# import rake_nltk
# from collections import Counter
# from typing import List, Dict

# class ImprovedReviewKeyPhraseExtractor:
#     def __init__(self, 
#                  min_length: int = 2, 
#                  max_length: int = 3, 
#                  top_n_phrases: int = 10, 
#                  language_model: str = 'en_core_web_sm'):
#         """
#         Initialize the key phrase extractor with advanced configuration.
        
#         Args:
#             min_length (int): Minimum number of words in a key phrase
#             max_length (int): Maximum number of words in a key phrase
#             top_n_phrases (int): Number of top overall phrases to extract
#             language_model (str): spaCy language model to use
#         """
#         # Load spaCy model
#         self.nlp = spacy.load(language_model)
        
#         # Initialize RAKE
#         self.rake = rake_nltk.Rake(
#             min_length=min_length,
#             max_length=max_length,
#             include_repeated_phrases=False
#         )
        
#         self.top_n_phrases = top_n_phrases
    
#     def preprocess_text(self, text: str) -> str:
#         """
#         Preprocess the text by removing stop words and lemmatizing
        
#         Args:
#             text (str): Input review text
        
#         Returns:
#             str: Preprocessed text
#         """
#         # Remove stop words and lemmatize
#         doc = self.nlp(text)
#         processed_tokens = [
#             token.lemma_.lower() 
#             for token in doc 
#             if not token.is_stop and token.is_alpha and len(token.lemma_) > 1
#         ]
#         return ' '.join(processed_tokens)
    
#     def extract_key_phrases(self, reviews: List[str]) -> List[Dict[str, float]]:
#         """
#         Extract key phrases from a list of reviews
        
#         Args:
#             reviews (List[str]): List of review texts
        
#         Returns:
#             List of top key phrases across all reviews
#         """
#         all_phrases = []
        
#         for review in reviews:
#             # Preprocess the review
#             processed_review = self.preprocess_text(review)
            
#             # Extract key phrases using RAKE
#             self.rake.extract_keywords_from_text(processed_review)
            
#             # Get phrases with their scores
#             phrases = self.rake.get_ranked_phrases_with_scores()
            
#             # Add to overall phrases
#             all_phrases.extend(phrase for _, phrase in phrases)
        
#         # Count and rank overall phrases
#         phrase_counts = Counter(all_phrases)
        
#         # Sort phrases by frequency and return top phrases
#         top_phrases = sorted(
#             [
#                 {"phrase": phrase, "frequency": count} 
#                 for phrase, count in phrase_counts.items()
#             ], 
#             key=lambda x: x['frequency'], 
#             reverse=True
#         )[:self.top_n_phrases]
        
#         return top_phrases

# def main():
#     # Your reviews
#     reviews = [
        
#     ]
    
#     # Initialize extractor
#     extractor = ImprovedReviewKeyPhraseExtractor()
    
#     # Extract key phrases
#     top_key_phrases = extractor.extract_key_phrases(reviews)
    
#     # Print results
#     print("Top Key Phrases Across Reviews:")
#     for item in top_key_phrases:
#         print(f"- {item['phrase']} (Frequency: {item['frequency']})")

# if __name__ == "__main__":
#     main()