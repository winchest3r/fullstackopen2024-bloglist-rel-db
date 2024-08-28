const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readinglists');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList });

Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

User.hasMany(ReadingList);
ReadingList.belongsTo(User);

module.exports = {
  Blog, User, ReadingList
};