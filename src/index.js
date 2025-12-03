import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Home from "./pages/Home/Home";
import Sobrenos from "./pages/Sobrenos/Sobrenos";
import Player from "./pages/Player/App";

import './Login.css';
import './index.css'; // Vamos criar isso

ReactDOM.render(
    <BrowserRouter>
        <div className="app-layout">
            <Navbar/>

            <div className="main-content">
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path='/register' component={Register} />
                    <Route path='/dashboard' component={Dashboard} />
                    <Route path='/home' component={Home} />
                    <Route path='/sobrenos' component={Sobrenos} />
                    <Route path='/app' component={Player} />
                </Switch>
            </div>

            <Footer/>
        </div>
    </BrowserRouter>,
  
    document.getElementById('root')
);
