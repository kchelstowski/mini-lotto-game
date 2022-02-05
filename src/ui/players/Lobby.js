import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useHistory} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import Menu from "../main/Menu";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";

const axios = require('axios')


const Lobby = (props) => {

    const history = useHistory()
    const [initialValues, setInitialValues] = useState({
        number1: '',
        number2: '',
        number3: '',
        number4: '',
        number5: ''
    })
    const [err, setErr] = useState('')
    const options = () => {
        const res = []
        for (let i = 1; i <= 25; i++) {
            res.push(i.toString())
        }
        return res
    }
    const [readyNumbers, setReadyNumbers] = useState([])
    useEffect(() => {
        const fetchReadyNumbers = async () => {
            const numbers = await axios.get(`http://localhost:5000/numbers/${Cookies.get('username')}`)
            setReadyNumbers(numbers.data.map(number => ({
                id: number._id,
                numbers: number.numbers,
                numbersToDisplay: number.numbers.toString(),
                operations: <Button label="Set" className="p-button-success"
                                    onClick={() => handleChange(number.numbers)}/>
            })))
        }
        fetchReadyNumbers()
    }, [])
    const handleChange = (numbers) => {
        setInitialValues({
            number1: numbers[0],
            number2: numbers[1],
            number3: numbers[2],
            number4: numbers[3],
            number5: numbers[4]
        })
    }

    return (
        <div>
            <Menu/>

            <div className="lobby-boxes">
                <div className="numbers-list-lobby">
                    <DataTable value={readyNumbers} showGridlines responsiveLayout="scroll">
                        <Column field="numbersToDisplay" header="Your saved numbers"/>
                        <Column field="operations" header="Operations"/>
                    </DataTable>
                </div>
                <div className="lobby-flex">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            setErr('')
                            const numbers = []
                            Object.keys(values).map(key => numbers.push(values[key]))
                            const set = new Set(numbers)
                            if (numbers.length === set.size) {
                                Cookies.set(`number1${props.match.params.login}`, values.number1)
                                Cookies.set(`number2${props.match.params.login}`, values.number2)
                                Cookies.set(`number3${props.match.params.login}`, values.number3)
                                Cookies.set(`number4${props.match.params.login}`, values.number4)
                                Cookies.set(`number5${props.match.params.login}`, values.number5)
                                history.push(`/game/${props.match.params.login}`)
                            } else {
                                setErr("You can't set two the same numbers")
                            }

                        }}
                        enableReinitialize={true}>
                        <Form>
                            <div className="flex-form-lobby">
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
                                <Button label="Play" className="p-button-outlined" type="submit"/>
                                {err && <p>{err}</p>}
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>

        </div>
    );
};

export default Lobby;