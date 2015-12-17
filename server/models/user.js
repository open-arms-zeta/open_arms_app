var Sequelize = require('sequelize');

var attributes = {
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    default_meal: {
        type: Sequelize.STRING
    },
    category_id: {
        type: Sequelize.INTEGER
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN
    },
    new_user: {
        type: Sequelize.BOOLEAN
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

var options = {
    freezeTableName: true
};

module.exports.attributes = attributes;
module.exports.options = options;