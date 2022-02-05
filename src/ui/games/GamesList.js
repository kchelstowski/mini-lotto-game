import React, {useEffect, useState} from 'react';
import Menu from "../main/Menu";
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';

const axios = require('axios')
const _ = require('lodash')

const GamesList = () => {
    const [games, setGames] = useState([])
    useEffect(() => {
        const fetchGames = async () => {
            const allGames = await axios.get('http://localhost:5000/games')
            const gamesMapped = Object.keys(allGames.data).map(id => allGames.data[id])
                .map(game => _.omit(game, '_id'))
            setGames(gamesMapped)
        }
        fetchGames()

    }, [])
    const [err, setErr] = useState('')
    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/games/${id}`)
            .then((res) => alert(res.data[0]))
            .then(() => setGames(games.filter(game => game.id !== id)))
            .catch(err => setErr(err.response.data))
    }


    const header = (
        <img alt="Card" src="images/usercard.png"
             onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}/>
    );
    const footer = (gameId) => (
        <span>
            <Button label="Delete" icon="pi pi-times" className="p-button-outlined p-button-danger"
                    onClick={() => handleDelete(gameId)}/>
        </span>
    );

    return (
        <div className="gameslist-main">
            <Menu/>
            <div className="gameslist-cards">
                {games && games.map(game => (
                    <Card title={game.id} key={game.id} subTitle="Game" style={{width: '25em'}} footer={footer(game.id)}
                          header={header}>
                        <h3>Winning numbers: {game.winningNumbers.toString()}</h3>
                        <p>Players: {game.players.toString().length === 0 ? <span>NONE</span> :
                            <ul>
                                {game.players.map(player => (
                                    <li key={player.login} className="gameslist-card-player">
                                        <span className="gameslist-card-player-span">
                                            {player.login}
                                        </span>
                                        <span className="gameslist-card-player-span">
                                            ({player.numbers.toString()})
                                        </span>
                                        <span className="gameslist-card-player-span">
                                            <span className="guessed-numbers">{game.winningNumbers.toString()
                                                .split(",")
                                                .filter(num => player.numbers.toString().split(",").includes(num)).length}
                                            </span>
                                        </span>
                                        <span className="gameslist-card-player-span">
                                            <span className="separator">/</span>
                                        </span>
                                        <span className="gameslist-card-player-span">
                                            <span className="no-guessed-numbers">
                                                5
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        }
                        </p>
                        {err && <p>err</p>}

                    </Card>
                ))}

            </div>
        </div>
    );
};

export default GamesList;