class User {
    constructor(username){
        this.username   = username;
        this.created_at = Date.now();
    }
}

class Chat {
    constructor(name, users){
        this.name       = name;
        this.users      = users;
        this.messages   = [];
        this.created_at = Date.now();
    }
}

class Message {
    constructor(chat, author, text){
        this.chat       = chat;
        this.author     = author;
        this.text       = text;
        this.created_at = Date.now();
    }
}

module.exports = {
    User,
    Chat,
    Message
}