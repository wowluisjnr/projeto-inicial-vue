const app = require('express')() //Tem aulas sobre
const consign = require('consign')
const db = require('./config/db')

app.db = db //app.db recebendo db, me permite por conta do consign chamar 
            //o knex.() para fazer as consultas em qualquer arquivo

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js') // insiro em middleware.js o const app importado aqui
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(3000, () => {
    console.log('Backend executando...')
})