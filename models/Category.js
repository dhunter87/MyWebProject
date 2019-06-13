var { db, helpers } = require('../db/database')

class Category {

  static insert(name, description) {
    var blog_id = helpers.insertRow('INSERT INTO category (name, description) VALUES (?, ?)',
    [name, description])
    return blog_id
  }


  // created constructor for the blog object
  constructor(databaseRow) {
    this.category_id = databaseRow.category_id
    this.name = databaseRow.name
    this.description = databaseRow.description
  }
}

module.exports = Category