const mqtt = require('mqtt');
const axios = require("axios");
const client = mqtt.connect('http://localhost:1883');
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const {uuid} = require('uuidv4');


let counter = 15;
let gameId = uuid()
client.on('connect', () => {
    setInterval(async () => {
        client.publish('game/id', gameId.toString())
        if (counter <= 5) {
            client.publish('game', 'losowanie...')
            counter--
            if (counter === 0) {
                const numbers = []
                for (let i = 0; i < 5; i++) {
                    let number = getRandomInt(1, 25)
                    while (numbers.includes(number)) {
                        number = getRandomInt(1, 25)
                    }
                    numbers.push(number)
                }

                //tworzenie gry do bazy
                await axios.post("http://localhost:5000/games", {id: gameId, players: [], winningNumbers: numbers})
                setTimeout(() => {
                    client.publish(`game/result/${gameId}`, numbers.toString())
                    counter = 15
                    gameId = uuid()

                }, 200)

            }

        } else {
            client.publish('game', (counter - 5).toString())
            counter--
        }
    }, 1000);

    client.subscribe('chat/pl', () => {
        console.log("Subscribing to chat-PL")
    })
    client.subscribe('chat/en', () => {
        console.log("Subscribing to chat-EN")
    })
    client.subscribe('chat/edit/pl', () => {
        console.log("Subscribing to chat-edit-pl")
    })
    client.subscribe('chat/edit/en', () => {
        console.log("Subscribing to chat-edit-en")
    })
    client.subscribe('forcestart', () => {
        console.log("Subscribing to forcestart")
    })
    client.subscribe('ranking', () => {
        console.log("Subscribing to ranking")
    })
    client.on('message', (topic, message) => {
        if (topic === 'chat/pl') {
            client.publish('chat/front/pl', message.toString())
            console.log(message.toString())
        }
        if (topic === 'chat/en') {
            client.publish('chat/front/en', message.toString())
            console.log(message.toString())
        }
        if (topic === 'chat/edit/pl') {
            client.publish('chat/front/edit/pl', message.toString())
            console.log(message.toString())
        }
        if (topic === 'chat/edit/en') {
            client.publish('chat/front/edit/en', message.toString())
            console.log(message.toString())
        }
        if (topic === 'forcestart') {
            counter = 5
            client.publish('forcestart/messageback')
        }
        if (topic === 'ranking') {
            client.publish('ranking/front', message.toString())
        }

    })

})
