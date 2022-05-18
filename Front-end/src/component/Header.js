import React from 'react'
import 'antd/dist/antd.css';
import { Layout, Menu , Dropdown} from 'antd';
import { DownOutlined,UserOutlined } from '@ant-design/icons';
import {Link,useLocation } from 'react-router-dom'
const { Header } = Layout;


/** Todolist
 * Create menu about : Logo, name of App, Signin/Signup tab,
 * MinMap tab, MyTask tab, About tab, Home tab, About tab
 * Add antd menu to this header
*/
const AppHeader = () => {
    var ind='1';
    const location = useLocation();
    switch (location.pathname) {
        case "/mindmap":
            ind='2'
            break;
        case "/mytasks":
            ind='3'
            break;
        case "/About":
            ind='4'
            break;
        case "/signin":
            localStorage.getItem("accessToken") ? ind='1' : ind='5'
            break;
        case "/signup":
            localStorage.getItem("accessToken") ? ind='1' : ind='6'
            break;
        default:
            ind='1'
            break;
    }
    const menu = (
  <Menu style={{ marginRight:"-1vw"}}>
    <Menu.Item key="0">
      <a href="/">Profile</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="/">Change Password</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" onClick={()=>{localStorage.removeItem("accessToken")}}><a href="/">Log out</a></Menu.Item>
  </Menu>
);
    return (
        <Header className="header" style={{ backgroundColor: '#ffffff', padding: '0 10px'}}>
            <div  style={{display : 'inline-block', maxWidth:'20%',minWidth:'18%', padding: '0px 0px'}}>
            <Link className="logo" to='/'>
                <img src={process.env.PUBLIC_URL+'/taskmaker.png'} alt="Logo" height="64vh"/>
            </Link>
            <p style={{fontFamily:'Montserrat', fontStyle:'italic', fontSize:'1.2vw'}}>taSkMaker</p>
            </div>
            <div style={{ float: 'right', maxWidth:'85%'}}>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={[ind]}
            style={localStorage.getItem("accessToken")&&{display : 'inline-block', float:'left', maxWidth:'90%'}}>
                <Menu.Item key={1} className= "Home">
                    <Link to='/'>Home</Link>
                </Menu.Item>
                <Menu.Item key={2} className= "Mindmap">
                    <Link to='/mindmap'>Mind Map</Link>
                </Menu.Item>
                <Menu.Item key={3} className= "Mytasks">
                    <Link to='/mytasks'>My Tasks</Link>
                </Menu.Item>
                <Menu.Item key={4} className= "About">
                    <Link to='/about'>About</Link>
                </Menu.Item>
                {(!localStorage.getItem("accessToken")) &&
                <><Menu.Item key={5} className= "Signin">
                    <Link to='/signin'>Sign In</Link>
                </Menu.Item>
                <Menu.Item key={6} className= "Signup">
                    <Link to='/signup'>Sign Up</Link>
                </Menu.Item></>}
                {(localStorage.getItem("accessToken")) &&
            <div style={{float:'right', margin:'0vh 1vw',minWidth:"8%"  }}>
            <Dropdown overlay={menu} trigger={['click']} >
            <p className="ant-dropdown-link" onClick={e => e.preventDefault() }>
            <UserOutlined />User<DownOutlined />
            </p>
            </Dropdown>
            </div>
            }
            </Menu>
            
            </div>
        </Header>
    )
}

export default AppHeader
