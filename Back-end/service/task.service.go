package service

import (
	//	"context"
	//	"errors"
	"encoding/json"
	"fmt"
	"strings"

	//	"strconv"
	"time"

	//	"cloud.google.com/go/firestore"
	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/iterator"

	//	"gorm.io/gorm"
	"soncong.com/ShopWeb/database"
	"soncong.com/ShopWeb/model"
	"soncong.com/ShopWeb/types"
	"soncong.com/ShopWeb/utils"
)

// Task is responsible for create Task
func CreateTask(c *fiber.Ctx) error {
	b := new(types.CreateDTO)
	if err := utils.ParseBodyAndValidate(c, b); err != nil {
		fmt.Println("khong epd ")
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	t, _ := time.Parse("20060102T150405", b.Deadline)
	if time.Now().After(t) {
		return fiber.NewError(fiber.StatusBadRequest, "Deadline should be in the future")
		
	}
	d := &model.Task{
		Task:      b.Task,
		User:      utils.GetUser(c),
		Important: b.Important,
		Urgency:   b.Urgency,
		Deadline:  t,
	}
	fmt.Println(d)
	/*if err := model.CreateTask(d).Error; err != nil {
		return fiber.NewError(fiber.StatusConflict, err.Error())
	}*/
	client, erro := database.Fapp.Firestore(c.Context())
	if erro != nil {
		fmt.Println(erro.Error())
		return fiber.NewError(fiber.StatusBadGateway, erro.Error())
	}
	defer client.Close()
	dd, err := client.Collection("users").Doc(*d.User).Get(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Wrong User")
	}
	numtasks := dd.Data()["Tasks"].(int64) + 1

	_, err = client.Collection("users").Doc(*d.User).Update(c.Context(), []firestore.Update{
		{
			Path:  "Tasks",
			Value: numtasks,
		},
	})
	d.ID = *d.User + "_" + fmt.Sprint(numtasks)
	if err != nil {
		return fiber.NewError(fiber.StatusBadGateway, "Cannot connect to user data")
	}

	_, erro = client.Collection("tasks").Doc(d.ID).Create(c.Context(), map[string]interface{}{
		"ID":        d.ID,
		"Task":      d.Task,
		"Completed": d.Completed,
		"Important": int(b.Important),
		"Urgency":   int(b.Urgency),
		"Deadline":  t,
		"CreateAt":  time.Now(),
		"UpdateAt":  time.Now(),
		"DeleteAt":  nil,
		"User":      *d.User,
	})
	if erro != nil {
		return fiber.NewError(fiber.StatusConflict, "Cannot create task")
	}
	return c.JSON(&types.TaskCreateResponse{
		Task: &types.TaskResponse{
			ID:        d.ID,
			Task:      d.Task,
			Completed: d.Completed,
			Important: b.Important,
			Urgency:   b.Urgency,
			Deadline:  t,
		},
	})
}

// GetTasks returns the Tasks list
func GetTasks(c *fiber.Ctx) error {
	d := &[]types.TaskResponse{}
	u := types.TaskResponse{}
	user := utils.GetUser(c)
	client, erro := database.Fapp.Firestore(c.Context())
	if erro != nil {
		return fiber.NewError(fiber.StatusBadGateway, erro.Error())
	}
	defer client.Close()
	docs := client.Collection("tasks").Where("User", "==", *user).Documents(c.Context())
	for {
		doc, err := docs.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return err
		}
		jsonSt, _ := json.Marshal(doc.Data())
		json.Unmarshal(jsonSt, &u)
		*d = append(*d, u)
	}
	return c.JSON(*d)
}

// GetTask return a single Task
func GetTask(c *fiber.Ctx) error {
	TaskID := c.Params("TaskID")
	user := utils.GetUser(c)
	if TaskID == "" {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Invalid TaskID")
	}
	s := strings.Split(TaskID, "_")[0]
	if s != *user {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	d := &types.TaskResponse{}
	client, erro := database.Fapp.Firestore(c.Context())
	if erro != nil {
		return fiber.NewError(fiber.StatusBadGateway, erro.Error())
	}
	defer client.Close()
	doc, err := client.Collection("tasks").Doc(TaskID).Get(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, erro.Error())
	}
	jsonSt, _ := json.Marshal(doc.Data())
	json.Unmarshal(jsonSt, d)
	return c.JSON(&types.TaskCreateResponse{
		Task: d,
	})
}

// DeleteTask deletes a single Task
func DeleteTask(c *fiber.Ctx) error {
	TaskID := c.Params("TaskID")
	if TaskID == "" {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Invalid TaskID")
	}
	user := utils.GetUser(c)
	s := strings.Split(TaskID, "_")[0]
	if s != *user {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	client, err := database.Fapp.Firestore(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}
	defer client.Close()
	_, err = client.Collection("tasks").Doc(TaskID).Delete(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusConflict, err.Error())
	}

	return c.JSON(&types.MsgResponse{
		Message: "Task successfully deleted",
	})
}

// CheckTask Task
func CheckTask(c *fiber.Ctx) error {
	b := new(types.CheckTaskDTO)
	TaskID := c.Params("TaskID")
	if TaskID == "" {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Invalid TaskID")
	}
	if err := utils.ParseBodyAndValidate(c, b); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}
	user := utils.GetUser(c)
	s := strings.Split(TaskID, "_")[0]
	if s != *user {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	client, err := database.Fapp.Firestore(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}
	defer client.Close()
	_, err = client.Collection("tasks").Doc(TaskID).Update(c.Context(), []firestore.Update{
		{
			Path:  "Completed",
			Value: b.Completed,
		},
	})
	if err != nil {
		return fiber.NewError(fiber.StatusConflict, err.Error())
	}
	return c.JSON(&types.MsgResponse{
		Message: "Task successfully updated",
	})
}

// UpdateTaskTitle Task
func UpdateTaskTitle(c *fiber.Ctx) error {
	b := new(types.CreateDTO)
	TaskID := c.Params("TaskID")

	if TaskID == "" {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Invalid TaskID")
	}

	if err := utils.ParseBodyAndValidate(c, b); err != nil {
		return err
	}
	user := utils.GetUser(c)
	s := strings.Split(TaskID, "_")[0]
	if s != *user {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}
	client, err := database.Fapp.Firestore(c.Context())
	if err != nil {
		return fiber.NewError(fiber.StatusBadGateway, err.Error())
	}
	defer client.Close()
	_, err = client.Collection("tasks").Doc(TaskID).Update(c.Context(), []firestore.Update{
		{
			Path:  "Task",
			Value: b.Task,
		},
		{
			Path:  "Important",
			Value: int32(b.Important),
		},
		{
			Path:  "Urgency",
			Value: int32(b.Urgency),
		},
		{
			Path:  "Deadline",
			Value: b.Deadline,
		},
	})
	if err != nil {
		return fiber.NewError(fiber.StatusConflict, err.Error())
	}

	return c.JSON(&types.MsgResponse{
		Message: "Task successfully updated",
	})
}
