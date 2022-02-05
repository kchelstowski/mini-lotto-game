import React, {useState} from 'react';
import {Field, Form, Formik} from "formik";
import {useHistory} from "react-router-dom"
import Menu from "../main/Menu";
import Cookies from 'js-cookie';
import {Button} from 'primereact/button';

const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const Login = () => {

    const axios = require("axios")

    const [initialValues, setInitialValues] = useState({
        login: '',
        password: ''
    })

    const history = useHistory()


    const handleSubmit = (values) => {
        const getUser = async (login, password) => {
            try {
                const response = await axios.post(`http://localhost:5000/players/login/${login}/${password}`)
                if (response.data !== "Auth Successful") return alert(`Invalid password`)
                Cookies.set('username', login)
                history.push(`/lobby/${login}`)
            } catch (e) {
                alert(e)
            }

        }
        getUser(values.login, values.password)

    }

    return (
        <div>
            <Menu/>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize={true}>
                <Form>
                    <div className="login-form">
                        <label htmlFor="login">
                            <div className="login-form-inner">
                                <span>Login:</span>
                                <Field name="login"/>
                            </div>
                        </label>
                        <label htmlFor="password">
                            <div className="login-form-inner">
                                Password:
                                <Field name="password" type="password"/>
                            </div>
                        </label>
                        <Button label="SUBMIT" className="p-button-outlined" type="submit"/>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;