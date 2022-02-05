import {BrowserRouter, Route} from "react-router-dom";

import Login from "../players/Login";
import PlayersForm from "../players/PlayersForm";
import Game from "../games/Game";
import Lobby from "../players/Lobby";
import Welcomer from "../main/Welcomer";
import GamesList from "../games/GamesList";
import ChatList from "../chat/ChatList";
import NumbersForm from "../numbers/NumbersForm";
import NumbersList from "../numbers/NumbersList";
import PlayersList from "../players/PlayersList";


const Router = () => {

    return (
        <div>
            <BrowserRouter>
                <Route exact path="/" component={Welcomer}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/players" component={PlayersList}/>
                <Route exact path="/players/form" component={PlayersForm}/>
                <Route exact path="/players/form/edit/:login" component={PlayersForm}/>
                <Route exact path="/lobby/:login" component={Lobby}/>
                <Route exact path="/game/:login" component={Game}/>
                <Route exact path="/games" component={GamesList}/>
                <Route exact path="/chatHistory" component={ChatList}/>
                <Route exact path="/numbers" component={NumbersList}/>
                <Route exact path="/numbers/form" component={NumbersForm}/>
            </BrowserRouter>
        </div>
    )
}


export default Router;


