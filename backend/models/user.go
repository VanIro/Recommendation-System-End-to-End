// models/user.go

package models

import (
	"time"
)

type User struct {
	ID        uint   `json:"id" gorm:"primary_key"`
	Email     string `json:"email" gorm:"unique"`
	Firstname string `json:"firstname" gorm:"unique"`
	Password  string `json:"password"`
	CreatedAt time.Time
	UpdatedAt time.Time

	//Received Associations
	Ratings []UserMovieRating `gorm:"foreignKey:UserID"`
}
