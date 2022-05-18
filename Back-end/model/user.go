package model

import (
	//	"gorm.io/gorm"
	"time"
	//	"soncong.com/ShopWeb/database"
)

// User struct
type User struct {
	ID       string    `json:"id,omitempty"`
	Name     string    `json:"name,omitempty"`
	Email    string    `json:"email,omitempty"`
	Password string    `json:"-"`
	Tasks    uint      `json:"tasks" default:"0"`
	CreateAt time.Time `json:"createat,omitempty"`
	UpdateAt time.Time `json:"updateat"`
}

/*
// CreateUser create a user entry in the user's table
func CreateUser(user *User) *gorm.DB {
	return database.DB.Create(user)
}

// FindUser searches the user's table with the condition given
func FindUser(dest interface{}, conds ...interface{}) *gorm.DB {
	return database.DB.Model(&User{}).Take(dest, conds...)
}

// FindUserByEmail searches the user's table with the email given
func FindUserByEmail(dest interface{}, email string) *gorm.DB {
	return FindUser(dest, "email = ?", email)
}

// FindUserById searches the user's table with the id given
func FindUserById(dest interface{}, id uint) *gorm.DB {
	return FindUser(dest, "ID = ?", id)
}
*/
