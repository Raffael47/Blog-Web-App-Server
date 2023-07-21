'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class liked_blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      liked_blog.belongsTo(models.blog);
      liked_blog.belongsTo(models.user);
    }
  }
  liked_blog.init({
    
  }, {
    sequelize,
    modelName: 'liked_blog'
  });
  return liked_blog;
};