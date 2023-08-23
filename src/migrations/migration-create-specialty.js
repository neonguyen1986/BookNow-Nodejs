'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Specialties', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nameEn: { allowNull: false, type: Sequelize.STRING },
            nameFr: { allowNull: false, type: Sequelize.STRING },
            image: { allowNull: false, type: Sequelize.STRING, },
            descriptionHTML_En: { allowNull: false, type: Sequelize.TEXT },
            descriptionHTML_Fr: { allowNull: false, type: Sequelize.TEXT },
            descriptionMarkdown_En: { allowNull: false, type: Sequelize.TEXT },
            descriptionMarkdown_Fr: { allowNull: false, type: Sequelize.TEXT },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Specialties');
    }
};
