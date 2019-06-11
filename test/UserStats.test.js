const UserStats = require('../models/UserStats');
const Followers = require('../models/Followers');
const User = require('../models/User')

// SET UP ALL TEST DATA

// create new user records
User.insert('test1', 'test1@test.com', 'erciuxhsijnaepwuifnhoiwvuocdiuhejwcejh')
User.insert('test2', 'test2@test.com', 'saceuioefucysiuedjwixcneuiorcnoxedoidm')
User.insert('test3', 'test3@test.com', 'wlediuxheidpieu3uiwcfhuvcenzioxrejhkci')

// store user_id's into a variables
var user1_id = User.findByName('test1').userId
var user2_id = User.findByName('test2').userId
var user3_id = User.findByName('test3').userId

// created multiple associations between users in order to generate rankings
Followers.insert(user1_id,user2_id)
Followers.insert(user2_id,user1_id)
Followers.insert(user3_id,user1_id)
Followers.insert(user1_id,user3_id)
Followers.insert(user2_id,user3_id)
Followers.insert(user3_id,user2_id)

// CREATE - insert, new user statistics record (hoursBanked, totalTasks, averageTimeTaken, user_id)
UserStats.insert(5,5,1,user1_id);
UserStats.insert(10,2,5,user2_id);
UserStats.insert(9,1,9,user3_id);

// READ - findById, method should create and return a new User Statistic object
var stats = UserStats.findById(user1_id);
test('confirm findById method returns a statistics object', () => {
    expect(stats).toBeInstanceOf(UserStats)
});

// READ - findById, method should create and return a new User Statistic object with correct values
var Statistics =  UserStats.findById(user1_id);
test('confirm update method edits a users stats record with the mew stats included', () => {
    expect(Statistics).toEqual(
    {
        userStats_id: Statistics.userStats_id,
        hoursBanked: 5,
        totalTasks: 5,
        averageTimeTaken: 1,
        user_id: user1_id,
        userName: undefined
    })
});

// READ - getHoursBankedRanking, method should return the top 5 ranked users hoursBanked stats from the user logged in and the people they follow
var top5HoursBanked = UserStats.getHoursBankedRanking(user1_id);

test('confirm getHoursBankedRanking method returns a statistics object', () => {
    expect(top5HoursBanked[0]).toEqual(
    { 
        name: 'test2',
        email: 'test2@test.com',
        hoursBanked: 10,
        totalTasks: 2,
        averageTimeTaken: 5 
    })
});

// READ - getTotalTasksRanking, method should return the top 5 ranked users totalTasks stats from the user logged in and the people they follow
var top5TotalTasks = UserStats.getTotalTasksRanking(user1_id);

test('confirm getTotalTasksRanking method returns a statistics object', () => {
    expect(top5TotalTasks[0]).toEqual(
    { 
        name: 'test1',
        email: 'test1@test.com',
        hoursBanked: 5,
        totalTasks: 5,
        averageTimeTaken: 1 
    })
});

// READ - getAverageTimeRanking, method should return the top 5 ranked users averageTimeTaken stats from the user logged in and the people they follow
var top5AverageTimes = UserStats.getAverageTimeRanking(user1_id);
test('confirm getAverageTimeRanking method returns a statistics object', () => {
    expect(top5AverageTimes[0]).toEqual(
    { 
        name: 'test3',
        email: 'test3@test.com',
        hoursBanked: 9,
        totalTasks: 1,
        averageTimeTaken: 9   
    })
});


// UPDATE - update, should update the statistic (used on creation of a new contribution)
UserStats.update(user2_id, 1);

// create test to see if update had updated a statistics record in database
var newStatistics =  UserStats.findById(user2_id);
test('confirm update method edits a users stats record with the mew stats included', () => {
    expect(newStatistics).toEqual(
    {
        userStats_id: newStatistics.userStats_id,
        hoursBanked: 11,
        totalTasks: 3,
        averageTimeTaken: 3.6666666666666665,
        user_id: newStatistics.user_id,
        userName: undefined 
    })
});

// UPDATE - updateOnRemovalOfContribution, should update the statistic (used on deletion of a new contribution)
UserStats.updateOnRemovalOfContribution(user3_id, 1);

// create test to see if update had updated a statistics record in database
var newStatistics2 =  UserStats.findById(user2_id);
test('confirm updateOnRemovalOfContribution method edits a users stats record with the mew stats included', () => {
    expect(newStatistics2).toEqual(
    {
        userStats_id: newStatistics2.userStats_id,
        hoursBanked: 11,
        totalTasks: 3,
        averageTimeTaken: 3.6666666666666665,
        user_id: newStatistics2.user_id,
        userName: undefined 
    })
});

// DELETE - delete, should delete the statistic (used on deletion of a users account)
UserStats.delete(user3_id);

// confirm that the delete method is removing users statistics records from the database
var deletedUser = UserStats.findById(user3_id);
test('confirm delete method is removing users statistics records from the database', () => {
    expect(deletedUser).toBe(null)
});