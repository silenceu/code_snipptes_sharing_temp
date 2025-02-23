package mongo

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
	"os"
	"sync"
	"time"
)

var mongoInstance *mongo.Client
var once = sync.Once{}

func GetInstance() *mongo.Client {
	once.Do(func() {
		opts := options.Client().SetServerSelectionTimeout(5 * time.Second).ApplyURI(os.Getenv("MONGODB_URL"))
		client, err := mongo.Connect(context.Background(), opts)
		if err != nil {
			log.Fatal(fmt.Sprintf("Connect to mongo failed: %s, exiting...\n", err.Error()))
		}

		// Test client connection
		err = client.Ping(context.Background(), readpref.Primary())
		if err != nil {
			log.Fatal("MongoDB connection failed, existing...\n", err)
		} else {
			log.Println("MongoDB connection established")
		}

		mongoInstance = client
	})
	go func() {
		for {
			time.Sleep(30 * time.Second)

			err := mongoInstance.Ping(context.Background(), readpref.Primary())
			if err != nil {
				if _, ok := err.(mongo.CommandError); ok {
					log.Fatal("Failed to ping MongoDB server:", err)
				} else if _, ok := err.(mongo.ServerError); ok {
					log.Fatal("MongoDB server error:", err)
				} else {
					log.Fatal("Unknown error:", err)
				}
			}
		}
	}()

	return mongoInstance
}

func Disconnect() {
	fmt.Println("Disconnect mongo ...")
	err := GetInstance().Disconnect(context.Background())
	if err != nil {
		log.Fatal(err)
	}
}
