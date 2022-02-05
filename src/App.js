import './App.css';
import PlayersForm from "./ui/players/PlayersForm";
import Login from "./ui/players/Login";
import Router from "./ui/router/Router";
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {ConfirmProvider} from "material-ui-confirm";

function App() {
    return (
        <ConfirmProvider>
            <div className="App">
                <Router/>
            </div>
        </ConfirmProvider>
    );
}

export default App;
