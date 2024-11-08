package controllers

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"recommendation-system-end-to-end/initializers"
	"recommendation-system-end-to-end/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserRecommendations(c *gin.Context) {
	// Retrieve current user from context
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := currentUser.(models.User)

	// Fetch the user movie rating
	var userRatings []models.UserMovieRating
	if err := initializers.DB.Where("user_id = ?", user.ID).Find(&userRatings).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "The user's ratings not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve ratings"})
		}
		return
	}

	// Convert the ratings to the desired format [[movie_id, rating], ...]
	var ratings [][]interface{}
	for _, rating := range userRatings {
		ratings = append(ratings, []interface{}{rating.MovieID, rating.Rating})
	}

	// Prepare the payload for the prediction request
	payload := gin.H{"ratings": ratings}

	// Convert payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode request"})
		return
	}

	// Make a POST request to the prediction endpoint
	predictionURL := "http://localhost:5000/predict"
	resp, err := http.Post(predictionURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get predictions"})
		return
	}
	defer resp.Body.Close()

	// Read and forward the response from the prediction service
	var recommendations map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&recommendations); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse prediction response"})
		return
	}

	c.JSON(http.StatusOK, recommendations)

}
