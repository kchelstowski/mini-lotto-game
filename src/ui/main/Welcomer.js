import React from 'react';
import {Button} from 'primereact/button';
import {useHistory} from "react-router-dom";
import Menu from "./Menu";

const Welcomer = () => {


    const history = useHistory()
    return (
        <div>
            <Menu/>
            <div className="welcomer">
                <div className="welcomer-login">
                    <Button label="SIGN IN" className="p-button-outlined button-welcomer"
                            onClick={() => history.push("/login")}/>
                </div>
                <div className="welcomer-register">
                    <Button label="REGISTER" className="p-button-outlined p-button-help button-welcomer"
                            onClick={() => history.push("/players/form")}/>
                </div>
            </div>
        </div>
    );
};

export default Welcomer;