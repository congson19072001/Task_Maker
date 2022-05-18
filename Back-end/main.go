package main

import (
	"fmt"
	
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"soncong.com/ShopWeb/config"
	"soncong.com/ShopWeb/router"
	"soncong.com/ShopWeb/utils"
	"soncong.com/ShopWeb/database"
)

func main() {
	app := fiber.New(fiber.Config{
		ErrorHandler: utils.ErrorHandler,
	})

	database.Initial()
	app.Use(cors.New())
	app.Use(logger.New())

	router.SetupRoutes(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World 👋!")
	})

	app.Listen(fmt.Sprintf(":%v", config.PORT))

}
