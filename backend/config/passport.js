const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = { //Parmetos especificos para Strategy
        secretOrKey: authSecret, //Segredo para decodificar o token
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //Extrai o token e coloca no Autorization
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false)) //done é a função que retorna
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false }) //como seria session true. controle de sessão
    }
}