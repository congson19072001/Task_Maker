package model

import (
	"time"
	//	"soncong.com/ShopWeb/database"
	//	"gorm.io/gorm"
)

// Task struct defines the Task Model
type Task struct {
	ID        string    `json:"id,omitempty"`
	Task      string    `json:"task,omitempty"`
	Completed bool      `json:"completed,omitempty"`
	Important uint      `json:"important" validate:"gte=1,lte=5"`
	Urgency   uint      `json:"urgency" validate:"gte=1,lte=5"`
	Deadline  time.Time `json:"deadline"`
	CreateAt  time.Time `json:"createat,omitempty"`
	UpdateAt  time.Time `json:"updateat"`
	User      *string   `json:"userid,omitempty"`
	// this is a pointer because int == 0,
}

// CreateTask create a Task entry in the Task's table
/*func CreateTask(Task *Task) *gorm.DB {
	return database.DB.Create(Task)
}

// FindTask finds a Task with given condition
func FindTask(dest interface{}, conds ...interface{}) *gorm.DB {
	return database.DB.Model(&Task{}).Take(dest, conds...)
}

// FindTaskByUser finds a Task with given Task and user identifier
func FindTaskByUser(dest interface{}, TaskIden interface{}, userIden interface{}) *gorm.DB {
	return FindTask(dest, "id = ? AND user = ?", TaskIden, userIden)
}

// FindTasksByUser finds the Tasks with user's identifier given
func FindTasksByUser(dest interface{}, userIden interface{}) *gorm.DB {
	return database.DB.Model(&Task{}).Find(dest, "user = ?", userIden)
}

// DeleteTask deletes a Task from Tasks' table with the given Task and user identifier
func DeleteTask(TaskIden interface{}, userIden interface{}) *gorm.DB {
	return database.DB.Unscoped().Delete(&Task{}, "id = ? AND user = ?", TaskIden, userIden)
}

// UpdateTask allows to update the Task with the given TaskID and userID
func UpdateTask(TaskIden interface{}, userIden interface{}, data interface{}) *gorm.DB {
	return database.DB.Model(&Task{}).Where("id = ? AND user = ?", TaskIden, userIden).Updates(data)
}
*/
