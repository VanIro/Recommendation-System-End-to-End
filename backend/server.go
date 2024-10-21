package main

import (
	"recommendation-system-end-to-end/controllers"
	"recommendation-system-end-to-end/initializers"
	"recommendation-system-end-to-end/middlewares"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const FRONTEND_URL = "http://localhost:5173"

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()

}

func main() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{FRONTEND_URL},
		AllowMethods:     []string{"POEST", "GET"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		// AllowOriginFunc: func(origin string) bool {
		// 	return origin == "https://github.com"
		// },
		MaxAge: 12 * time.Hour,
	}))

	router.POST("/auth/signup", controllers.CreateUser)
	router.POST("/auth/login", controllers.Login)
	router.GET("/user/profile", middlewares.CheckAuth, controllers.GetUserProfile)

	router.Run()

}
