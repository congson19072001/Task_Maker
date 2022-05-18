import React from 'react'
import moment from 'moment';
import { Form, Input, Button,InputNumber, DatePicker  } from 'antd';
const TaskForm = (props) => {
     const {task,importance,urgency,deadline,onFinish,onFinishFailed,onDoubleClick} = props
    const range = (start, end) =>{
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().startOf('day');
      }
    const disabledDateTime = (date)=> {
        return {
          disabledHours: () => range(0, 24).splice(0,date ? (moment().isSame(date,'day') ? moment().hours() : 0) : 0  ),
          disabledMinutes: () => range(0, 60).splice(0,date ? (moment().isSame(date,'day') ? moment().minutes()+1 : 0) : 0  ),
          disabledSeconds: () => [],
        };
      }
    return (
        <Form style={{borderRadius:"5vw", overflow:"hidden", padding:"0.5vh 1.9vw"}} name="task_edit" labelCol={{ span: 16 }} wrapperCol={{ span: 16 }} layout="inline"
    initialValues={{ task: task, importance:importance, urgency:urgency, deadline: moment(deadline)}}
    onFinish={onFinish} onFinishFailed={onFinishFailed}>
       <Form.Item  style={{width:"40vw"}} label="Task" name="task" rules={[{ required: true, message: 'Please input your task!' }]}>
       <Input /></Form.Item>
       
       <Form.Item style={{marginTop:"1vh"}} label="Importance" name="importance" rules={[{ required: true, message: 'Please input task\'s importance!' }]}>
       <InputNumber min={1} max={5}/></Form.Item>
       <Form.Item style={{marginTop:"1vh"}} label="Urgency" name="urgency" rules={[{ required: true, message: 'Please input task\'s urgency!' }]}>
       <InputNumber min={1} max={5} /></Form.Item>
       <Form.Item style={{marginTop:"1vh"}} label="Deadline" name="deadline" rules={[{ required: true, message: 'Please input task\'s deadline!' }]}>
       <DatePicker showTime={{ format: 'HH:mm'}} format="YYYY-MM-DD HH:mm" disabledDate={disabledDate}  disabledTime={disabledDateTime} /></Form.Item>
       <Form.Item style={{ marginLeft:"0.7vw", marginTop:"1vh"}}>
       <Button type="primary" htmlType="submit">Submit</Button>
       </Form.Item>
       <Form.Item style={{marginTop:"1vh"}} >
       <Button type="danger" onClick={onDoubleClick}>Cancel</Button>
       </Form.Item>
       </Form>
    )
}

export default TaskForm