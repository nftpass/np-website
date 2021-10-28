import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Landing } from './Components/Landing';
import { MintNFTPass } from './Pages/Mint/Mint';
import { ViewScore } from './Pages/Score/Score';
import { RankScore } from './Pages/Rank/Rank';

function Routes() {
    return (
        <Switch>
            <Route exact path="/">                
                <Landing/>
            </Route>
            <Route path="/score">                
                <ViewScore/>
            </Route>
            <Route path="/mint">                
                <MintNFTPass/>
            </Route>
            <Route path="/rank">
                <RankScore/>
            </Route>
        </Switch>
    );
}

export default Routes;