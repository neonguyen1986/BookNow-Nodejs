'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Markdowns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctorId: { allowNull: false, type: Sequelize.INTEGER },
            descriptionEn: { allowNull: false, type: Sequelize.TEXT },
            descriptionFr: { allowNull: false, type: Sequelize.TEXT },
            HTMLContentEn: { allowNull: false, type: Sequelize.TEXT },
            HTMLContentFr: { allowNull: false, type: Sequelize.TEXT },
            markdownContentEn: { allowNull: false, type: Sequelize.TEXT },
            markdownContentFr: { allowNull: false, type: Sequelize.TEXT },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Markdowns');
    }
};
