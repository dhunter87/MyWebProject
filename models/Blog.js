var { db, helpers } = require('../db/database')

class Blog {
  // created method to insert data to the blog table 
  static insert(title, description, duration, rating, likes, dateOfActivity, userId, category_id) {

    var dateTime = Blog.GetDateTime();

    var blog_id = helpers.insertRow('INSERT INTO blog (title, description, duration, rating, likes, dateOfBlog, dateOfActivity, user_id, category_id) VALUES (?, ?, ?, ?, ?,   ?, ?, ?, ?)',
    [title, description, duration, rating, likes,  dateTime, dateOfActivity, userId, category_id])
    return blog_id
  }

  // created method to find blog with specific id in the blog table 
  static findById(blog_id) {
    var row = helpers.getRow('SELECT * FROM blog WHERE blog_id = ?', [blog_id])

    // if row is valid, construct a new blog from the database row returned by the method.
    if (row) {
      return new Blog(row)
      // else retrurn null
    } else {
      return null
    }
  }

  // created method to find blog with specific task description in the blog table 
  static findByTask(task) {
    var row = helpers.getRow('SELECT * FROM blog WHERE task= ?', [task])

    // if row is valid, construct a new blog from the database row returned by the method.
    if (row) {
      return new Blog(row)
      // else retrurn null
    } else {
      return null
    }
  }

  // created method to find all of the blog related to a specified user
  static findAllByUserId(user_id) {
    var rows = helpers.getRows('SELECT * FROM blog WHERE user_id = ?', [user_id])
    return rows
  }

  // created method to find all of the blog related to a specified user
  static findAllByCategory(category_id) {
    var rows = helpers.getRows('SELECT * FROM blog WHERE category_id = ?', [category_id])
    return rows
  }

  // created method to get all fo the blog for the logged in user and all of the users they follow in date order (including correspondiong users data from users table)
  static getTCommunityBlogs(user_id){
    var timeLine = helpers.getRows(`select distinct name, email, blog.* from followers inner join user on followers.userFollowingId = user.user_id or followers.userId = user.user_id inner join blog on user.user_id = blog.user_id where userid = ? order by dateOfBlog`, [user_id]);
    return timeLine
  }

  // created method to update a blog record in the database
  static update(blog_id, title, description, duration, rating, dateOfBlog, dateOfActivity){
    var row = helpers.runAndExpectNoRows('UPDATE blog SET title = ?, description = ?, duration = ?, rating = ?, dateOfBlog = ?, dateOfActivity = ? WHERE blog_id = ?', [title, description, duration, rating, dateOfBlog, dateOfActivity, blog_id])
  }

  // created method to delete a blog record from the database
  static delete(blog_id){
    var row = helpers.runAndExpectNoRows('DELETE FROM blog WHERE blog_id = ?', [blog_id])
  }
  
  static GetDateTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + 'T' + time;
    return dateTime;
  }

  // created constructor for the blog object
  constructor(databaseRow) {
    this.blog_id = databaseRow.blog_id
    this.title = databaseRow.title
    this.description = databaseRow.description
    this.duration = databaseRow.duration
    this.rating = databaseRow.rating
    this.likes = databaseRow.likes
    this.dateOfBlog = databaseRow.dateOfBlog
    this.dateOfActivity = databaseRow.dateOfActivity
    this.user_id = databaseRow.user_id
    this.category_id = databaseRow.category_id
  }
}

module.exports = Blog