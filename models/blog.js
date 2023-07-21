'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blog.belongsTo(models.user)
      blog.belongsTo(models.category)
      blog.hasMany(models.liked_blog, {as: 'userLikes'})

      blog.belongsToMany(models.keyword, {
        through: 'blog_keyword'
      })
      blog.belongsToMany(models.user, {
        through: 'liked_blog'
      })
    }
  }
  blog.init({
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoURL: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'blog',
  });
  return blog;
};