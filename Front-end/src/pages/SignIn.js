import { React, useState} from 'react'
import {useHistory } from 'react-router-dom'
import { Layout,Form, Input,Checkbox, Button  } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
const { Content } = Layout;
/**
 * 
 * @returns Page of Login, including:
 * Login with info : email, password
 * use token to save info in order to use later
 * register link leads user to signup page
 * using antd and jwt (firebase auth is ok)
 */


const SignIn = () => {
    const [err, setErr] = useState("")
    const history = useHistory()
    const onFinish = async (values) =>{
        const user = {
            Email: values.email,
            Password: values.password
        }
        const res = await fetch(process.env.BACKEND_URL + '/user/login', {
        method: 'POST',
        headers: {
        'Content-type': 'application/json',
        },
        body: JSON.stringify(user),
        })
        const data = await res.json()
        if(!res.ok) { setErr(data.error); return "Failed"}
        else{
            setErr("")
            localStorage.setItem("accessToken", data.auth.token)
            history.replace("/")
            return "Success"
        }
 
    
    }
    return (
    <Content style={{ padding: '5vh 0vw 0 0vw', background:"linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%)"}}>
        <div className="signinbox">
            <h1 className="title">Sign In</h1>
            <Form name="login" labelCol={{ span: 6   }} wrapperCol={{ span: 12 }} onFinish={onFinish} >
                <Form.Item label="Email" name="email"
                rules={[{type: 'email', message: 'The input is not valid E-mail!'},{ required: true, message: 'Please input your email!' }]}>
                    <Input prefix={<MailOutlined  />}/>
                </Form.Item>

                <Form.Item label="Password" name="password"
                rules={[{ required: true, message: 'Please input your password!' },{ min:6, message:'Password must contains at least 6 characters'}]}>
                    <Input.Password prefix={<LockOutlined />}/>
                </Form.Item>
                {err!=="" && <p style={{color:"#ed2553", fontSize:14,textAlign:"center", margin:"-0.5vh 2vw 1.5vh 0"}}>{err}</p>}
                <Form.Item wrapperCol={{ offset: 10, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
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
        
    </Content>
    )
}

export default SignIn
