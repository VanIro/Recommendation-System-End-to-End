package models

import (
	"time"
)

type UserMovieRatingTag struct {
	ID uint `json:"id" gorm:"primary_key"`

	UserMovieRatingID uint   `json:"movie_id" gorm:"not null;uniqueIndex:userMovieRating_TagWord"`
	TagWord           string `json:"tag_word" gorm:"not null;uniqueIndex:userMovieRating_TagWord"`
	CreatedAt         time.Time
	UpdatedAt         time.Time

	// Associations
	UserMovieRating UserMovieRating `gorm:"foreignKey:UserMovieRatingID;constraint:OnDelete:CASCADE;"`

	// Ensure each user can only have one rating per movie
	UniqueIndex string `gorm:"uniqueIndex:userMovieRating_TagWord"`
}
