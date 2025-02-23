package user

import (
	"academy/mongo"
	"academy/mongo/schemas"
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

func UpsertUser(user *schemas.User) *schemas.User {
	ctx := context.Background()
	userCollection := mongo.GetInstance().Database(os.Getenv("DB_NAME")).Collection("users")
	opts := options.FindOneAndUpdate().SetUpsert(true)
	findRes := userCollection.FindOne(ctx, bson.M{"email": user.Email})

	var filter bson.M
	var existingUser schemas.User
	// no error means found the existing user
	if findRes.Err() == nil {
		if err := findRes.Decode(&existingUser); err != nil {
			return nil
		}
		user.CreatedAt = existingUser.CreatedAt
		filter = bson.M{"email": user.Email, "createdAt": existingUser.CreatedAt}
	} else {
		filter = bson.M{"email": user.Email}
	}
	update := bson.M{"$set": user}
	result := userCollection.FindOneAndUpdate(ctx, filter, update, opts)

	var newUser schemas.User

	if err := result.Decode(&newUser); err != nil {
		return &schemas.User{}
	}
	return &newUser
}
