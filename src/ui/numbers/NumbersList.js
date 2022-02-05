import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button'
import Cookies from "js-cookie";
import Menu from "../main/Menu";
import {Field, Form, Formik} from "formik";
import {Dialog} from "primereact/dialog";
import {useConfirm} from "material-ui-confirm";

const axios = require('axios')


const NumbersList = () => {

    const confirm = useConfirm();
    const [numbers, setNumbers] = useState([])
    useEffect(() => {
        const fetchNumbers = async () => {
            const numbers = await axios.get(`http://localhost:5000/numbers/${Cookies.get('username')}`)
            setNumbers(numbers.data.map(number => ({
                id: number._id,
                numbers: number.numbers.toString(),
                operations:
                    <div className="numbers-list-operations-buttons">
                        <Button label="Edit" className="p-button-warning" onClick={() => {
                            setIdNumber(number._id);
                            setContentNumbers(number.numbers);
                            onClick('displayBasic');
                        }}/>
                        <Button label="Delete" className="p-button-danger" onClick={() => handleDelete(number._id)}/>
                    </div>
            })))
        }
        fetchNumbers()

    }, [])

    const options = () => {
        const res = []
        for (let i = 1; i <= 25; i++) {
            res.push(i.toString())
        }
        return res
    }

    const [err, setErr] = useState('')


    //Dialog
    const [displayBasic, setDisplayBasic] = useState(false);

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const onClick = (name) => {
        dialogFuncMap[`${name}`](true);

    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const [idNumber, setIdNumber] = useState('')
    const [contentNumbers, setContentNumbers] = useState('')

    const footerEditDialog = (name) => {
        return (
            <div>
                <Button label="Don't edit" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text"/>
            </div>
        );
    }

    const handleSubmit = (idNumbers, numbers) => {
        setErr('')
        const numbersArray = []
        Object.keys(numbers).map(key => numbersArray.push(parseInt(numbers[key])))
        const set = new Set(numbersArray)
        if (numbersArray.length === set.length) {
            axios.put(`http://localhost:5000/numbers/${idNumbers}`, {
                user: Cookies.get('username'),
                numbers: numbersArray
            }).then(() => alert("Edytowano pomyślnie liczby"))
                .then(() => setNumbers(numbers => numbers.map(arr => {
                    if (arr.id === idNumbers) {
                        return {...arr, numbers: numbersArray.toString()}
                    }
                    return arr
                })))
                .then(() => onHide('displayBasic'))

                .catch(err => setErr(err.response.data))

        } else {
            setErr("You can't set two the same numbers")
        }
    }

    //Delete
    const handleDelete = (id) => {
        confirm({description: 'You will delete those numbers!'})
            .then(() => axios.delete(`http://localhost:5000/numbers/${id}`)
                .then(() => alert("Numbers deleted"))
                .then(() => setNumbers(numbers => numbers.filter(arr => arr.id !== id)))
                .catch(err => setErr(err.response.data)))
            .catch(() => console.log("delete of numbers canceled"))

    }


    return (
        <div>
            <Menu/>
            <Dialog header="Edit numbers" visible={displayBasic} style={{width: '50vw'}}
                    footer={footerEditDialog('displayBasic')} onHide={() => onHide('displayBasic')}>
                <div>
                    <Formik
                        initialValues={{
                            number1: contentNumbers[0],
                            number2: contentNumbers[1],
                            number3: contentNumbers[2],
                            number4: contentNumbers[3],
                            number5: contentNumbers[4]

                        }}
                        onSubmit={(values) => handleSubmit(idNumber, values)}
                        enableReinitialize={true}>
                        <Form>
                            <div className="edit-numbers-form">
                                <label htmlFor="number1">
                                    <div className="edit-numbers-form-inner">
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
                                    <div className="edit-numbers-form-inner">
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
                                    <div className="edit-numbers-form-inner">
                                        <span>Number 3:</span>
                                        <Field name="number3" as="select">
                                            <option disabled value="">(Select number 1)</option>
                                            {options().map(option => (
                                                <option value={option}>{option}</option>
                                            ))}
                                        </Field>
                                    </div>
                                </label>
                                <label htmlFor="number4">
                                    <div className="edit-numbers-form-inner">
                                        <span>Number 4:</span>
                                        <Field name="number4" as="select">
                                            <option disabled value="">(Select number 1)</option>
                                            {options().map(option => (
                                                <option value={option}>{option}</option>
                                            ))}
                                        </Field>
                                    </div>
                                </label>
                                <label htmlFor="number5">
                                    <div className="edit-numbers-form-inner">
                                        <span>Number 5:</span>
                                        <Field name="number5" as="select">
                                            <option disabled value="">(Select number 1)</option>
                                            {options().map(option => (
                                                <option value={option}>{option}</option>
                                            ))}
                                        </Field>
                                    </div>
                                </label>
                                <button type="submit">Edit</button>
                                {err && <p>{err}</p>}
                            </div>


                        </Form>
                    </Formik>
                </div>
            </Dialog>
            <div className="numbers-list">
                <DataTable value={numbers} showGridlines responsiveLayout="scroll">
                    <Column field="numbers" header="Your saved numbers"/>
                    <Column field="operations" header="Operations"/>
                </DataTable>
            </div>
        </div>
    );
};

export default NumbersList;