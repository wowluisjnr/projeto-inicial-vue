//Middleware é o software de computador que fornece serviços para softwares aplicativos além daqueles 
//disponíveis pelo sistema operacional.

const bodyParser = require('body-parser') // Interpreta o body da requisição
const cors = require('cors') //Permite que a partir de uma outra aplicação a api backend seja acessada

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}