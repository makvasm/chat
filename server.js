const app = require("express")();
const bodyparser = require("body-parser");

const { Sequelize, DataTypes } = require("sequelize");

const port = process.env.PORT || 3000;

let sequelize = new Sequelize(`sqlite://${__dirname + "/chat.sqlite"}`, {
  storage: __dirname + "/chat.sqlite",
  dialect: "sqlite"
})

const User = sequelize.define("user", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  }
})

const Chat = sequelize.define("chat", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  users: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.INTEGER)
  },
})

const Message = sequelize.define("message", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  author: {
    type: DataTypes.INTEGER
  },
  text: {
    type: DataTypes.STRING
  },
  chat: {
    type: DataTypes.INTEGER
  }
})

sequelize.sync()
  .then(() => {

    User.truncate()
    Chat.truncate()
    Message.truncate()


    User.create({ name: "makv11asm" }).catch(err => console.log(err))
    User.create({ name: "mak123vasm" }).catch(err => console.log(err))
    User.create({ name: "m312akvasm" }).catch(err => console.log(err))
    User.create({ name: "makva5345sm" }).catch(err => console.log(err))

    Chat.create({ name: "Test123", users: [1, 2, 3] }).catch(err => console.log(err))
    Chat.create({ name: "123Test", users: [1, 3] }).catch(err => console.log(err))

    Message.create({ author: 1, chat: 2, text: "awdawd" }).catch(err => console.log(err))
      .then(() => setTimeout(() => Message.create({ author: 1, chat: 2, text: "awdawda" }), 0))
      .then(() => setTimeout(() => Message.create({ author: 1, chat: 2, text: "awdawda" }), 0))
      .then(() => setTimeout(() => Message.create({ author: 1, chat: 2, text: "awdawda" }), 0))

  })
  .catch(err => console.log(err))

app.use(bodyparser.json());

app.route("/users/add")
  .post((req, res) => {
    let { username: name } = req.body
    if (!name) return res.status(400).send("Имя пользователя не указано")
    User.create({ name }).then(user => res.json({ id: user.id }))
      .catch(err => res.status(500).send(err))
  })

app.route("/chats/add")
  .post((req, res) => {
    let { name, users } = req.body
    if (!name) return res.status(400).send("Название чата не указано")
    Chat.create({ name, users }).then(chat => res.json({ id: chat.id }))
      .catch(err => res.status(500).json(err))
  })

app.route("/messages/add")
  .post((req, res) => {
    let { chat, author, text } = req.body
    if (!chat || !author || !text) return res.status(400).send("Укажите: id чата, id автора и текст сообщения")
    Message.create({ chat, author, text }).then(message => res.json({ id: message.id }))
      .catch(err => res.status(500).json(err))
  })

app.route("/chats/get") //FIX
  .post((req, res) => {
    let { user: user_id } = req.body
    if (!user_id) return res.status(400).send("Укажите id пользователя")
    Chat.findAll({ where: { users: { $contains: [user_id] } }, order: [["messages", 'ASC']] }).then(chats => res.json(chats))
      .catch(err => res.status(500).json(err))
  })

app.route("/messages/get")
  .post((req, res) => {
    let { chat: id } = req.body
    if (!id) return res.status(400).send("Введите id чата")
    Message.findAll({ where: { chat: id }, order: [["createdAt", "DESC"]] })
      .then(messages => res.json(messages))
      .catch(err => res.status(500).json(err))
  })

app.listen(port, () => console.log(`listening ${port}`));
