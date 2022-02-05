import React, {useEffect, useState} from 'react';
import Menu from "../main/Menu";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Button} from 'primereact/button';
import {useConfirm} from "material-ui-confirm";

const axios = require('axios')
const _ = require('lodash')

const PlayersList = () => {
    const [players, setPlayers] = useState([])
    const [err, setErr] = useState('')
    const confirm = useConfirm();

    useEffect(() => {
        const fetchPlayers = async () => {
            const allPlayers = await axios.get('http://localhost:5000/players')
            const playersMapped = allPlayers.data
                .map(player => _.omit(player, '_id'))
                .map(player => ({
                    ...player,
                    delete: <Button label="Delete" className="p-button-outlined p-button-danger"
                                    onClick={() => handleDelete(player.login)}/>
                }))
            setPlayers(playersMapped)
        }
        fetchPlayers()

    }, [])
    console.log(players)
    const handleDelete = (login) => {
        confirm({description: 'You will delete this player!'})
            .then(() => axios.delete(`http://localhost:5000/players/${login}`)
                .then((res) => alert(res.data[0]))
                .then(() => setPlayers(players => players.filter(player => player.login !== login)))
                .catch(err => setErr(err.response.data)))
            .catch(() => {
                console.log("Delete of user canceled")
            })

    }

    return (
        <div>
            <Menu/>
            <div className="chat-list-div">
                <DataTable value={players} responsiveLayout="scroll">
                    <Column field="login" header="Login"/>
                    <Column field="firstName" header="First name"/>
                    <Column field="lastName" header="Last name"/>
                    <Column field="delete" header="Operations"/>
                </DataTable>
            </div>
            {err && <p>{err}</p>}
        </div>
    );
};

export default PlayersList;