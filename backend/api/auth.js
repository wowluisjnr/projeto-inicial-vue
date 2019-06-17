const { authSecret } = require('../.env') //chave pela qual sera gerada o tokem
const jwt = require('jwt-simple') // https://jwt.io/   framework que gerara o tokem atraves do authsecret
const bcrypt = require('bcrypt-nodejs') //Necessario para comparar as senhas, do banco com a que foi recebida

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)//compara os hash gerados das senhas
        if (!isMatch) return res.status(401).send('Email/Senha inválidos!')

        const now = Math.floor(Date.now() / 1000) // data atual de uma data x em segundos

        const payload = {  //conteudo do tokem
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, //data de geração do tokem
            exp: now + (60 * 60 * 24 * 3) //tempo de validade do tokem. Pode ser trocado sempre que usuario abrir a pagina
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) //gera o tokem a partir do authSecret, que sera enviado para o cliente
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret) //armazena o tokem
                if(new Date(token.exp * 1000) > new Date()) {
                    //aqui pode se gerar um tokem novo
                    return res.send(true) 
                }
            }
        } catch(e) {
            // problema  //se gerou tokem com authSecret diferente
        }

        res.send(false)
    }
    const validateAdmin = async (req, res) =>{
        const userData = req.body || null
        try{
            if(userData) {                
                const user = await app.db('users')
                    .where({ email: userData.email })
                    .first()
                if(user.admin) {
                    return res.send(true) 
                }
            }                       

        }
        catch(e){}

        res.send(false)
    }

    return { signin, validateToken, validateAdmin }
}