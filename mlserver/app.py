import joblib
import numpy as np
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from time import time
# from flask_profiler import Profiler

from prediction_utilities import recommend_new_user

# Initialize the Flask app and logging
app = Flask(__name__)

# Enable logging to console and to file
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS settings (allow requests only from a specific origin)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Initialize Flask-Profiler (for monitoring performance)
# Profiler(app)

@app.before_request
def log_request_info():
    logger.info(f"Request Headers: {request.headers}")
    logger.info(f"Request Data: {request.get_data()}")

@app.after_request
def log_response_info(response):
    # Log the response time and status code
    logger.info(f"Response Status: {response.status}")
    return response

@app.route('/predict', methods=['POST'])
def predict():
    start_time = time()  # Start the timer for response time

    if not request.is_json:
        return jsonify({"error": "Invalid input, JSON data expected"}), 400

    try:
        # Parse the incoming JSON data
        data = request.get_json()
        print("input:", data)

        recommendations = recommend_new_user(data['ratings'])
        print("output:", recommendations)

        # Log the response time
        end_time = time()
        response_time = end_time - start_time
        logger.info(f"Prediction took {response_time:.4f} seconds")

        # Return the prediction in JSON format
        return jsonify({"recommendations": recommendations, "response_time": response_time})

    except Exception as e:
        # Log any exceptions that occur during the prediction
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the app with profiling enabled
    app.run(debug=True)
