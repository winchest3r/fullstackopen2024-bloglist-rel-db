const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled');
    await queryInterface.dropTable('sessions');
  }
};