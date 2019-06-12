// const user = require('../api/user')
const admin = require('./admin') //tem a função middware que verifica se é admin
//....post(user.save)

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)


    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.user.get))
        .post(admin(app.api.user.save))

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        //.get(app.api.user.getId) //Função não sera usada
        .put(admin(app.api.user.save))
        .delete(admin(app.api.user.remove))

}