const Mysqli = require('mysqli');

let conn = new Mysqli({
    host:'localhost',
    post:3306,
    user:'youngboy',
    pass:'a123456',
    db:'db_shop'
})

let db = conn.emit(false,'');

module.exports = {
    database:db
}