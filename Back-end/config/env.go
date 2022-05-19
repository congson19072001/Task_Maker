package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var (
	// PORT returns the server listening port
	PORT = getEnv("PORT", "5000")
	// DB returns the name of the sqlite database
	DB = getEnv("DB", "gotodo.db")
	// TOKENKEY returns the jwt token secret
	TOKENKEY = getEnv("TOKEN_KEY", "laksdjflkasjfwj92jfslj2qu0-9apsoifjk")
	// TOKENEXP returns the jwt token expiration duration.

	// Should be time.ParseDuration string. Source: https://golang.org/pkg/time/#ParseDuration
	// default: 10h
	TOKENEXP      = getEnv("TOKEN_EXP", "10h")
	FIREBASE_AUTH = getEnv("FIREBASE_AUTH", "")
)

func getEnv(name string, fallback string) string {
	envErr := godotenv.Load(".env")
	if envErr != nil {
		fmt.Printf("Could not load .env file")
		os.Exit(1)
	}
	envMap, mapErr := godotenv.Read(".env")
	if mapErr != nil {
		fmt.Printf("Error loading .env into map[string]string\n")
		os.Exit(1)
	} else {
		return envMap[name]
	}

	if fallback != "" {
		return fallback
	}

	panic(fmt.Sprintf(`Environment variable not found :: %v`, name))
}
