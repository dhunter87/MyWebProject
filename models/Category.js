var { db, helpers } = require('../db/database')

class Category {


  // created constructor for the blog object
  constructor(databaseRow) {
    this.category_id = databaseRow.category_id
    this.name = databaseRow.name
    this.description = databaseRow.description
  }
}

module.exports = Category