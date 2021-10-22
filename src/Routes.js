import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './Pages/Home';

function Routes() {
    return (
        <Switch>
            <Route exact path="/">                
                <Home/>
            </Route>
        </Switch>
    );
}

export default Routes;