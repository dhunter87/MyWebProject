const User = require('../models/User');

// SET UP ALL TEST DATA

// insert a new user record into the database
User.insert('Jane Doe', 'jane.doe@gmail.com', "kudcxspoiowcuixhwgdiuwsnwirdhijxioeruwfohdjowrijoiucheuiwiai");
User.insert('John Doe', 'john.doe@gmail.com', "$2a$10$zdVzGD7vCh0kDoxQpBrpuOJkZ/flaqNiKCJ7G5Psm89IddC14o3lu");

// find the new user using the name
var user = User.findByName('John Doe')
var user2 = User.findByName('Jane Doe')

// confirm findByName method constructs and returns a user object 
test('confirm findByName method returns a user object', () => {
    expect(user).toBeInstanceOf(User)
});

// confirm findByName method reads a users information from the database
test('findByName reads a users information from the database', () => {
    expect(user).toEqual(
        {
            userId: user.userId,
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            passwordHash: '$2a$10$zdVzGD7vCh0kDoxQpBrpuOJkZ/flaqNiKCJ7G5Psm89IddC14o3lu'}
    )
});

// confirm findById method constructs and returns a user object
var user1 = User.findById(user.userId)
test('confirm findById method returns a user object', () => {
    expect(user1).toBeInstanceOf(User)
});

// confirm findById method reads a users information from the database
test('findById reads a users information from the database', () => {
    expect(user1).toEqual(
        {
            userId: user1.userId,
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            passwordHash: '$2a$10$zdVzGD7vCh0kDoxQpBrpuOJkZ/flaqNiKCJ7G5Psm89IddC14o3lu'}
    )
});

// confirm findByEmail method constructs and returns a user object
var user2 = User.findByEmail('john.doe@gmail.com')
test('confirm findByEmail method returns a user object', () => {
    expect(user2).toBeInstanceOf(User)
});

// confirm findByEmail method reads a users information from the database
test('findByEmail reads a users information from the database', () => {
    expect(user2).toEqual(
        {
            userId: user.userId,
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            passwordHash: '$2a$10$zdVzGD7vCh0kDoxQpBrpuOJkZ/flaqNiKCJ7G5Psm89IddC14o3lu'
        })

});

// delete the new record from the database
User.delete(user.userId);

// confirm the last element of the collection is back to the original data in database
var user3 = User.getLastUserInDatabase()

test('reads the last users information from the database', () => {
        expect(user3).toEqual(
        { 
            user_id: user3.user_id,
            name: 'Jane Doe',
            email: 'jane.doe@gmail.com',
            password_hash: 'kudcxspoiowcuixhwgdiuwsnwirdhijxioeruwfohdjowrijoiucheuiwiai'
        }
    )
});