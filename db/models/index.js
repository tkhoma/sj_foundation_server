'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../database.json')[env];
let   db        = {};

let sequelize = config.use_env_variable ?
    new Sequelize(process.env[config.use_env_variable]) :
    new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        let model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// TODO: move next associations into associate block

db['projects'].hasOne(db['projectStats'], {
    foreignKey: 'projectId',
    as: 'projectStats'
});

db['projects'].belongsTo(db['categories'], {
    foreignKey: 'categoryId',
    as: 'category'
});

db['categories'].hasMany(db['projects'], {
    foreignKey: 'categoryId',
});

db['projectStats'].belongsTo(db['projects'], {
    foreignKey: 'projectId',
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
