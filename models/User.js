var { db, helpers } = require('../db/database')

class User {
  //  method to insert data to the user table 
  static insert(name, email, passwordHash) {
    // run the insert query
    var userId = helpers.insertRow('INSERT INTO user (name, email, password_hash) VALUES (?, ?, ?)',[name, email, passwordHash])
    return userId
  }

  // method to find user with specific id in the user table
  static findById(userId) {
    var row = helpers.getRow('SELECT * FROM user WHERE user_id = ?', [userId])

    // if row is valid, construct a new user from the database row returned by the method.
    if (row) {
      return new User(row)
    } 
    // otherwise return null
    else {
      return null
    }
  }
  
  // method to find user with specific name in the user table
  static findByName(name) {
    var row = helpers.getRow('SELECT * FROM user WHERE name = ?', [name])

    // if row is valid, construct a new user from the database row returned by the method.
    if (row) {
      return new User(row)
    }
    // otherwise return null
    else {
      return null
    }
  }

  // method to find user with specific email in the user table
  static findByEmail(email) {
    var row = helpers.getRow('SELECT * FROM user WHERE email = ?', [email])

    // if row is valid, construct a new user from the database row returned by the method.
    if (row) {
      return new User(row)
    } 
    // otherwise return null
    else {
      return null
    }
  }

  // created method for testing purposes
  static getLastUserInDatabase(){
    var row = helpers.getRow('SELECT * FROM user ORDER BY user_id DESC LIMIT 1')
    return row;
  }

  // created method to delete a user record from the database
  static delete(userId) {
    var row = helpers.runAndExpectNoRows('DELETE FROM user WHERE user_id = ?', [userId])
  }

  // created constructor for the User object
  constructor(databaseRow) {
    this.userId = databaseRow.user_id
    this.name = databaseRow.name
    this.email = databaseRow.email
    this.passwordHash = databaseRow.password_hash
  }
}

module.exports = User
