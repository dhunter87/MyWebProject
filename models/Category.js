var { db, helpers } = require('../db/database')

class Category {

  static insert(name, description) {
    var blog_id = helpers.insertRow('INSERT INTO category (name, description) VALUES (?, ?)',
    [name, description])
    return blog_id
  }

  static findById(category_id) {
    var row = helpers.getRow('SELECT * FROM category WHERE category_id = ?', [category_id])

    // if row is valid, construct a new user from the database row returned by the method.
    if (row) {
      return new Category(row)
    } 
    // otherwise return null
    else {
      return null
    }
  }


  // created constructor for the blog object
  constructor(databaseRow) {
    this.category_id = databaseRow.category_id
    this.name = databaseRow.name
    this.description = databaseRow.description
  }
}

module.exports = Category