var { db, helpers } = require('../db/database')

class Category {

  static insert(name, description) {
    var totalNumberOfVisits = 0;
    var blog_id = helpers.insertRow('INSERT INTO category (name, description, totalNumberOfVisits) VALUES (?, ?, ?)',
    [name, description, totalNumberOfVisits])
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

  static findTopcategories() {
    var rows = helpers.getRows('SELECT * FROM category ORDER BY totalNumberOfVisits DESC')
    return rows
  }

  static update(category_id){
    // get user logged in user's statistics record from the databse
    var row = helpers.getRow('SELECT totalNumberOfVisits FROM category WHERE category_id = ?', [category_id])
    var visitsToCategory = row.totalNumberOfVisits + 1;
    // update the original row in the database with the new statistics 
    var row2 = helpers.getRow('UPDATE category SET totalNumberOfVisits = ? WHERE category_id = ?', [visitsToCategory, category_id])
    return row2
  }

  // created constructor for the blog object
  constructor(databaseRow) {
    this.category_id = databaseRow.category_id
    this.name = databaseRow.name
    this.description = databaseRow.description
    this.totalNumberOfVisits = databaseRow.totalNumberOfVisits
  }
}

module.exports = Category