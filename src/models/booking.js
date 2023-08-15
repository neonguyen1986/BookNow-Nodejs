'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeBooking' })
            Booking.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientInfo' })

        }
    };
    Booking.init({
        statusId: DataTypes.STRING,
        doctorId: DataTypes.INTEGER, // chính là ID của bảng User
        patientId: DataTypes.INTEGER,
        date: DataTypes.STRING, //date là kiểu timestamp, nghĩa là ngày được lưu dưới 1 chuỗi số
        timeType: DataTypes.STRING,
        fileLink: DataTypes.STRING,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};
