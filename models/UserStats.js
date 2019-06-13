var { db, helpers } = require('../db/database')

class UserStats {
  // created method to insert data to the userStats table
  static insert(numberFollowing, numberOfFollowers, blogsLogged, totalLikes, averageLikesPerBlog, user_id) {
    // run the insert query
    var userStats_id = helpers.insertRow('INSERT INTO userStats (numberFollowing, totalLikes, numberOfFollowers, averageLikesPerBlog, blogsLogged,  user_id) VALUES (?, ?, ?, ?, ?, ?)',[numberFollowing, numberOfFollowers, blogsLogged, totalLikes, averageLikesPerBlog, user_id])
    return userStats_id
  }

  // created method to find UserStats with specific user id in the blogs table 
  static findById(user_id) {
    var row = helpers.getRow('SELECT * FROM userStats WHERE user_id = ?', [user_id])

    // if row is valid, construct a new user stats record from the database row returned by the method.
    if (row) {
      return new UserStats(row)
    }
    // otherwise return null
    else {
      return null
    }
  }

  // // created method to return the top 5 users statistsic between the logged in user and users they follow
  // static getHoursBankedRanking(userId){
  //   // join user, userStats and followers tables, return user deatils and hoursBankedRanking in descending order
  //   var row = helpers.getRows(
  //     `select distinct name, email, hoursBanked, totalTasks, averageTimeTaken 
  //       from followers 
  //         inner join user on followers.userFollowingId = user.user_id  
  //           or followers.userId = user.user_id 
  //         inner join userstats on user.user_id = userStats.user_id where userid = ? 
  //       order by userStats.hoursBanked desc 
  //     limit 50`, [userId])
  //   return row;
  // }

  // // created method to return the top 5 users statistsic between the logged in user and users they follow
  // static getTotalTasksRanking(userId){
  //   // join user, userStats and followers tables, return user deatils and TotalTasksRanking in descending order
  //   var row = helpers.getRows(
  //     `select distinct name, email, hoursBanked, totalTasks, averageTimeTaken 
  //       from followers 
  //         inner join user on followers.userFollowingId = user.user_id  
  //           or followers.userId = user.user_id 
  //         inner join userstats on user.user_id = userStats.user_id where userid = ? 
  //       order by userStats.totalTasks desc 
  //     limit 50`, [userId])
  //   return row;
  // }

  // // created method to return the top 5 users statistsic between the logged in user and users they follow
  // static getAverageTimeRanking(userId){
  //    // join user, userStats and followers tables, return user deatils and AverageTimeRanking in descending order
  //   var row = helpers.getRows(
  //     `select distinct name, email, hoursBanked, totalTasks, averageTimeTaken 
  //       from followers  
  //         inner join user on followers.userFollowingId = user.user_id  
  //           or followers.userId = user.user_id 
  //         inner join userstats on user.user_id = userStats.user_id where userid = ? 
  //       order by userStats.averageTimeTaken desc 
  //     LIMIT 50`, [userId])
  //   return row;
  // }

  // created method to update a users statistics record in the database
  
  static update(user_id){
    // get user logged in user's statistics record from the databse
    var row = helpers.getRow('SELECT blogsLogged FROM userStats WHERE user_id = ?', [user_id])

    // add 1 to the value of the blogs Logged column of the database
    var blogsLogged = row.blogsLogged += 1;

    // update the original row in the database with the new statistics 
    var row2 = helpers.getRow('UPDATE userStats SET blogsLogged = ? WHERE user_id = ?', [blogsLogged, user_id])
    return row2
  }

  /*  created method to be called when a blog record is edited. This method reverses the stats from the original blog,
  then the update method is called and the users stats record is recalculated with the new blog.    */
  static updateOnRemovalOfblog(user_id){
    // get user logged in user's statistics record from the databse
    var row = helpers.getRow('SELECT blogsLogged FROM userStats WHERE user_id = ?', [user_id])

    // remove 1 from the value of the blogs Logged column of the database
    var blogsLogged = row.blogsLogged -= 1;
    // update the original row in the database with the new statistics 
    var row2 = helpers.getRow('UPDATE userStats SET blogsLogged = ? WHERE user_id = ?', [blogsLogged, user_id])
    return row2;
  }

  // created method to delete a statistic record (used on deletion of an account)
  static delete(userId) {
    var row = helpers.runAndExpectNoRows('DELETE FROM userStats WHERE user_id = ?', [userId])
  }
  
  // created constructor for the UserStats object
    constructor(databaseRow) {
    this.userStats_id = databaseRow.userStats_id
    this.numberFollowing = databaseRow.numberFollowing
    this.numberOfFollowers = databaseRow.numberOfFollowers
    this.blogsLogged = databaseRow.blogsLogged
    this.totalLikes = databaseRow.totalLikes
    this.averageLikesPerBlog = databaseRow.averageLikesPerBlog
    this.user_id = databaseRow.user_id
    this.userName = databaseRow.name
  }
}

module.exports = UserStats

