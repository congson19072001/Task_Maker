package types

import "time"

// TaskResponse struct contains the Task field which should be returned in a response
type TaskResponse struct {
	ID        string    `json:"id"`
	Task      string    `json:"task"`
	Completed bool      `json:"completed"`
	Important uint      `json:"important" validate:"gte=1,lte=5"`
	Urgency   uint      `json:"urgency" validate:"gte=1,lte=5"`
	Deadline  time.Time `json:"deadline"`
	CreateAt  time.Time `json:"createat"`
	UpdateAt  time.Time `json:"updateat"`
}

// CreateDTO struct defines the /Task/create payload
type CreateDTO struct {
	Task      string `json:"task" validate:"required,min=3,max=150"`
	Important uint   `json:"important" validate:"required,gte=1,lte=5"`
	Urgency   uint   `json:"urgency" validate:"required,gte=1,lte=5"`
	Deadline  string `json:"deadline"`
}

// TaskCreateResponse struct defines the /Task/create response
type TaskCreateResponse struct {
	Task *TaskResponse `json:"Task"`
}

// TasksResponse defines the Tasks list
type TasksResponse struct {
	Tasks *[]TaskResponse `json:"Tasks"`
}

// CheckTaskDTO defined the payload for the check Task
type CheckTaskDTO struct {
	Completed bool `json:"completed"`
}
