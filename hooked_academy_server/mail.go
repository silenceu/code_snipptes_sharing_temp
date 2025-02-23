package main

import (
	"academy/google"
	"academy/mongo"
	"academy/mongo/collections/user"
	"academy/mongo/schemas"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	gin.SetMode(os.Getenv("GIN_MODE"))
	routers := gin.Default()

	err := routers.SetTrustedProxies([]string{})
	if err != nil {
		return nil
	}

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	routers.Use(cors.New(config))

	// health check
	routers.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	routers.POST("/sign_in_with_google", func(ctx *gin.Context) {
		var body struct {
			Token string `json:"token" binding:"required"`
		}
		if ctx.BindJSON(&body) == nil {
			fmt.Printf("Token %v\n", body.Token)
			tokenInfo, err := google.VerifyToken(body.Token, os.Getenv("GOOGLE_CLIENT_ID"))
			if err == nil {
				user.UpsertUser(&schemas.User{
					FirstName: tokenInfo.FamilyName,
					LastName:  tokenInfo.GivenName,
					Email:     tokenInfo.Email,
					CreatedAt: time.Now(),
				})
				ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
			} else {
				ctx.JSON(http.StatusBadRequest, gin.H{"status": "error", "err": err.Error()})
			}
		}
	})

	return routers
}

func main() {
	// Loading env file
	_ = godotenv.Load()

	mongo.GetInstance()

	router := setupRouter()

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", os.Getenv("HTTP_PORT")),
		Handler: router,
	}

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)

	go func() {
		<-quit
		log.Println("Receive interrupt signal")
		if err := srv.Close(); err != nil {
			log.Fatal("Server Close:", err)
		}
		mongo.Disconnect()
	}()

	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("listen: %s\n", err)
	}
}
