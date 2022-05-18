import Task from './Task'
import moment from 'moment';

const Tasks = ({ tasks, onDelete , getTasks }) => {
  return (
    <>
      {tasks.map((task, index) => (
        <Task key={index} Task_id={task.id} checked={task.completed} task={task.task} urgency={task.urgency} 
        importance={task.important} deadline={moment(task.deadline).format("YYYY-MM-DD HH:mm")} onDelete={onDelete} getTasks={getTasks} />
      ))}
    </>
  )
}

export default Tasks
