package router

import (
	"soncong.com/ShopWeb/service"
	"soncong.com/ShopWeb/utils/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes setup router api
func SetupRoutes(app *fiber.App) {
	// Middleware
	//app.Get("/", handler.Hello)

	//User
	user := app.Group("/user")
	//	user.Get("/:id", service.GetUser)
	user.Post("/login", service.Login)
	user.Post("/signup", service.Signup)
	//	user.Post("/", handler.CreateUser)

	//Task
	Task := app.Group("/task").Use(middleware.Auth)

	Task.Post("/create", service.CreateTask)
	Task.Get("/list", service.GetTasks)
	Task.Get("/:TaskID", service.GetTask)
	Task.Put("/:TaskID", service.UpdateTaskTitle)
	Task.Patch("/:TaskID/check", service.CheckTask)
	Task.Delete("/:TaskID", service.DeleteTask)
}
