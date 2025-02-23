package google

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"google.golang.org/api/idtoken"
)

type TokenInfo struct {
	Aud           string `json:"aud,omitempty"`
	Azp           string `json:"azp,omitempty"`
	Email         string `json:"email,omitempty"`
	EmailVerified bool   `json:"email_verified,omitempty"`
	Exp           int32  `json:"exp,omitempty"`
	FamilyName    string `json:"family_name,omitempty"`
	GivenName     string `json:"given_name,omitempty"`
	Iat           int32  `json:"iat,omitempty"`
	Iss           string `json:"iss,omitempty"`
	Locale        string `json:"locale,omitempty"`
	Name          string `json:"name,omitempty"`
	Picture       string `json:"picture,omitempty"`
	Sub           string `json:"sub,omitempty"`
	Nbf           int32  `json:"nbf,omitempty"`

}

func VerifyToken(token string, clientId string) (*TokenInfo, error) {
	payload, err := idtoken.Validate(context.Background(), token, clientId)
	if err != nil {
		err := errors.New(fmt.Sprintf("Validate token %v failed with %v", token, clientId))
		return nil, err
	}
	var tokenInfo TokenInfo
	tokenStr, _ := json.Marshal(payload.Claims)

	if err := json.Unmarshal(tokenStr, &tokenInfo); err != nil {
		return &TokenInfo{}, nil
	}
	return &tokenInfo, nil
}
