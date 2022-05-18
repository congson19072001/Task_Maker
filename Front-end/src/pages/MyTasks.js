import { React, useState,useEffect} from 'react'
import { AiOutlinePlus ,AiOutlineInfo} from "react-icons/ai";
import { Layout,Row, Col,Checkbox, Button  } from 'antd';
import Tasks from "../component/Tasks"

const { Content } = Layout;

/** Todolist
 * 
 * @returns page of Tasks manager, including:
 * create app in 4 different boxes, with args
 * name, deadline, importance and urgency level,
 * deadline, and reminder option
 * View tasks in minimum detail but great info
 * Update app with detail menu in every box
 * Delete tasks into seperate box, these tasks
 * will disappear permanently within 7 days
 * All require token authorization
 */


const MyTasks = () => {
    let tasks
    const [tasks1, setTasks1] = useState([])
    const [tasks2, setTasks2] = useState([])
    const [tasks3, setTasks3] = useState([])
    const [tasks4, setTasks4] = useState([])
    const getTasks = async () => {
        if(localStorage.getItem("accessToken") ){
        const tasksFromServer = await fetchTasks()
        tasks = tasksFromServer
        setTasks1(tasks.filter(task=>(task.important<4 && task.urgency<4)))
        setTasks2(tasks.filter(task=>(task.important<4 && task.urgency>3)))
        setTasks3(tasks.filter(task=>(task.important>3 && task.urgency<4)))
        setTasks4(tasks.filter(task=>(task.important>3 && task.urgency>3)))
        }
    }
    useEffect( async() => {
        if(localStorage.getItem("accessToken") ){
            const tasksFromServer = await fetchTasks()
            tasks = tasksFromServer
            setTasks1(tasks.filter(task=>(task.important<4 && task.urgency<4)))
            setTasks2(tasks.filter(task=>(task.important<4 && task.urgency>3)))
            setTasks3(tasks.filter(task=>(task.important>3 && task.urgency<4)))
            setTasks4(tasks.filter(task=>(task.important>3 && task.urgency>3)))
            console.log(tasks)

        }
        
        
  }, [])

  // get all tasks from server
    const fetchTasks = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("accessToken"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch("https://task-maker-1907.herokuapp.com" + "/task/list", requestOptions)
        const data = await response.json()
        return data
    }
   // delete a task with id
   const deleteTask = async (id) => {
       var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("accessToken"));
        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
    fetch(`https://task-maker-1907.herokuapp.com/task/${id}`,requestOptions )
    .then(response => response.json())
    .then(result => {
        console.log(result)
        getTasks()
    })
    //We should control the response status to decide if we will change the state or not.
    
  }
  const addForm = () => {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("accessToken"));
      myHeaders.append("Content-Type", "application/json");
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "task": "new task",
                "important": 1,
                "urgency": 1,
                "deadline": (tomorrow.getFullYear() + ("0"+(tomorrow.getMonth()+1)).slice(-2) + ("0" + tomorrow.getDate()).slice(-2)
                + "T" + ("0" + tomorrow.getHours()).slice(-2) + ("0" + tomorrow.getMinutes()).slice(-2) + "05").toString(),
            })
        };
        fetch("https://task-maker-1907.herokuapp.com" + "/task/create", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            getTasks()
        })
  }
    return (
        <Content style={{ padding: '0 0.5vw', backgroundColor:"#f9f9f9" }}>
           <div className="TaskManager">
            <Row>
                <Col  span={11} offset={1}>
                    <div className="titlebar i1_u1">
                        <h5>Task I : Urgent and Important</h5>
                        
                        <div className="avatar">
                        <Button style={{backgroundColor:'#242529', borderColor:'#242529'}} size="small" type="primary" shape="circle" icon={<AiOutlineInfo  style={{position: 'relative', fontSize:'16'}} />}  />
                        </div>
                    </div>
                    <Button onClick={addForm} style={{ display:'block',position: 'absolute', margin:"36vh auto auto 39vw"}} size="large" type="primary" shape="circle" icon={<AiOutlinePlus  style={{position: 'relative', fontSize:'27'}} />}  />
                    <div className="TaskBox" id="Task_1">
                    {tasks1.length > 0 ? (
                    <Tasks tasks={tasks1} onDelete={async(id)=> { await deleteTask(id); }} getTasks = {async () => {await getTasks();}}/>) : ('No Tasks To Show') }
                    </div>
                </Col>
                <Col  span={11} offset={1}>
                <div className="titlebar i1_u5">
                        <h5>Task II : Not Urgent, Important</h5>
                        <div className="avatar">
                        <Button style={{backgroundColor:'#242529', borderColor:'#242529'}} size="small" type="primary" shape="circle" icon={<AiOutlineInfo  style={{position: 'relative', fontSize:'16'}} />}  />
                        </div>
                    </div>
                    <div className="TaskBox" id="Task_2">
                    {tasks2.length > 0 ? (
                    <Tasks tasks={tasks2} onDelete={async(id)=> { await deleteTask(id);}} getTasks = {async () => {await getTasks();}}/>) : ('No Tasks To Show') }
                    </div>
                </Col>
            </Row>
            <Row>
                <Col  span={11} offset={1}>
                <div className="titlebar i5_u1" >
                        <h5>Task III : Urgent, Not Important</h5>
                        <div className="avatar">
                        <Button style={{backgroundColor:'#242529', borderColor:'#242529'}} size="small" type="primary" shape="circle" icon={<AiOutlineInfo  style={{position: 'relative', fontSize:'16'}} />}  />
                        </div>
                    </div>
                    <div className="TaskBox" id="Task_3">
                    {tasks3.length > 0 ? (
                    <Tasks tasks={tasks3} onDelete={async(id)=> { await deleteTask(id);}} getTasks = {async () => {await getTasks();}}/>) : ('No Tasks To Show') }
                    </div>
                </Col>
                <Col  span={11} offset={1}>
                <div className="titlebar i5_u5">
                        <h5>Task IV : Neither Urgent nor Important</h5>
                        <div className="avatar">
                        <Button style={{backgroundColor:'#242529', borderColor:'#242529'}} size="small" type="primary" shape="circle" icon={<AiOutlineInfo  style={{position: 'relative', fontSize:'16'}} />}  />
                        </div>
                    </div>
                    <div className="TaskBox" id="Task_4">
                    {tasks4.length > 0 ? (
                    <Tasks tasks={tasks4} onDelete={async(id)=> { await deleteTask(id);}} getTasks = {async () => {await getTasks();}}/>) : ('No Tasks To Show') }
                    </div>
                </Col>
            </Row>
            <div className="HomeBack flex">
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
            <div>
            <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
                
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
                <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
            </svg>
            </div>
           </div> 
        </Content>
        
    )
}

export default MyTasks
