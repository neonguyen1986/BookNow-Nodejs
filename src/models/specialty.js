'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Specialty.hasMany(models.Doctor_Info, { foreignKey: 'specialtyId', as: 'specialtyName' })

        }
    };
    Specialty.init({
        nameEn: DataTypes.STRING,
        nameFr: DataTypes.STRING,
        descriptionHTML_En: DataTypes.TEXT,
        descriptionHTML_Fr: DataTypes.TEXT,
        descriptionMarkdown_En: DataTypes.TEXT,
        descriptionMarkdown_Fr: DataTypes.TEXT,
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Specialty',
    });
    return Specialty;
};