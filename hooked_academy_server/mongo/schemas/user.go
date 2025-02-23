package schemas

import "time"

type User struct {
	FirstName string    `json:"firstName,omitempty" bson:"firstName,omitempty"`
	LastName  string    `json:"lastName,omitempty" bson:"lastName,omitempty"`
	Email     string    `json:"email,omitempty" bson:"email,omitempty"`
	CreatedAt time.Time `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}
