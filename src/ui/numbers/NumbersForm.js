import React, {useState} from 'react';
import Cookies from 'js-cookie';
import {useHistory} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {Button} from "primereact/button"
import Menu from "../main/Menu";

const axios = require("axios")

const NumbersForm = (props) => {

    const history = useHistory()
    const initialValues = {
        number1: '',
        number2: '',
        number3: '',
        number4: '',
        number5: ''
    }
    const [err, setErr] = useState('')
    const options = () => {
        const res = []
        for (let i = 1; i <= 25; i++) {
            res.push(i.toString())
        }
        return res
    }
    const handleSubmit = (values) => {
        setErr('')
        const numbers = []
        Object.keys(values).map(key => numbers.push(values[key]))
        const set = new Set(numbers)
        if (numbers.length === set.size) {
            axios.post("http://localhost:5000/numbers", {
                user: Cookies.get('username'),
                numbers: numbers
            }).then(() => alert("Dodano pomyślnie liczby"))
                .catch(err => setErr(err.response.data))

        } else {
            setErr("You can't set two the same numbers")
        }
    }

    return (
        <div>
            <Menu/>
            <h1 className="h1-center">Add numbers to your history</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
                enableReinitialize={true}>
                <Form>
                    <div className="flex-form">
                        <label htmlFor="number1">
                            <div className="lobby-form-inner">
                                <span>Number 1:</span>
                                <Field name="number1" as="select">
                                    <option disabled value="">(Select number 1)</option>
                                    {options().map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Field>
                            </div>
                        </label>
                        <label htmlFor="number2">
                            <div className="lobby-form-inner">
                                <span>Number 2:</span>
                                <Field name="number2" as="select">
                                    <option disabled value="">(Select number 2)</option>
                                    {options().map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Field>
                            </div>
                        </label>
                        <label htmlFor="number3">
                            <div className="lobby-form-inner">
                                <span>Number 3:</span>
                                <Field name="number3" as="select">
                                    <option disabled value="">(Select number 3)</option>
                                    {options().map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Field>
                            </div>
                        </label>
                        <label htmlFor="number2">
                            <div className="lobby-form-inner">
                                <span>Number 4:</span>
                                <Field name="number4" as="select">
                                    <option disabled value="">(Select number 4)</option>
                                    {options().map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Field>
                            </div>
                        </label>
                        <label htmlFor="number5">
                            <div className="lobby-form-inner">
                                <span>Number 5:</span>
                                <Field name="number5" as="select">
                                    <option disabled value="">(Select number 5)</option>
                                    {options().map(option => (
                                        <option value={option}>{option}</option>
                                    ))}
                                </Field>
                            </div>
                        </label>
                        <Button label="Add" className="p-button-outlined" type="submit"/>
                        {err && <p>{err}</p>}
                    </div>
                </Form>
            </Formik>

        </div>
    );
};

export default NumbersForm