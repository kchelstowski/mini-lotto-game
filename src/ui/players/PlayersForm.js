import {Field, Form, Formik} from 'formik';
import {useEffect, useState} from "react";
import Menu from "../main/Menu";
import {Button} from 'primereact/button';

const PlayersForm = (props) => {

    const axios = require('axios')

    const [initialValues, setInitialValues] = useState({
        login: '',
        firstName: '',
        lastName: '',
        password: '',
        password_confirm: ''
    })


    useEffect(() => {
        const fetchUser = async () => {
            const user = await axios.get(`http://localhost:5000/players/${props.match.params.login}`)
            if (user.data.length !== 0) {
                const userObject = user.data[0]
                setInitialValues({
                    login: userObject.login,
                    firstName: userObject.firstName,
                    lastName: userObject.lastName,
                    password: '',
                    password_confirm: ''
                })
            }

        }
        fetchUser()
    }, [])

    const [err, setErr] = useState('')

    const handleSubmit = (values) => {
        setErr('')
        if (values.password !== values.password_confirm) {
            setErr("passwords have to be the same")
        } else if (props.match.params.login) {
            axios.put(`http://localhost:5000/players/${props.match.params.login}`, values)
                .then(() => alert("Edytowano playera"))
                .catch(err => setErr(err.response.data))
        } else {
            axios.post("http://localhost:5000/players", values)
                .then(response => alert("dodano playera"))
                .catch(err => setErr(err.response.data))
        }
    }


    return (
        <div>
            <Menu/>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, {resetForm}) => {
                    handleSubmit(values);
                    resetForm({values: ''})
                }}
                enableReinitialize={true}>
                <Form>
                    <div className="players-form">
                        <div className="players-form-outer">
                            <div className="players-form-inner">
                                <label htmlFor="login">
                                    <div className="players-form-inner-inner">
                                        <span>Login:</span>
                                        <Field name="login"/>
                                    </div>
                                </label>
                            </div>
                            <div className="players-form-inner">
                                <label htmlFor="firstName">
                                    <div className="players-form-inner-inner">
                                        <span>First name:</span>
                                        <Field name="firstName"/>
                                    </div>
                                </label>
                            </div>
                            <div className="players-form-inner">
                                <label htmlFor="lastName">
                                    <div className="players-form-inner-inner">
                                        <span>Last name:</span>
                                        <Field name="lastName"/>
                                    </div>
                                </label>
                            </div>
                            <div className="players-form-inner">
                                <label htmlFor="password">
                                    <div className="players-form-inner-inner">
                                        <span>Password:</span>
                                        <Field name="password" type="password"/>
                                    </div>
                                </label>
                            </div>
                            <div className="players-form-inner">
                                <label htmlFor="password">
                                    <div className="players-form-inner-inner">
                                        <span>Confirm password:</span>
                                        <Field name="password_confirm" type="password"/>
                                    </div>
                                </label>
                            </div>
                            <div className="players-form-inner">
                                <Button label="SUBMIT" className="p-button-outlined" type="submit"/>
                            </div>
                            <div className="players-form-inner">
                                {err && <p>{err}</p>}
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>


        </div>
    )
}


export default PlayersForm;