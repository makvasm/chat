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
    Message.create({ author: 1, chat: 2, text: "awdawda" }).catch(err => console.log(err))
    Message.create({ author: 1, chat: 2, text: "awdawd" }).catch(err => console.log(err))

  })
  .catch(err => console.log(err))

app.use(bodyparser.json());

app.route("/users/add")
  .post((req, res) => {
    let { username: name } = req.body
    if (!name) return res.status(400).send("Имя пользователя не указано")
    User.create({ name }).then(user => res.json({ id: user.id }))
  })

app.route("/chats/add")
  .post((req, res) => {
    let { name, users } = req.body
    if (!name) return res.send("Название чата не указано")
    Chat.create({ name, users }).then(chat => res.json({ id: chat.id }))
  })

app.route("/messages/add")
  .post((req, res) => {
    let { chat, author, text } = req.body
    if (!chat || !author || !text) return res.status(400).send("Укажите: id чата, id автора и текст сообщения")
    Message.create({ chat, author, text }).then(message => res.json({ id: message.id }))
  })

app.route("/chats/get")
  .post((req, res) => {
    let { user } = req.body
    if (!user) return res.status(400).send("Укажите id пользователя")
    Chat.findAll({ where: { users: { $contains: user } } }).then(chats => res.json(chats))
  })

app.route("/messages/get")
  .post((req, res) => {
    let { chat: id } = req.body
    if (!chat) return res.status(400).send("Введите id чата")
    Message.findAll({ where: { chat: id } })
      .then(messages => res.json(messages))
  })



app.listen(port, () => console.log(`listening ${port}`));
