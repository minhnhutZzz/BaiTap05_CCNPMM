const User = require('./User');
const Profile = require('./Profile');
const OTP = require('./OTP');
const Category = require('./Category');
const Product = require('./Product');
const ProductImage = require('./ProductImage');

// Define Associations
User.hasOne(Profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(OTP, { foreignKey: 'user_id', onDelete: 'CASCADE' });
OTP.belongsTo(User, { foreignKey: 'user_id' });

Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  User,
  Profile,
  OTP,
  Category,
  Product,
  ProductImage
};
