import React, {useEffect, useState} from 'react';
import Menu from "../main/Menu";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from 'primereact/button';
import {useConfirm} from "material-ui-confirm";
import Cookies from 'js-cookie';
import {Field, Form, Formik} from 'formik';

const axios = require('axios')
const _ = require('lodash')


const ChatList = () => {
    const [messages, setMessages] = useState([])
    const [err, setErr] = useState('')
    const confirm = useConfirm();

    useEffect(() => {
        const fetchMessages = async () => {
            if (Cookies.get('username') === 'admin') {
                const allMessages = await axios.get('http://localhost:5000/chat')
                const messagesMapped = allMessages.data
                    .map(message => _.omit(message, '_id'))
                    .map(message => ({
                        ...message,
                        delete: <Button label="Delete" className="p-button-outlined p-button-danger"
                                        onClick={() => handleDelete(message.id)}/>
                    }))
                setMessages(messagesMapped)
            } else {
                const allMessages = await axios.get(`http://localhost:5000/chat/${Cookies.get('username')}`)
                const messagesMapped = allMessages.data
                    .map(message => _.omit(message, '_id'))
                    .map(message => ({
                        ...message,
                        delete: <Button label="Delete" className="p-button-outlined p-button-danger"
                                        onClick={() => handleDelete(message.id)}/>
                    }))
                setMessages(messagesMapped)
            }
        }
        fetchMessages()

    }, [])
    const handleDelete = (id) => {
        confirm({description: 'You will delete those numbers!'})
            .then(() => axios.delete(`http://localhost:5000/chat/${id}`)
                .then((res) => alert(res.data[0]))
                .then(() => setMessages(messages => messages.filter(message => message.id !== id)))
                .catch(err => setErr(err.response.data)))
            .catch(() => {
                console.log("Delete of chat canceled")
            })

    }
    const handleSearch = (values) => {
        if (!values.pattern) {
            setErr("Pattern can't be empty")
        }
        else {
            axios.get(`http://localhost:5000/chat/chat/pattern/${values.pattern}`)
                .then((res) => setMessages(res.data))
                .catch(err => setErr(err.response.data))

        }
    }

    return (
        <div>
            <Menu/>
            <div className="chat-list-div">
                <div className="chat-list-pattern-box">
                    <div className="chat-list-pattern-form">
                        {err && <h1>{err}</h1>}
                        <Formik
                            initialValues={{pattern: ''}}
                            onSubmit={(values) => {
                                handleSearch(values)
                            }}
                            enableReinitialize={true}>
                            <Form>
                                <div className="flex-chat-list-search">
                                    <div className="flex-chat-list-search-inner">
                                        <label htmlFor="pattern">
                                            Pattern:
                                            <Field name="pattern"/>
                                        </label>
                                    </div>
                                    <div className="flex-chat-list-search-inner">
                                        <Button icon="pi pi-search"
                                                className="p-button-rounded p-button-success p-button-text"
                                                type="submit"/>
                                    </div>

                                </div>
                            </Form>
                        </Formik>
                    </div>
                    <div className="refresh-pattern-box">
                        <Button label="Refresh" className="p-button-outlined p-button-info"
                                onClick={() =>
                                    axios.get('http://localhost:5000/chat')
                                        .then((res) => setMessages(res.data))
                                        .catch(err => setErr(err))}/>
                    </div>
                </div>
                <DataTable value={messages} responsiveLayout="scroll">
                    <Column field="id" header="Id of message"/>
                    <Column field="user" header="User"/>
                    <Column field="message" header="Message"/>
                    <Column field="delete" header="Operations"/>
                </DataTable>
            </div>
        </div>
    );
};

export default ChatList;