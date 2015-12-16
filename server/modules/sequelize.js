

var Sequelize = require('sequelize');
var sequelize = null;

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    sequelize = new Sequelize(process.env.DATABASE_URL
        //    {
        //    dialect:  'postgres',
        //    protocol: 'postgres',
        //    port:     match[4],
        //    host:     match[3],
        //    logging:  true //false
        //}
    )
} else {
    // the application is executed on the local machine ... use mysql
    sequelize = new Sequelize('postgres://localhost:5432/open_arms_db')
}

module.exports = sequelize;
