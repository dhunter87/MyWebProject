const Followers = require('../models/Followers');

// SET UP ALL TEST DATA

// CREATE - insert, new followers record (loggedInUserId, userToFollowId))
// created multiple associations between users

var id_1 = 99;
var id_2 = 98;
var id_3 = 97;

var id_4 = 95;
var id_5 = 94;

Followers.insert(id_1,id_2)
Followers.insert(id_2,id_1)
Followers.insert(id_3,id_1)
Followers.insert(id_1,id_3)
Followers.insert(id_2,id_3)
Followers.insert(id_3,id_2)

Followers.insert(id_4,id_5)
Followers.insert(id_5,id_4)


// READ - findPeopleLoggedInuserIsFollowing, method should return all the people the logged in user is following
var user1following = Followers.findPeopleLoggedInuserIsFollowing(id_1);
var user2following = Followers.findPeopleLoggedInuserIsFollowing(id_2);
var user3following = Followers.findPeopleLoggedInuserIsFollowing(id_3);

// confirm userm 99 is now following 2 users
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (user 99) from the database', () => {
    expect(user1following[0]).toEqual(
        {
            userFollowingId: id_3 
        })
    expect(user1following[1]).toEqual(
        {
            userFollowingId: id_2 
        })
});

// confirm user 98 is now following 2 users
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (user 98) from the database', () => {
    expect(user2following[0]).toEqual(
        {
            userFollowingId: id_3 
        })
    expect(user2following[1]).toEqual(
        {
            userFollowingId: id_1 
        })
});

// confirm user 97 is now following 2 users
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (user 97) from the database', () => {
    expect(user3following[0]).toEqual(
        {
            userFollowingId: id_2 
        })
    expect(user3following[1]).toEqual(
        {
            userFollowingId: id_1 
        })
});


// READ - findPeopleFollowingLoggedInUser, method should return all the people following the logged in user
var user1followers = Followers.findPeopleFollowingLoggedInUser(id_1);
var user2followers = Followers.findPeopleFollowingLoggedInUser(id_2);
var user3followers = Followers.findPeopleFollowingLoggedInUser(id_3);

// confirm user id_1 now has 2 followers
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (with specific user id) from the database', () => {
    expect(user1followers[0]).toEqual(
        {
            userId: id_2 
        })
    expect(user1followers[1]).toEqual(
        {
            userId: id_3 
        })
});
// confirm user id_2 now has 2 followers
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (with specific user id) from the database', () => {
    expect(user2followers[0]).toEqual(
        {
            userId: id_1 
        })
    expect(user2followers[1]).toEqual(
        {
            userId: id_3 
        })
});
// confirm user id_3 now has 2 followers
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (with specific user id) from the database', () => {
    expect(user3followers[0]).toEqual(
        {
            userId: id_1 
        })
    expect(user3followers[1]).toEqual(
        {
            userId: id_2 
        })
});

// DELETE - delete, should delete the contribution 
Followers.delete(id_4)

// confirm the user associations have been deleted
var user4following = Followers.findPeopleLoggedInuserIsFollowing(id_4);
var user4followers = Followers.findPeopleFollowingLoggedInUser(id_4);
test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (user 99) from the database', () => {
    expect(user4following).toEqual([])
});

test('confirm findPeopleLoggedInuserIsFollowing method reads a users followers record (with specific user id) from the database', () => {
    expect(user4followers).toEqual([])
});