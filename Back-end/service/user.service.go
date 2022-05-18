package service

import (
	//"errors"

	"math/rand"
	"time"
	"unsafe"
	"github.com/gofiber/fiber/v2"

	//"gorm.io/gorm"
	"soncong.com/ShopWeb/database"
	"soncong.com/ShopWeb/types"
	"soncong.com/ShopWeb/utils"
	"soncong.com/ShopWeb/utils/jwt"
	"soncong.com/ShopWeb/utils/password"
)

const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const (
	letterIdxBits = 6                    // 6 bits to represent a letter index
	letterIdxMask = 1<<letterIdxBits - 1 // All 1-bits, as many as letterIdxBits
	letterIdxMax  = 63 / letterIdxBits   // # of letter indices fitting in 63 bits
)

var src = rand.NewSource(time.Now().UnixNano())

func RandStringBytes(n int) string {
	b := make([]byte, n)
	// A src.Int63() generates 63 random bits, enough for letterIdxMax characters!
	for i, cache, remain := n-1, src.Int63(), letterIdxMax; i >= 0; {
		if remain == 0 {
			cache, remain = src.Int63(), letterIdxMax
		}
		if idx := int(cache & letterIdxMask); idx < len(letterBytes) {
			b[i] = letterBytes[idx]
			i--
		}
		cache >>= letterIdxBits
		remain--
	}

	return *(*string)(unsafe.Pointer(&b))
}

// Login service logs in a user
func Login(ctx *fiber.Ctx) error {
	b := new(types.LoginDTO)

	if err := utils.ParseBodyAndValidate(ctx, b); err != nil {
		return err
	}

	u := &types.UserResponse{}

	/*	err := model.FindUserByEmail(u, b.Email).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid email or password")
		}
	*/
	client, erro := database.Fapp.Firestore(ctx.Context())
	if erro != nil {

		return fiber.NewError(fiber.StatusConflict, erro.Error())
	}
	defer client.Close()
	iter := client.Collection("users").Where("Email", "==", b.Email).Documents(ctx.Context())
	doc, err := iter.Next()
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "No user with that email exists")
	}
	daa := doc.Data()
	u.ID = daa["ID"].(string)
	u.Name = daa["Name"].(string)
	u.Email = daa["Email"].(string)
	u.Password = daa["Password"].(string)

	if err := password.Verify(u.Password, b.Password); err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid email or password"+" u : "+u.Password+" b: "+b.Password)
	}

	t := jwt.Generate(&jwt.TokenPayload{
		ID: u.ID,
	})

	return ctx.JSON(&types.AuthResponse{
		User: u,
		Auth: &types.AccessResponse{
			Token: t,
		},
	})
}

// Signup service creates a user
func Signup(ctx *fiber.Ctx) error {
	b := new(types.SignupDTO)

	if err := utils.ParseBodyAndValidate(ctx, b); err != nil {
		return err
	}

	/*err := model.FindUserByEmail(&struct{ ID uint }{}, b.Email).Error

	// If email already exists, return
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fiber.NewError(fiber.StatusConflict, "Email already exists")
	}*/
	client, erro := database.Fapp.Firestore(ctx.Context())
	if erro != nil {

		return fiber.NewError(fiber.StatusConflict, erro.Error())
	}
	defer client.Close()
	iter := client.Collection("users").Where("Email", "==", b.Email).Documents(ctx.Context())
	_, err := iter.Next()
	if err == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "user with that email is already exists")
	}

	user := &types.UserResponse{
		ID:       RandStringBytes(20),
		Name:     b.Name,
		Password: password.Generate(b.Password),
		Email:    b.Email,
		Tasks:    0,
		CreateAt: time.Now(),
		UpdateAt: time.Now(),
	}
	_, erro = client.Collection("users").Doc(user.ID).Create(ctx.Context(), map[string]interface{}{
		"ID":       user.ID,
		"Name":     user.Name,
		"Password": user.Password,
		"Email":    user.Email,
		"Tasks":    0,
		"CreateAt": user.CreateAt,
		"UpdateAt": user.UpdateAt,
	})
	if erro != nil {
		return fiber.NewError(fiber.StatusConflict, erro.Error())
	}
	/*
		// Create a user, if error return
		if err := model.CreateUser(user); err.Error != nil {
			return fiber.NewError(fiber.StatusConflict, err.Error.Error())
		}*/

	// generate access token
	t := jwt.Generate(&jwt.TokenPayload{
		ID: user.ID,
	})

	return ctx.JSON(&types.AuthResponse{
		User: &types.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		},
		Auth: &types.AccessResponse{
			Token: t,
		},
	})
}
