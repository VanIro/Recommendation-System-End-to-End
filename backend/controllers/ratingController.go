package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"recommendation-system-end-to-end/initializers"
	"recommendation-system-end-to-end/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateUserMovieRating(c *gin.Context) {
	// Retrieve current user from context
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := currentUser.(models.User)

	// Parse the request body
	var input struct {
		MovieID  uint     `json:"movie_id"`
		Rating   float64  `json:"rating"`
		Opinion  string   `json:"opinion"`
		Tags     []string `json:"tags"`
		Category string   `json:"category"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Check if the rating already exists
	var userMovieRating models.UserMovieRating
	if err := initializers.DB.Where("user_id = ? AND movie_id = ?", user.ID, input.MovieID).First(&userMovieRating).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check for existing rating"})
			return
		}
	}
	// If rating exists, update it
	if userMovieRating.ID != 0 {
		userMovieRating.Rating = input.Rating
		userMovieRating.MovieOpinion = input.Opinion
		if userMovieRating.Category == "" {
			userMovieRating.Category = input.Category
		}
		if err := initializers.DB.Save(&userMovieRating).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update rating"})
			return
		}

		// Update tags
		if err := setNewTagsOnRating(userMovieRating.ID, input.Tags); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tags"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Rating updated successfully", "rating": userMovieRating})
	} else {
		// If rating doesn't exist, create it
		userMovieRating = models.UserMovieRating{
			UserID:       user.ID,
			MovieID:      input.MovieID,
			Rating:       input.Rating,
			MovieOpinion: input.Opinion,
			Category:     input.Category,
		}
		if err := initializers.DB.Create(&userMovieRating).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create rating"})
			return
		}
		// Add tags if provided
		for _, tag := range input.Tags {
			tagRecord := models.UserMovieRatingTag{
				UserMovieRatingID: userMovieRating.ID,
				TagWord:           tag,
			}
			initializers.DB.Create(&tagRecord)
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Rating created successfully", "rating": userMovieRating})
	}
}

func GetUserRatings(c *gin.Context) {

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

	// Prepare the response data
	response := gin.H{"ratings": userRatings}

	// Respond with the user ratings as JSON
	c.JSON(http.StatusOK, response)

}

func GetUserMovieRating(c *gin.Context) {
	// Retrieve current user from context
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := currentUser.(models.User)

	// Parse movie ID from query or path parameter
	movieID, err := strconv.ParseUint(c.Query("movie_id"), 10, 32)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID", "movie_id": c.Query("movie_id")})
		return
	}

	// Fetch the user movie rating
	var userMovieRating models.UserMovieRating
	if err := initializers.DB.Where("user_id = ? AND movie_id = ?", user.ID, uint(movieID)).First(&userMovieRating).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Rating not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve rating"})
		}
		return
	}

	// Fetch associated tags for the rating
	var tags []models.UserMovieRatingTag
	if err := initializers.DB.Where("user_movie_rating_id = ?", userMovieRating.ID).Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tags"})
		return
	}

	// Prepare the response data
	response := gin.H{
		"rating":  userMovieRating.Rating,
		"opinion": userMovieRating.MovieOpinion,
		"tags":    make([]string, len(tags)),
	}

	for i, tag := range tags {
		response["tags"].([]string)[i] = tag.TagWord
	}

	c.JSON(http.StatusOK, response)
}

func DeleteUserMovieRating(c *gin.Context) {
	// Retrieve current user from context
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}
	user := currentUser.(models.User)

	// Parse movie ID from query or path parameter
	movieID, err := strconv.ParseUint(c.Query("movie_id"), 10, 32)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie ID", "movie_id": c.Query("movie_id")})
		return
	}

	// Fetch the user movie rating
	var userMovieRating models.UserMovieRating
	if err := initializers.DB.Where("user_id = ? AND movie_id = ?", user.ID, uint(movieID)).First(&userMovieRating).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Rating not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve rating"})
		}
		return
	}

	// Fetch associated tags for the rating
	var tags []models.UserMovieRatingTag
	if err := initializers.DB.Where("user_movie_rating_id = ?", userMovieRating.ID).Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tags"})
		return
	}

	// Delete associated tags
	if len(tags) > 0 {
		if err := initializers.DB.Where("user_movie_rating_id = ?", userMovieRating.ID).Delete(&models.UserMovieRatingTag{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tags"})
			return
		}
	}

	// Delete the user movie rating
	if err := initializers.DB.Delete(&userMovieRating).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete rating"})
		return
	}

	// Return a success message
	c.JSON(http.StatusOK, gin.H{"message": "Rating deleted successfully"})
}

func AddTagToRating(c *gin.Context) {
	var input struct {
		RatingID uint   `json:"rating_id"`
		TagWord  string `json:"tag"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	tag := models.UserMovieRatingTag{
		UserMovieRatingID: input.RatingID,
		TagWord:           input.TagWord,
	}

	if err := initializers.DB.Create(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add tag"})
		return
	}

	c.JSON(http.StatusCreated, tag)
}

func DeleteTagFromRating(c *gin.Context) {
	var input struct {
		RatingID uint   `json:"rating_id"`
		TagWord  string `json:"tag"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := initializers.DB.Where("user_movie_rating_id = ? AND tag_word = ?", input.RatingID, input.TagWord).Delete(&models.UserMovieRatingTag{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete tag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tag deleted"})
}

func setNewTagsOnRating(ratingID uint, newTags []string) error {
	// Retrieve existing tags from the database
	var oldTags []models.UserMovieRatingTag
	if err := initializers.DB.Where("user_movie_rating_id = ?", ratingID).Find(&oldTags).Error; err != nil {
		return err
	}

	// Convert old tags and new tags to maps for quick lookup
	oldTagsMap := make(map[string]bool)
	for _, tag := range oldTags {
		oldTagsMap[tag.TagWord] = true
	}

	newTagsMap := make(map[string]bool)
	for _, tag := range newTags {
		newTagsMap[tag] = true
	}

	// Identify tags to delete (present in oldTagsMap but not in newTagsMap)
	tagsToDelete := []string{}
	for oldTag := range oldTagsMap {
		if !newTagsMap[oldTag] {
			tagsToDelete = append(tagsToDelete, oldTag)
		}
	}

	// Identify tags to add (present in newTagsMap but not in oldTagsMap)
	tagsToAdd := []string{}
	for newTag := range newTagsMap {
		if !oldTagsMap[newTag] {
			tagsToAdd = append(tagsToAdd, newTag)
		}
	}

	// Start a transaction
	tx := initializers.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Delete old tags that are no longer needed within the transaction
	if len(tagsToDelete) > 0 {
		if err := tx.Where("user_movie_rating_id = ? AND tag_word IN ?", ratingID, tagsToDelete).
			Delete(&models.UserMovieRatingTag{}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Add new tags within the transaction
	for _, tag := range tagsToAdd {
		tagRecord := models.UserMovieRatingTag{
			UserMovieRatingID: ratingID,
			TagWord:           tag,
		}
		if err := tx.Create(&tagRecord).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit the transaction if everything is successful
	return tx.Commit().Error
}

func EditTagOnRating(c *gin.Context) {
	var input struct {
		RatingID uint   `json:"rating_id"`
		OldTag   string `json:"old_tag"`
		NewTag   string `json:"new_tag"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Delete the old tag
	initializers.DB.Where("user_movie_rating_id = ? AND tag_word = ?", input.RatingID, input.OldTag).Delete(&models.UserMovieRatingTag{})

	// Add the new tag
	newTag := models.UserMovieRatingTag{
		UserMovieRatingID: input.RatingID,
		TagWord:           input.NewTag,
	}
	if err := initializers.DB.Create(&newTag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update tag"})
		return
	}

	c.JSON(http.StatusOK, newTag)
}

func GetTagsForRating(c *gin.Context) {
	ratingID := c.Param("rating_id")
	var tags []models.UserMovieRatingTag

	if err := initializers.DB.Where("user_movie_rating_id = ?", ratingID).Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tags"})
		return
	}

	c.JSON(http.StatusOK, tags)
}
