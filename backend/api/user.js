const bcrypt = require('bcrypt-nodejs') //Serve para criptografar a senha do usuario. por hash

module.exports = app => {    

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10) //gera um hash diferente. inclusive para senhas iguais
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {  //o que é async await?
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        if(!req.originalUrl.startsWith('/users')) user.admin = false //Se a requisição não vier de '/users' user.admin = false
        if(!req.user || !req.user.admin) user.admin = false //se não existir user ou user.admin 

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado') //se existir gera o erro
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword //deleta pois este atributo não sera salvo no banco

        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users').select('id','name', 'email', 'admin')
            .whereNull('deletedAt')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getId = (req, res)=>{
        app.db('users')
            //.select('id', 'name', 'email', 'admin')
            .where({id:req.params.id})
            //.whereNull('deletedAt')    
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))

    } // ESTA FUNÇÃO NÃO SERA USADA

    const remove = async (req, res) => {
        try {
            const rowsUpdated = await app.db('users')
                .update({deletedAt: new Date()})
                .where({ id: req.params.id })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }
    
    return { save, get, remove, getId }
}