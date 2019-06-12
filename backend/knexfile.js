const { db } = require('./.env')

module.exports = {  //CRIAR UMA CONFIGURAÇÃO PRA PRODUÇÃO E OUTRA PRA DESENVOLVIMENTO. EXEMPLO EM knex init
	client: 'postgresql',
	connection: db,
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
