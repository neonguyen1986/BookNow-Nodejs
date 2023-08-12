module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('doctor_infos', 'specialtyId', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn('doctor_infos', 'clinicId', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('doctor_infos', 'specialtyId');
        await queryInterface.removeColumn('doctor_infos', 'clinicId');
    },
};