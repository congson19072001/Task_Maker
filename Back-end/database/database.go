package database

import (
	"context"
	"encoding/base64"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
	"soncong.com/ShopWeb/config"
	//"gorm.io/driver/mysql"
	//"gorm.io/gorm"
)

//var DB *gorm.DB
var err error
var Fapp *firebase.App

//const DNS = "root:19072001@tcp(127.0.0.1:3306)/mydatabase?charset=utf8mb4&parseTime=True&loc=Local"

func Initial() {
	//opt := option.WithCredentialsFile("demoshopweb-84712-firebase.json")
	// if config.FIREBASE_AUTH != "" {
	// 	rawDecodedText, _ := base64.StdEncoding.DecodeString(config.FIREBASE_AUTH)
	// 	opt := option.WithCredentialsJSON([]byte(rawDecodedText))
	// 	Fapp, err = firebase.NewApp(context.Background(), nil, opt)
	// } else {
	// 	opt := option.WithCredentialsFile("demoshopweb-84712-firebase.json")
	// 	Fapp, err = firebase.NewApp(context.Background(), nil, opt)
	// }
	rawDecodedText, _ := base64.StdEncoding.DecodeString(config.FIREBASE_AUTH)
	opt := option.WithCredentialsJSON([]byte(rawDecodedText))
	Fapp, err = firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalln("Error initializing app:", err)
	}

	// DB, err = gorm.Open(mysql.Open(DNS), &gorm.Config{})
	// if err != nil {
	// 	fmt.Println(err.Error())
	// 	panic("Cannot connect to Database")
	// }
}

// func Migrate(tables ...interface{}) error {
// 	return DB.AutoMigrate(tables...)
// }
