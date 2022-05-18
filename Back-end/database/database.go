package database

import (
	"context"
	//"fmt"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
	//"gorm.io/driver/mysql"
	//"gorm.io/gorm"
)

//var DB *gorm.DB
var err error
var Fapp *firebase.App

//const DNS = "root:19072001@tcp(127.0.0.1:3306)/mydatabase?charset=utf8mb4&parseTime=True&loc=Local"

func Initial() {
	opt := option.WithCredentialsFile("demoshopweb-84712-firebase.json")
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
