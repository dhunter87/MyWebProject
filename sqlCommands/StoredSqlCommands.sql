-- SQLite commands used
-- this file is used to store recent commands run through vs code & sqlite

/*

select * from user;

select * from contribution;

select * 
from contribution
where contribution.duration >= 1
order by contribution.startTime;

select * from followers

select * from userStats

select name, email, userStats.*
from followers 
  inner join user on followers.userFollowingId = user.user_id
  inner join userstats on user.user_id = userStats.user_id
where userid = 4

--! get timeline contributions
select distinct name, email, contribution.*
from followers 
  inner join user on followers.userFollowingId = user.user_id or followers.userId = user.user_id
  inner join contribution on user.user_id = contribution.user_id
where userid = 4
order by contribution.startTime

--! get hoursBanked ranking
select distinct name, email, userStats.*
from followers 
  inner join user on followers.userFollowingId = user.user_id  or followers.userId = user.user_id
  inner join userstats on user.user_id = userStats.user_id
where userid = 4
order by userStats.hoursBanked desc

--! get totalTasks ranking
select distinct name, email, userStats.*
from followers 
  inner join user on followers.userFollowingId = user.user_id  or followers.userId = user.user_id
  inner join userstats on user.user_id = userStats.user_id
where userid = 4
order by userStats.totalTasks desc

--! get averageTime ranking
select distinct name, email, userStats.*
from followers 
  inner join user on followers.userFollowingId = user.user_id  or followers.userId = user.user_id
  inner join userstats on user.user_id = userStats.user_id
where userid = 4
order by userStats.averageTimeTaken desc


*/