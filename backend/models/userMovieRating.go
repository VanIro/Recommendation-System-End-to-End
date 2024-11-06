package models

import (
	"time"
)

type UserMovieRating struct {
	ID           uint    `json:"id" gorm:"primary_key"`
	UserID       uint    `json:"user_id" gorm:"not null;uniqueIndex:idx_user_movie"`
	MovieID      uint    `json:"movie_id" gorm:"not null;uniqueIndex:idx_user_movie"`
	Rating       float64 `json:"rating"`
	MovieOpinion string  `json:"movie_opinion"`
	CreatedAt    time.Time
	UpdatedAt    time.Time

	// Associations
	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`

	// Ensure each user can only have one rating per movie
	UniqueIndex string `gorm:"uniqueIndex:idx_user_movie"`
}
