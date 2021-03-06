var { db, helpers } = require('../db/database')

class Interest {

  static insert(visitsToCategory, user_id, category_id) {
    var interest_id = helpers.insertRow('INSERT INTO interest (visitsToCategory, user_id, category_id) VALUES (?, ?, ?)',
    [visitsToCategory, user_id, category_id])
    return interest_id
  }

  static update(user_id, category_id){
    // get user logged in user's statistics record from the databse
    var row = helpers.getRow('SELECT visitsToCategory FROM interest WHERE user_id = ? AND category_id = ?', [user_id, category_id])
    var visitsToCategory
    try
    {
      console.log("try block exectured");
      
      visitsToCategory = row.visitsToCategory += 1;
    }
    catch(err)
    {
      console.log("catch block exectured");
      visitsToCategory = 1;
      helpers.insertRow('INSERT INTO interest (visitsToCategory, user_id, category_id) VALUES (?, ?, ?)',[visitsToCategory, user_id, category_id])
    }
    // update the original row in the database with the new statistics 
    var row2 = helpers.getRow('UPDATE interest SET visitsToCategory = ? WHERE user_id = ? AND category_id = ?', [visitsToCategory, user_id, category_id])
    return row2
  }

    // created method to find blog with specific id in the blog table 
    static findById(interest_id) {
      var row = helpers.getRow('SELECT * FROM interest WHERE interest_id = ?', [interest_id])
  
      // if row is valid, construct a new blog from the database row returned by the method.
      if (row) {
        return new Interest(row)
        // else retrurn null
      } else {
        return null
      }
    }

    // created method to find blog with specific id in the blog table 
  static findUsersTop3Interests(user_id) {
    var rows = helpers.getRows('SELECT * FROM interest Where user_id = ? ORDER BY visitsToCategory DESC LIMIT 3', [user_id])
    return rows
  }


  // created constructor for the blog object
  constructor(databaseRow) {
    this.interest_id = databaseRow.interest_id
    this.visitsToCategory = databaseRow.visitsToCategory
    this.user_id = databaseRow.user_id
    this.category_id = databaseRow.category_id
  }
}

module.exports = Interest