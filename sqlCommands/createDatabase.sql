CREATE TABLE user(
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);
CREATE TABLE blog(
  blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL, 
  dateOfBlog datetinme NOT NULL, 
  duration INTEGER NOT NULL,
  dateOfActivity datetinme,
  timeOfActivity datetinme,
   user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT UserId
  FOREIGN KEY(user_id) REFERENCES  user(user_id)
  CONSTRAINT CategoryId
  FOREIGN KEY(category_id) REFERENCES  user(category_id)
  ON DELETE CASCADE
);
CREATE TABLE category (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT NOT NULL
);
CREATE TABLE followers (
    userId INTEGER NOT NULL,
    userFollowingId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (userFollowingId) REFERENCES user(user_id) ON DELETE CASCADE,
    PRIMARY KEY (userId, userFollowingId)
);
CREATE TABLE userStats(
  userStats_id INTEGER PRIMARY KEY AUTOINCREMENT,
  numberFollowing INTEGER,
  numberOfFollowers INTEGER,
  totalLikes INTEGER,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE
);