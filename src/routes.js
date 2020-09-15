import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Compiler from './pages/Compiler';
import VirtualMachine from './pages/VirtualMachine';
import Navbar from './components/Navbar/Navbar';
import './components/Navbar/Navbar.css'

export default function Routes() {
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/compiler" exact component={Compiler}/>
                <Route path="/virtual-machine" exact component={VirtualMachine}/>
            </Switch>
        </BrowserRouter>
    );
}