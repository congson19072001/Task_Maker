import {React ,Component } from 'react'
import throttle from 'lodash.throttle';

import { AiOutlineClose,AiOutlinePlus} from "react-icons/ai";
import { Checkbox,Tag, Button  } from 'antd';
import TaskForm from './TaskForm'

export class Task extends Component {

    constructor(props){
        super(props)
        this.state={
            task_id: this.props.Task_id,
            checked :this.props.checked,
            edit : false,
            importance: this.props.importance,
            urgency: this.props.urgency,
            task:this.props.task,
            deadline:this.props.deadline,
            tag : "",
            color : "",
        }
        this.onChange = this.onChange.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onFinishFailed = this.onFinishFailed.bind(this);
        this.onChangeThrottled = throttle(this.onChange, 300);
        this.setIUcolor = this.setIUcolor.bind(this);
    }
    setIUcolor = ()=> {
      switch (this.state.importance) {
        case 1:
           this.setState({tag : "Crucial"});
           this.setState({color : "magenta"});
           break;
        case 2:
          this.setState({tag : "Important"});
          this.setState({color : "volcano"});
          break;
        case 3:
            this.setState({tag : "Noticeable"});
            this.setState({color : "gold"});
            break;
        case 4:
            this.setState({tag : "Inessential"});
            this.setState({color : "cyan"});
            break;
        default:
            this.setState({tag : "Worthless"})
            this.setState({color : "geekblue"})
            break;
    }
    }
    componentDidMount(){
        this.setIUcolor();
    }
    componentWillUnmount() {
      this.onChangeThrottled.cancel();
    }
    onFinish = (values) => {
      this.setState({importance:values.importance})
      this.setState({urgency:values.urgency})
      this.setState({deadline:values.deadline.format("YYYY-MM-DD HH:mm")})
      this.setState({task:values.task})
      this.setIUcolor();
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("accessToken"));
      myHeaders.append("Content-Type", "application/json");
      let raw = JSON.stringify({
        "task": values.task,
        "deadline": values.deadline,
        "important": values.importance,
        "urgency": values.urgency,
      });
      let requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("https://task-maker-1907.herokuapp.com" + "/task/"+this.state.task_id, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.props.getTasks();
      })
      
      this.onDoubleClick();
     

    };
  
     onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
     onChange = (e)=>{
      this.setState({checked : e.target.checked})
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer "+ localStorage.getItem("accessToken"));
      myHeaders.append("Content-Type", "application/json");
      let raw = JSON.stringify({
        "completed": e.target.checked
      });
      let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("https://task-maker-1907.herokuapp.com" + "/task/"+this.state.task_id + "/check", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
       
    }
     onDoubleClick = ()=>{
        this.setState({edit : !this.state.edit})
    }
    render() {
     var normaltask = (<>
        <h3 className={"h3_u"+(this.state.urgency < 4 ? "1" : "5")+"_i"+(this.state.importance < 4 ? "1" : "5")} onDoubleClick={this.onDoubleClick} >{this.state.task}</h3>
         <Tag color={this.state.color} style={{display:'flex', margin:'-3vh auto 1vh 25vw', fontSize:'0.7vw', position:'absolute'}}>{this.state.tag}</Tag>
         <span className={"task-msg " + (this.state.checked ? "chu_noi" : "" )}>Well done!</span>
         <div className="task-control">
             <Checkbox  style={{transform: `scale(${1.25*(window.innerWidth/1536)})`, float:'left', margin:'1vh 0.2vw 0.1vh 0.1vw'}} checked={this.state.checked} onChange={this.onChangeThrottled}></Checkbox>
             <Button style={{position: 'relative', margin:'1.1vh 0.2vw 0.1vh 1vw'}} size="small" danger icon={<AiOutlineClose  style={{position: 'relative', fontSize:'16'}} />} onClick={() => this.props.onDelete(this.state.task_id)}  />
         </div>
         <p onDoubleClick={this.onDoubleClick}>Deadline: {this.state.deadline}</p>
         </>)


        return (
            <div className={"Task " + (this.state.checked ? "Task_completed": "")} >
            { 
            this.state.edit ?  <TaskForm task={this.state.task} importance={this.state.importance} urgency={this.state.urgency} 
            deadline={this.state.deadline} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} onDoubleClick={this.onDoubleClick}/> 
            : 
            normaltask
            }
             
         </div>
        )
    }
}

export default Task

