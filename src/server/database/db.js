const mongo = require("mongodb").MongoClient;

module.exports = {
    addUser,
    getChats,
    createChat,
    sendMessage,
    getChatMessages
}


function addUser(user, res){
    mongo.connect(`mongodb://localhost:27017/`, (err, client) => {
        if(err) console.log("Add user connection error");

        let db = client.db("chat");
        let users = db.collection("users");

        users.insertOne(user, (err, result) => {
            if(err) return console.log("error");
            res.send(result.username);
        });

        client.close();
    });
}

async function getChats(username, res){
    mongo.connect(`mongodb://localhost:27017/`, async (err, client) => {
        if (err) console.log("Add user connection error");

        let db = client.db("chat");
        let chats = db.collection("chats");

        let cursor = chats.find({users : username});

        let response = [];

        await cursor.forEach(chat => response.push(chat));

        res.send(response);

        client.close();
    });
}

function sendMessage(name, message, res){
    mongo.connect(`mongodb://localhost:27017/`, (err, client) => {
        if (err) console.log("Add user connection error");

        let db = client.db("chat");
        let chats = db.collection("chats");

        chats.updateOne({ name }, { $push : { messages : message } }, (err, result) => {
            if(err) return console.log("send message error");
            res.send(message);
        });

        client.close();
    });
}

function createChat(chat, res){
    mongo.connect(`mongodb://localhost:27017/`, (err, client) => {
        if (err) console.log("Add user connection error");

        let db = client.db("chat");
        let chats = db.collection("chats");

        chats.insertOne(chat, (err, result) => {
            if (err) return res.send("error");
            res.send(chat);
        });

        client.close();
    });
}

function getChatMessages(name, res){
    mongo.connect(`mongodb://localhost:27017/`, (err, client) => {
        if (err) console.log("Add user connection error");

        let db = client.db("chat");
        let chats = db.collection("chats");

        chats.findOne({ name })
            .then(chat => res.send(chat.messages));

        client.close();
    });
}