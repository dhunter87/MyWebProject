var express = require('express')
var bcrypt = require('bcryptjs')
var routes = new express.Router()
var saltRounds = 10

var User = require('./models/User')
var Blog = require('./models/Blog')
var UserStats = require("./models/UserStats")
var Followers = require("./models/Followers")
var Category = require("./models/Category")
var Interest = require("./models/Interest")

const jwt = require('jsonwebtoken')

// main page
routes.get('/', function(req, res) {
    // if we've got a user id, assume we're logged in and redirect to the app:
    res.render('index.html')

})

// show the create account page
routes.get('/create-account', function(req, res) {
  res.render('create-account.html')
})

// handle create account forms:
routes.post('/create-account', function(req, res) {
  
  var form = req.body

  if (User.findByEmail(form.email) != null) {
    res.render('sign-in.html', {
      errorMessage: 'A user with this Email already exists'
    })
  
    return;
  }
  else {
    // hash the password - we dont want to store it directly
    var passwordHash = bcrypt.hashSync(form.password, saltRounds)

    // create the user
    var newUser = User.insert(form.name, form.email, passwordHash)

    // find new users
    var userId = User.findByName(form.name).userId

    // create userStats record for the new user
    var userStats = UserStats.insert(0, 0, 0, 0, 0, userId)

    // set the userId as a cookie
    var token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: 60*60 })
    res.cookie("jwt-token", token, { signed: true, httpOnly: true});

    // redirect to the logged in page
    res.redirect('/blogs')

  }
})

// show the sign-in page
routes.get('/sign-in', function(req, res) {
  res.render('sign-in.html')
})

// handle the post to sign-in request
routes.post('/sign-in', (req, res) => {

  var form = req.body
  // find user in databse equal to the user passed into the form
  var user = User.findByEmail(form.email)

  // if findByEmail does not return a null value hash password and check against users hashed password
  if (user != null) {
    if (bcrypt.compareSync(form.password, user.passwordHash)) {

      // if hashed passwords match, set jsonwebtoken cookie
      var token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: 60*60 })
      res.cookie("jwt-token", token, { signed: true, httpOnly: true});

      // redirect to the main page
     return res.redirect('/blogs')
    }
    // if hashed passwords do not match, render the sign-in screen with an error message
    else {
      res.render('sign-in.html', {
        errorMessage: 'Email address and password do not match'
      })
    }
  }
  // if findByEmail does return a null value, render the sign-in screen with an error message
  else {
    res.render('sign-in.html', {
      errorMessage: 'No user with that email exists'
    })
  }
})

// handle signing out
routes.get('/sign-out', Verify, function(req, res) {
  // clear the userId & jwt-token cookies
  res.clearCookie('jwt-token')
  res.clearCookie('userId')


  // redirect to the login screen
  res.redirect('/')
})

// list all job blogs
routes.get('/blogs', Verify, (req, res) => {

  // find the user logged in using the verify method's user id
  var loggedInUser = User.findById(req.user.userId)

  var topCategories = Interest.findUsersTop3Interests(loggedInUser.userId)
  console.log("logged in user : " + loggedInUser.userId);
  console.log("logged in user : " + loggedInUser.name);
  console.log("top categories 1");
  console.log(topCategories)
  
  if(topCategories[0] == undefined)
  {
    var topCategories = Interest.findTop3categories()
    console.log("top categories 2");
    
    console.log(topCategories)
  }


  try
  {
    var catName1 = Category.findById(topCategories[0].category_id).name
    var catName2 = Category.findById(topCategories[1].category_id).name
    var catName3 = Category.findById(topCategories[2].category_id).name

    var blogsForCategory = Blog.findAllByCategory(topCategories[0].category_id)
    var blogsForCategory1 = Blog.findAllByCategory(topCategories[1].category_id)
    var blogsForCategory2 = Blog.findAllByCategory(topCategories[2].category_id)

  }catch(exception)
  {

  }
  
  // render stats for the user logged in
  res.render('list-blogs.html', {
    user: loggedInUser,

    categoryName1: catName1,
    categoryName2: catName2,
    categoryName3: catName3,
    // render the blogs (for user id) from the blogs database table
    // blogs: blogs

    blogs1: blogsForCategory,
    blogs2: blogsForCategory1,
    blogs3: blogsForCategory2

  })
})

// show the create blog form
routes.get('/blogs/new', Verify, function(req, res) {

  var loggedInUser = User.findById(req.user.userId)

  // if the current user is logged in successfully render the create blogs screen
  if(loggedInUser){
    res.render('create-blog.html', {
      user: loggedInUser
    })
  } 
  // if the user is not logged in, inform user they must sign in to create a new blog.
  else {
    res.render('sign-in.html', {
      errorMessage: 'You must be logged in to create a new contribbution'
    })
  }
})

// handle the create blog form
routes.post('/blogs/new', Verify, function(req, res) {

  var form = req.body
  var user_id = req.user.userId

  // save the new blog into the database
  var blog = Blog.insert(form.title, form.description, form.duration, form.rating, 0, form.dateOfActivity, user_id, form.category_id)
  // get user stats, edit user stats, post user stats
  var updatedStats = UserStats.update(user_id, parseInt(form.duration), parseInt(form.rating, parseInt(form.category_id)))
  
  // redirect back to main screen
  res.redirect('/blogs')
})

// show the edit blog form for a specific blog
routes.get('/blogs/:id', Verify, function(req, res) {

  // get the blog of for the id passed in as a perameter
  var blog = Blog.findById(req.params.id)

  // get user details of logged in user
  var loggedInUser = User.findById(req.user.userId)

  // construct the real blog record for this id from the database
  var blogRecord = {
    blog_id: req.params.id,
    title: blog.title,
    description: blog.description,
    duration: blog.duration,
    rating: blog.rating,
    dateOfBlog: blog.dateOfBlog,
    dateOfActivity: blog.dateOfActivity
  }

  // render the edit-contribtuions screen with the users details and all their contribtuions
  res.render('edit-blog.html', {
    user: loggedInUser,
    blog: blogRecord
  })
})

// handle the edit blog form
routes.post('/blogs/:id', Verify, function(req, res) {
  var loggedInUser = User.findById(req.user.userId)
  var form = req.body
  var blogId = req.params.id
  //var user_id = req.cookies.userId

  var blog = Blog.findById(blogId)
  // get user details of logged in user
  
  // if the logged in user is the owner of the blog we asre trying to edit
  if(loggedInUser.userId == blog.user_id)
  {
    // To edit the blog and users statistics in the database:
    // find the original blog we are trying to edit
    var originalBlog = Blog.findById(blogId)

    // remove the original blog stats from the users statistics db
    var firstLevelUpdateStats = UserStats.updateOnRemovalOfBlog(loggedInUser.userId, parseInt(originalBlog.duration))

    // update the blog record with the new blog details.
    var updatedBlog = Blog.update(blogId, form.title, form.description, form.duration, form.rating, form.dateOfBlog, form.dateOfActivity)

    // update the users stats with the new/edited contrbutions statistics
    var secondLevelUpdateStats = UserStats.update(loggedInUser.userId, parseInt(form.duration))

    // redirect to main page
    res.redirect('/blogs')
  }
  // if the logged in user is not the owner of the blog we asre trying to edit
  else{
    // render the edit-blogs page with the error message displayed, loggedInUser details and the blog record we are looking at
    res.render('edit-blog.html', {
      errorMessage: 'Unable to edit blog! You are not the owner of this blog',
      user: loggedInUser,
      blog: blog
    })
  }

})

// handle deleteing the blog
routes.get('/blogs/:id/delete', Verify, function(req, res) {
  var blogId = req.params.id
  var blog = Blog.findById(blogId)
  // get user details of logged in user
  var loggedInUser = User.findById(req.user.userId)

  // if the logged in user is the owner of the blog we asre trying to delete
  if(loggedInUser.userId == blog.user_id)
  {
    // delete the blog from the database
    var deletedBlog = Blog.delete(blogId)
    // re-calculate the users stats. The deleted blog and its duration will be subtracted from the users overall statistics
    var updatedUserStats = UserStats.updateOnRemovalOfblog(loggedInUser.userId)

    // redirect to the main page
    res.redirect('/blogs')
  }
  // if the logged in user is not the owner of the blog we asre trying to delete
  else{
    // render the edit-blogs page with the error message displayed, loggedInUser details and the blog record we are looking at
    res.render('edit-blog.html', {
      errorMessage: 'Unable to delete blog! You are not the owner of this blog',
      user: loggedInUser,
      blog: blog
    })
  }
  
})

// show the followers page
routes.get('/followers', Verify, function(req, res) {

    // get user details of logged in user
    var loggedInUser = User.findById(req.user.userId)

    // if user is not logged in, redirect to the log-in page
    if (!loggedInUser) {
      res.redirect('/sign-in')
      return;
    }

    // get all the users details of the people the logged in user is following.
    var usersFollowing = Followers.findPeopleLoggedInuserIsFollowing(loggedInUser.userId);
    // get all the users details for all the people that ate following the logged in user.
    var usersFollowed = Followers.findPeopleFollowingLoggedInUser(loggedInUser.userId);

    // else - render the followers screen and the UsersFollowing and UsersFollowed tables
    res.render('followers.html', {
      user: loggedInUser,
      UsersFollowing: usersFollowing,
      UsersFollowed: usersFollowed,
  })
})
        
// handle the follow users form:
routes.post('/followers', Verify, function(req, res){

  var form = req.body

  // find the logged in user from the requst user id
  var loggedInUser = User.findById(req.user.userId)
  // find users in the system with an email address equal to the email passed in on the form
  var userToBeFollowed = User.findByEmail(form.email)

  // find all the users the logged in user is already following
  var usersImFollowing = Followers.findPeopleLoggedInuserIsFollowing(loggedInUser.userId);
  // find all the users that are following the logged in user
  var usersFollowingMe = Followers.findPeopleFollowingLoggedInUser(loggedInUser.userId);

  // bool value to control the flow of the program
  var userExistsInCollection = false;
  
  // check if the user to be followed has already been followed or is the logged in user
  usersImFollowing.forEach(user => {
    if(user.email == userToBeFollowed.email || loggedInUser.email == userToBeFollowed.email){ 
      userExistsInCollection = true;
      return;
    }
  });

  // if user is not already followed by the logged in user
  if(!userExistsInCollection)
  {
    // insert new followers record
    Followers.insert(loggedInUser.userId, userToBeFollowed.userId)

    // redirect to the main page
    res.redirect('/blogs')
    return;
  }
  else{
    // otherwise render the followers screen with error message, logged in user details and the followers tables
    res.render('followers.html', {
      errorMessage: 'Unable to follow this user, make sure details are correct!',
      user: loggedInUser,
      UsersFollowing: usersImFollowing,
      UsersFollowed: usersFollowingMe
    })
  }
})

// show the timeline page
routes.get('/timeline', Verify, function(req, res) {
    // get user details of logged in user
    var loggedInUser = User.findById(req.user.userId)

    // if user is not logged in, redirect to the log-in page
    if (!loggedInUser) {
      res.redirect('/sign-in')
      return;
    }

    // get all blogs for the logged in user and all of the users that they are following
    var blogs = Blog.getTimelineBlogs(loggedInUser.userId)
    // find the userStats assocciated with the logged in user
    var stats = UserStats.findById(loggedInUser.userId) 

    // // get hoursBanked ranking stats from databases
    // var hoursBankedRanking = UserStats.getHoursBankedRanking(loggedInUser.userId)
    // // get totalTasksRanking ranking stats from databases
    // var totalTasksRanking = UserStats.getTotalTasksRanking(loggedInUser.userId)
    // // get averageTimeRanking ranking stats from databases
    // var averageTimeRanking = UserStats.getAverageTimeRanking(loggedInUser.userId)

    // else - render the timeline screen with logged in users details, ranking tables and timeline blogs
  //   res.render('timeline.html', {
  //     user: loggedInUser,
  //     HoursBankedRanking: hoursBankedRanking,
  //     TotalTasksRanking: totalTasksRanking,
  //     AverageTimeRanking: averageTimeRanking,
  //     blogs: blogs  
  // })
})

// show the delete-account page
routes.get('/delete-account', Verify, function(req, res) {
  // get user details of logged in user
  var loggedInUser = User.findById(req.user.userId)
  // if user is not logged in, redirect to the log-in page
  if (!loggedInUser) {
    res.redirect('/sign-in')
    return;
  }
  // render the delete-account screen
  res.render('delete-account.html', {
    user: loggedInUser
  })
})

// handle delete-account form:
routes.post('/delete-account', Verify, function(req, res) {

  var form = req.body
  var userId = req.user.userId
  // get user details of logged in user
  var loggedInUser = User.findById(userId)

  // if user is not logged in, redirect to the log-in page
  if (!loggedInUser)
  {
    // redirect to the log-in page
    res.redirect('/sign-in')
    return;
  }
  // else - delete a user from the database
  else{
    // if all the details passed into the for are equal to the details of the user logged in
    if(form.name == loggedInUser.name &&
      form.email == loggedInUser.email &&
      bcrypt.compareSync(form.password, loggedInUser.passwordHash)){

        // delete the user from the database
        User.delete(userId)
        // delete the user's statistics from the database
        UserStats.delete(userId)
        // delete the user's associations with other users from the database
        Followers.delete(userId)

        // after deleting an account - redirect to the sign-in in page
        res.redirect('/sign-in')      
      }
      else{
         // if account deletion is unsuccessful, redirect to main page
        res.redirect('/blogs')
      }
  }
})

// created method to handle sign-in verification
function Verify(req, res, next){
  try {
    // find the user by id, pass user details .env variables into jwt.verify method
    var LoggedInUser = User.findById(jwt.verify(req.signedCookies["jwt-token"], process.env.JWT_SECRET).userId)
    if (LoggedInUser == null) 
    {
      // if user id not found in database, render the sign-in page
      return res.redirect('/sign-in')
    }

  } catch(err) {
    // if an exception is thrown, render the sign-in page
    return res.redirect('/sign-in')
  }
  // set the request user equal to logged in user
  req.user = LoggedInUser;
  next();
};


module.exports = routes
