const Contribution = require('../models/Contribution');
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

// inserted new user statistics records
UserStats.insert(0,0,0,user1_id);
UserStats.insert(0,0,0,user2_id);
UserStats.insert(0,0,0,user3_id);


// CREATE - insert, new contribution records (date, title, timeTaken, user_id)
Contribution.insert('2019-04-01T11:11', ' food shopping 101', 10, user1_id);
Contribution.insert('2019-05-01T11:11', ' food shopping 102', 3, user1_id);
Contribution.insert('2019-04-01T11:11', ' food shopping 103', 5, user1_id);
Contribution.insert('2019-05-01T11:11', ' food shopping 104', 2, user1_id);
Contribution.insert('2019-06-01T11:11', ' food shopping 105', 4, user2_id);
Contribution.insert('2019-04-01T11:11', ' food shopping 106', 7, user2_id);
Contribution.insert('2019-01-01T11:11', ' food shopping 107', 2, user2_id);
Contribution.insert('2019-01-01T11:11', ' food shopping 108', 15, user3_id);
Contribution.insert('2019-01-01T11:11', ' food shopping 108', 8, user3_id);

// READ - findByTask, method should create and return a new contribution object with correct values
//! below variable is to get the id number for the contribution inserted directly to database (id is auto incremented - cannot set during tests/insertion)
var contribution_id =  Contribution.findByTask(' food shopping 101').contribution_id;

// READ - findById, method should create and return a new contribution object
var userContribution = Contribution.findById(contribution_id);
test('confirm findById method returns a contribution object', () => {
    expect(userContribution).toBeInstanceOf(Contribution)
});

// READ - findById, method should create and return a new contribution object with correct values
test('confirm findById method reads a users contribution (with specific contribution id) from the database and constructs a contribution object', () => {
    expect(userContribution).toEqual(
        {
            contribution_id: userContribution.contribution_id,
            startTime: '2019-04-01T11:11',
            task: ' food shopping 101',
            duration: 10,
            user_id: userContribution.user_id 
        })
});

// READ - findAllByUserId, should return all contributions related to the user_id passed in
var contributions = Contribution.findAllByUserId(user1_id);
test('confirm findAllByUserId method reads all users contributions from the database and constructs a contribution objects', () => {
    expect(contributions[1]).toEqual(
        {
            contribution_id: contributions[1].contribution_id,
            task: ' food shopping 102',
            startTime: '2019-05-01T11:11',
            duration: 3,
            user_id: contributions[1].user_id 
        })
});

// READ - getTimelineContributions, should return all contributions related to the user logged in and the users they follow
var timeLineContributions = Contribution.getTimelineContributions(user1_id);
test('confirm getTimelineContributions method reads all users contributions (for the logged in user and the people they follow) from the database and constructs a contribution objects', () => {
    expect(timeLineContributions[1]).toEqual(
        {
            name: 'test3',
            email: 'test3@test.com',
            contribution_id: timeLineContributions[1].contribution_id,
            task: ' food shopping 108',
            startTime: '2019-01-01T11:11',
            duration: 8,
            user_id: timeLineContributions[1].user_id
        })
});

// UPDATE - update, should update the contribution
var newContribution_id =  Contribution.findByTask(' food shopping 104').contribution_id;
Contribution.update(newContribution_id, '2019-05-10T11:11', 'New Task!', 5);
var updatedUserContribution = Contribution.findById(newContribution_id);

// check record has been updated
test('confirm findById method reads a users contribution (with specific contribution id) from the database and constructs a contribution object', () => {
    expect(updatedUserContribution).toEqual(
        {
            contribution_id: newContribution_id,
            startTime: '2019-05-10T11:11',
            task: 'New Task!',
            duration: 5,
            user_id: updatedUserContribution.user_id 
        })
});

// DELETE - delete, should delete the contribution 
Contribution.delete(54);
var deletedContribution = Contribution.findById(54);
// check the record has been deleted
test('confirm delete method is removing contribution records from the database', () => {
    expect(deletedContribution).toBe(null)
});