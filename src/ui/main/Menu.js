import React, {useEffect, useState} from 'react';
import {Menubar} from 'primereact/menubar';
import {useHistory} from "react-router-dom";
import Cookies from 'js-cookie';
import {useConfirm} from "material-ui-confirm";

const axios = require('axios')


const MenubarDemo = () => {
    const history = useHistory()
    const [loggedAs, setLoggedAs] = useState('')
    const start = <h2>LOTTO GAME</h2>
    const [end, setEnd] = useState('')
    useEffect(() => {
        const userName = Cookies.get('username')
        if (userName) {
            setLoggedAs(userName)
            setEnd(`Logged as ${userName}`)
        }
    }, [])
    const confirm = useConfirm();
    const items = [
        {
            label: 'Account',
            icon: 'pi pi-user',
            items: [

                {
                    label: 'Edit',
                    icon: 'pi pi-sign-in',
                    command: () => {
                        if (loggedAs) {
                            history.push(`/players/form/edit/${loggedAs}`)
                        } else {
                            alert('You are not logged in')
                        }
                    }
                },
                {
                    label: "Delete account",
                    icon: "pi pi-user-minus",
                    command: () => {
                        if (loggedAs) {
                            if (Cookies.get('username') !== 'admin') {
                                confirm({description: 'You will delete your account!'})
                                    .then(() => {
                                        axios.delete(`http://localhost:5000/players/${loggedAs}`)
                                            .then((res) => alert(res.data[0]))
                                            .catch(e => alert(e.response.data))
                                    }).then(() => {
                                    Cookies.remove('username')
                                    history.push('/')
                                })
                                    .catch(() => {
                                        console.log("delete canceled")
                                    });
                            } else {
                                alert("You can't delete admin's account!")
                            }

                        } else {
                            alert("You are not even logged in, so what do you want to delete? :D")
                        }
                    }
                },
                {
                    label: 'Register',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => history.push('/players/form')

                }
            ]
        },

        {
            label: 'Games',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-table',
                    command: () => {
                        if (loggedAs) {
                            history.push('/games')
                        } else {
                            alert("You are not logged in")
                        }
                    }
                },
                {
                    label: "Play",
                    icon: "pi pi-play",
                    command: () => {
                        if (loggedAs) {
                            history.push(`/lobby/${loggedAs}`)
                        } else {
                            alert("You are not logged in")
                        }
                    }
                },
                {
                    label: "Export games",
                    icon: "pi pi-download",
                    command: async () => {
                        const games = await axios.post("http://localhost:5000/games/export")
                        if (loggedAs) {
                            alert(games.data)
                        } else {
                            alert("You are not logged in")
                        }
                    }
                }
            ]
        },
        {
            label: "Chat history",
            icon: 'pi pi-comment',
            command: () => {
                if (loggedAs) {
                    history.push('/chatHistory')
                } else {
                    alert("You are not logged in")
                }
            }
        },
        {
            label: "Numbers",
            icon: 'pi pi-percentage',
            items: [
                {
                    label: "Add numbers",
                    icon: "pi pi-plus",
                    command: () => {
                        if (loggedAs) {
                            history.push('/numbers/form')
                        } else {
                            alert("You are not logged in")
                        }
                    }

                },
                {
                    label: "List",
                    icon: "pi pi-table",
                    command: () => {
                        if (loggedAs) {
                            history.push("/numbers")
                        } else {
                            alert("You are not logged in")
                        }
                    }
                }
            ]

        },


        {
            label: 'Log-in / Logout',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                if (loggedAs) {
                    Cookies.remove('username')
                    history.push('/')
                } else {
                    history.push('/login')
                }

            }
        },
        Cookies.get('username') === 'admin' && {
            label: 'Admin panel',
            icon: 'pi pi-cog',
            items: [
                {
                    label: "Manage players",
                    icon: "pi pi-users",
                    command: () => {
                        history.push("/players")
                    }
                }
            ]


        }
    ];


    return (
        <div className="menu-margin">
            <div className="card">
                <Menubar model={items} start={start} end={end}/>
            </div>
        </div>
    );
}
export default MenubarDemo;