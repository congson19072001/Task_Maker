import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import { React, useState} from 'react'
import { Layout } from 'antd';

// adding pages
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import MindMap from "./pages/MindMap"
import MyTasks from "./pages/MyTasks"
import About from "./pages/About"

// adding components
import AppHeader from './component/Header'
import AppFooter from './component/Footer'

/** Todolist
 *  Create routers            done
 *  Create documents          done
 *  Import components         done
 *  Import Header and Footer  done
 */
function App() {
  return (
    <Layout >
      <Router>
        <AppHeader />
        <Route exact path='/' component={Home} />
        <Route path='/signin' >
          {localStorage.getItem("accessToken") ?  <Redirect to="/" /> : <SignIn />}
        </Route>
        <Route path='/signup' >
          {localStorage.getItem("accessToken") ?  <Redirect to="/" /> : <SignUp />}
        </Route>
        <Route path='/mindmap' component={MindMap} />
        <Route path='/mytasks' component={MyTasks} />
        <Route path='/about' component={About} />
      </Router>
      <AppFooter />
    </Layout>
  );
}

export default App;
