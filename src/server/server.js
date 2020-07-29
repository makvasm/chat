const app = require("express")();
const bodyparser = require("body-parser");

const port = process.env.PORT || 9000;

const db = require("./database/db");

const User    = require("./classes").User;
const Chat    = require("./classes").Chat;
const Message = require("./classes").Message;

app.use(bodyparser.json());


app.post("/users/add", (req, res) => {
    if(!req.query.username) return res.status(400).send("Введите имя");
    let user = new User(req.query.username);
    (db.addUser(user, res));
});



app.post("/chats/add", (req, res) => {
    if(!req.query.name || !req.query.users) return res.status(400).send("Введите название чата и укажите пользователей");
    let chat = new Chat(req.query.name, req.query.users);
    db.createChat(chat, res);
});

app.post("/chats/get", (req, res) => {
    if(!req.query.username) return res.status(400).send("Введите имя");
    db.getChats(req.query.username, res);
});



app.post("/messages/add", (req, res) => {
    if(!req.query.message || !req.query.name || !req.query.author) return res.status(400).send("Небоходимо указать: имя отправителя, название чата, текст сообщения");
    let message = new Message(req.query.name, req.query.author, req.query.message);
    db.sendMessage(req.query.name, message, res);
});

app.post("/messages/get", (req, res) => {
    if(!req.query.name) return res.status(400).send("Укажите название чата");
    db.getChatMessages(req.query.name, res);
});



app.listen(port, () => console.log(`listening ${port}`));
