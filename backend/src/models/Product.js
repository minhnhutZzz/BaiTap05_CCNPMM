const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_promotion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    tableName: 'products',
    timestamps: true,
  }
);

module.exports = Product;
