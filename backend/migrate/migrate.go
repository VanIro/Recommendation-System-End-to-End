package main

import (
	"recommendation-system-end-to-end/initializers"
	"recommendation-system-end-to-end/models"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

}

func main() {

	initializers.DB.AutoMigrate(&models.User{})
}
