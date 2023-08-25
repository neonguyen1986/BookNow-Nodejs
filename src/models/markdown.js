'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Markdown.belongsTo(models.User, { foreignKey: 'doctorId' })
        }
    };
    Markdown.init({
        doctorId: DataTypes.INTEGER,
        descriptionEn: DataTypes.TEXT,
        descriptionFr: DataTypes.TEXT,
        HTMLContentEn: DataTypes.TEXT,
        HTMLContentFr: DataTypes.TEXT,
        markdownContentEn: DataTypes.TEXT,
        markdownContentFr: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'Markdown',
    });
    return Markdown;
};