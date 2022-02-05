import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Field, Form, Formik} from "formik";
import {ProgressSpinner} from 'primereact/progressspinner';
import {Dialog} from 'primereact/dialog';
import Menu from "../main/Menu";
import {uuid} from "uuidv4";
import Flag from 'react-world-flags'

const axios = require("axios")
const mqtt = require('mqtt');
const _ = require('lodash')


const Game = (props) => {
    const [res, setRes] = useState('')
    const [name, setName] = useState('')
    const [gameRes, setGameRes] = useState([])
    const [data, setData] = useState([])
    const [chatEn, setChatEn] = useState([])
    const [chatPl, setChatPl] = useState([])
    const [currentChat, setCurrentChat] = useState('pl')
    const [chatToShow, setChatToShow] = useState([])
    const [ranking, setRanking] = useState([])


    useEffect(() => {
        const client = mqtt.connect('mqtt://localhost:8000/mqtt');
        client.subscribe('chat/front/pl', () => {
            console.log("Subscribing to chat-front-pl")
        })
        client.subscribe('chat/front/en', () => {
            console.log("Subscribing to chat-front-en")
        })
        client.subscribe('chat/front/edit/pl', () => {
            console.log("Subscribing to chat/front/edit/pl")
        })
        client.subscribe('chat/front/edit/en', () => {
            console.log("Subscribing to chat/front/edit/en")
        })
        client.subscribe('game/#', () => {
            console.log("Subscribing to game")
        })
        client.subscribe('forcestart/messageback', () => {
            console.log("Subscribing to forcestart/messageback")
        })
        client.subscribe('ranking/front', () => {
            console.log("Subscribing to ranking/front")
        })

        client.on('message', async (topic, message) => {
            if (topic === 'game') {
                if (message.toString() === 'losowanie...') {
                    setRes(<ProgressSpinner/>)
                } else {
                    setRes(message.toString())
                }
            }
            if (topic === 'game/id') {
                setName(message.toString())
            }
            if (topic === 'chat/front/pl') {
                const messageToSet = JSON.parse(message.toString())
                if (messageToSet.user === Cookies.get('username')) {
                    axios.post('http://localhost:5000/chat', {
                        id: messageToSet.id,
                        user: messageToSet.user,
                        message: messageToSet.message
                    })
                        .then(() => {
                            setChatPl(chat => [...chat, {
                                id: messageToSet.id,
                                message: messageToSet.message,
                                user: messageToSet.user,
                                edit: <Button onClick={() => {
                                    setIdMessage(messageToSet.id);
                                    setContentMessage(messageToSet.message);
                                    onClick('displayBasic');
                                }}>edit</Button>
                            }])
                        }).catch((e) => console.log(e))
                } else {
                    setChatPl(chat => [...chat, messageToSet])
                }

            }
            if (topic === 'chat/front/en') {
                const messageToSet = JSON.parse(message.toString())
                if (messageToSet.user === Cookies.get('username')) {
                    axios.post('http://localhost:5000/chat', {
                        id: messageToSet.id,
                        user: messageToSet.user,
                        message: messageToSet.message
                    })
                        .then(() => {
                            setChatEn(chat => [...chat, {
                                id: messageToSet.id,
                                message: messageToSet.message,
                                user: messageToSet.user,
                                edit: <Button onClick={() => {
                                    setIdMessage(messageToSet.id);
                                    setContentMessage(messageToSet.message);
                                    onClick('displayBasic');
                                }}>edit</Button>
                            }])
                        }).catch((e) => console.log(e))
                } else {
                    setChatEn(chat => [...chat, messageToSet])
                }

            }
            if (topic === 'chat/front/edit/pl') {
                const messageToEdit = JSON.parse(message.toString())
                if (messageToEdit.user === Cookies.get('username')) {
                    axios.put(`http://localhost:5000/chat/${messageToEdit.id}`, {
                        id: messageToEdit.id,
                        user: messageToEdit.user,
                        message: messageToEdit.message
                    })
                        .then(() => {
                            setChatPl(chat => chat.map(message => {
                                if (message.id === messageToEdit.id) {
                                    return {
                                        message: messageToEdit.message,
                                        user: messageToEdit.user,
                                        edit: <Button onClick={() => {
                                            setIdMessage(messageToEdit.id);
                                            setContentMessage(messageToEdit.message);
                                            onClick('displayBasic');
                                        }}>edit</Button>
                                    }
                                }
                                return message
                            }))


                        })
                        .then(() => onHide('displayBasic'))
                        .catch((e) => console.log(e))

                } else {
                    setChatPl(chat => chat.map(message => {
                        if (message.id === messageToEdit.id) {
                            return messageToEdit
                        }
                        return message
                    }))
                }

            }
            if (topic === 'chat/front/edit/en') {
                const messageToEdit = JSON.parse(message.toString())
                if (messageToEdit.user === Cookies.get('username')) {
                    axios.put(`http://localhost:5000/chat/${messageToEdit.id}`, {
                        id: messageToEdit.id,
                        user: messageToEdit.user,
                        message: messageToEdit.message
                    })
                        .then(() => {
                            setChatEn(chat => chat.map(message => {
                                if (message.id === messageToEdit.id) {
                                    return {
                                        message: messageToEdit.message,
                                        user: messageToEdit.user,
                                        edit: <Button onClick={() => {
                                            setIdMessage(messageToEdit.id);
                                            setContentMessage(messageToEdit.message);
                                            onClick('displayBasic');
                                        }}>edit</Button>
                                    }
                                }
                                return message
                            }))


                        })
                        .then(() => onHide('displayBasic'))
                        .catch((e) => console.log(e))

                } else {
                    setChatEn(chat => chat.map(message => {
                        if (message.id === messageToEdit.id) {
                            return messageToEdit
                        }
                        return message
                    }))
                }

            }
            const topicSplitted = topic.split("/")
            if (topicSplitted[0] === 'game' && topicSplitted[1] === 'result') {
                const numbers = [
                    Cookies.get(`number1${props.match.params.login}`),
                    Cookies.get(`number2${props.match.params.login}`),
                    Cookies.get(`number3${props.match.params.login}`),
                    Cookies.get(`number4${props.match.params.login}`),
                    Cookies.get(`number5${props.match.params.login}`)
                ]
                await axios.put(`http://localhost:5000/games/${topicSplitted[2]}`, {
                    player: {
                        login: props.match.params.login,
                        numbers: numbers
                    },
                })
                setGameRes(gameRes => [...gameRes, message.toString()])
                console.log(name)
                setData(data => [...data,
                    {
                        idOfGame: topicSplitted[2],
                        gameRes: message.toString(),
                        pickedNumbers: numbers.toString(),
                        guessedNumbers: message.toString()
                            .split(",")
                            .filter(num => numbers.includes(num)).length

                    }])
                client.publish("ranking", JSON.stringify({
                    player: props.match.params.login, won: won(message.toString()
                        .split(",")
                        .filter(num => numbers.includes(num)).length)
                }))


            }
            if (topic === "forcestart/messageback") {
                if (Cookies.get('username') !== "admin") alert("Game has been forced to be started by the admin")
            }
            if (topic === "ranking/front") {
                const json = JSON.parse(message.toString())
                setRanking(ranking => _.orderBy(ranking.map(el => {
                    if (el.player === json.player) {
                        return {player: el.player, won: el.won + json.won}
                    }
                    return el
                }), 'won', 'desc'))
            }

        })

        return () => {
            client.end()
        }

    }, [])

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


    useEffect(() => {
        switch (currentChat) {
            case "pl":
                return setChatToShow(chatPl)
            case "en":
                return setChatToShow(chatEn)
            default:
                return setChatToShow(chatPl)
        }
    })

    const sendMessage = (message, currChat) => {
        const messageToSend = {
            id: uuid(),
            message: message,
            user: Cookies.get('username'),
            edit: ''
        }
        if (currChat === "pl") {
            const client2 = mqtt.connect('mqtt://localhost:8000/mqtt');
            client2.publish('chat/pl', JSON.stringify(messageToSend))
            return () => {
                client2.end()
            }
        }
        if (currChat === "en") {
            const client3 = mqtt.connect('mqtt://localhost:8000/mqtt');
            client3.publish('chat/en', JSON.stringify(messageToSend))
            return () => {
                client3.end()
            }
        }
    }

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

    const [idMessage, setIdMessage] = useState('')
    const [contentMessage, setContentMessage] = useState('')

    const footerEditDialog = (name) => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text"/>
            </div>
        );
    }

    const editMessage = (id, newContent) => {
        const messageToEdit = {
            id: id,
            message: newContent,
            user: Cookies.get('username')
        }
        if (currentChat === "pl") {
            const client3 = mqtt.connect('mqtt://localhost:8000/mqtt');
            client3.publish('chat/edit/pl', JSON.stringify(messageToEdit))
            return () => {
                client3.end()
            }
        }
        if (currentChat === "en") {
            const client5 = mqtt.connect('mqtt://localhost:8000/mqtt');
            client5.publish('chat/edit/en', JSON.stringify(messageToEdit))
            return () => {
                client5.end()
            }
        }


    }
    const forceStart = () => {
        const client6 = mqtt.connect('mqtt://localhost:8000/mqtt');
        client6.publish('forcestart', "START")
        return () => {
            client6.end()
        }
    }


    //Ranking
    const won = (amount) => {
        switch (amount) {
            case 0:
                return 0;
            case 1:
                return 100;
            case 2:
                return 500;
            case 3:
                return 1500;
            case 4:
                return 8000;
            case 5:
                return 15000;
            default:
                return 0;
        }
    }
    const createRanking = (games) => {
        console.log(games)
        const res = games.map(game => _.omit(game, '_id'))
            .map(game => ({
                id: game.id,
                players: game.players.map(player => ({
                    login: player.login,
                    won: won(player.numbers.map(number => parseInt(number)).filter(num => game.winningNumbers.includes(num)).length),
                    numbersChosen: player.numbers
                })),
                winningNumbers: game.winningNumbers
            }))
            .reduce((acc, curr) => {
                curr.players.forEach(player => {
                    player.won !== 0 && (
                        acc[player.login] ? acc[player.login] = [...acc[player.login], player.won]
                            : acc[player.login] = [player.won])


                })
                return acc
            }, {})
        const resSortedAndSliced = _.orderBy(Object.keys(res).map(login => ({
            player: login,
            won: res[login].reduce((acc, curr) => acc + curr, 0)
        })).filter(player => player.player !== "admin"), 'won', 'desc').slice(0, 5)

        setRanking(resSortedAndSliced)

    }

    useEffect(() => {
        axios.get('http://localhost:5000/games')
            .then(res => createRanking(res.data))
    }, [])


    return (

        <div className="main-game">
            <Dialog header="Header" visible={displayBasic} style={{width: '50vw'}}
                    footer={footerEditDialog('displayBasic')} onHide={() => onHide('displayBasic')}>
                <div>
                    <Formik
                        initialValues={{message: contentMessage}}
                        onSubmit={(values) => editMessage(idMessage, values.message)}
                        enableReinitialize={true}>
                        <Form>
                            <div>
                                <Field name="message"/>
                            </div>
                            <div>
                                <button type="submit">Edit</button>
                            </div>

                        </Form>
                    </Formik>
                </div>
            </Dialog>
            <div className="main-game-menu">
                <Menu/>
            </div>
            <div className="id-game">
                {Cookies.get("username") === "admin" &&
                <Button label="FORCE START OF THE GAME" className="p-button-outlined p-button-danger"
                        onClick={() => forceStart()}/>}
                <h3>Id of game: {name}</h3>
                <h1>{res}</h1>
            </div>
            <div className="chat-game">
                <div className="flags">
                    <div className="flags-inner-1">
                        <span>Switch chat to: </span>
                        {currentChat === "pl" ? <Flag code="gb" height="16" onClick={() => setCurrentChat('en')}/>
                            : <Flag className="pl-flag" code="pl" height="16" onClick={() => setCurrentChat('pl')}/>}
                    </div>
                    <div>
                        <span>Current chat is: {currentChat === "pl" ? <Flag className="pl-flag" code="pl" height="16"/>
                            : <Flag code="gb" height="16"/>}
                        </span>
                    </div>
                </div>
                <DataTable value={chatToShow} scrollable scrollHeight="300px" virtualScrollerOptions={{itemSize: 20}}
                           onSelectionChange={(e) => console.log(e)}>
                    <Column field="user" header="User"/>
                    <Column field="message" header="Message"/>
                    <Column field="edit" header="Operations"/>
                </DataTable>
                <div className="chat-form">
                    <Formik
                        initialValues={{message: ''}}
                        onSubmit={(values, {resetForm}) => {
                            sendMessage(values.message, currentChat);
                            resetForm({values: ''})
                        }}
                        enableReinitialize={true}>
                        <Form>
                            <div>
                                <Field name="message"/>
                            </div>
                            <div>
                                <button type="submit">Send</button>
                            </div>

                        </Form>
                    </Formik>
                </div>
            </div>
            <div className="form-change-numbers">
                <div className="chosen-numbers">
                    <h2>Current chosen numbers:</h2>
                    <p className="numbers">{Cookies.get(`number1${props.match.params.login}`)},
                        {Cookies.get(`number2${props.match.params.login}`)},
                        {Cookies.get(`number3${props.match.params.login}`)},
                        {Cookies.get(`number4${props.match.params.login}`)},
                        {Cookies.get(`number5${props.match.params.login}`)}</p>
                </div>
                <div className="form-change-numbers-formik">
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
                            } else {
                                setErr("You can't set two the same numbers")
                            }

                        }}
                        enableReinitialize={true}>
                        <Form>
                            <div className="labels-change-numbers">
                                <label htmlFor="number1">
                                    Number 1:
                                    <Field name="number1" as="select">
                                        <option disabled value="">(Select number 1)</option>
                                        {options().map(option => (
                                            <option value={option}>{option}</option>
                                        ))}
                                    </Field>
                                </label>
                                <label htmlFor="number2">
                                    Number 2:
                                    <Field name="number2" as="select">
                                        <option disabled value="">(Select number 2)</option>
                                        {options().map(option => (
                                            <option value={option}>{option}</option>
                                        ))}
                                    </Field>
                                </label>
                                <label htmlFor="number3">
                                    Number 3:
                                    <Field name="number3" as="select">
                                        <option disabled value="">(Select number 3)</option>
                                        {options().map(option => (
                                            <option value={option}>{option}</option>
                                        ))}
                                    </Field>
                                </label>
                                <label htmlFor="number4">
                                    Number 4:
                                    <Field name="number4" as="select">
                                        <option disabled value="">(Select number 4)</option>
                                        {options().map(option => (
                                            <option value={option}>{option}</option>
                                        ))}
                                    </Field>
                                </label>
                                <label htmlFor="number5">
                                    Number 5:
                                    <Field name="number5" as="select">
                                        <option disabled value="">(Select number 5)</option>
                                        {options().map(option => (
                                            <option value={option}>{option}</option>
                                        ))}
                                    </Field>
                                </label>
                                <Button label="CHANGE NUMBERS" className="p-button-outlined p-button-secondary"
                                        type="submit"/>
                                {err && <p>{err}</p>}
                            </div>
                        </Form>
                    </Formik>
                </div>
                <div className="ranking">
                    <h2>
                        Current ranking:
                    </h2>
                    <DataTable value={ranking} responsiveLayout="scroll">
                        <Column field="player" header="login"/>
                        <Column field="won" header="Won"/>
                    </DataTable>

                </div>
            </div>
            <div className="results">
                <div className="card">
                    <DataTable value={data} responsiveLayout="scroll">
                        <Column field="idOfGame" header="Id of game"/>
                        <Column field="gameRes" header="Winning numbers"/>
                        <Column field="pickedNumbers" header="Your numbers"/>
                        <Column field="guessedNumbers" header="Guessed numbers"/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Game;