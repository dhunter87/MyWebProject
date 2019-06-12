"# MyWebProject" 


To Do List 

# work out how to handle likes etc.
- individual likes per blog
- overall likes per person (ave per post)

# work out how to handle followers
- return the followers/following statistics

# work out how to handle categories
- when a user visits/likes a category, the category should be saved as the users interest 
- return the top 5 results for the top 3 categories (for the logged in user)

# work out how to create a custome form (post new blog form) and stlye it with css
- include category selection

# work out if you can display sql query results in a drop down menu or on the category cards (main screen)
- Hot topics drop down should return the most visited categories
- category cards should display the logged in users 3 most visited categories

# create new views/Edit previous views
- mainScreen.html - list blogs.html
- list blogs.html needs to be redone to just display the stats and the current users blogs (most recent/most popular)
- Create an edit profile screen
- community blogs - edit timeLine.html
- Edit the edit-blog.html screen 
- add deletion infomation to edit blog screen 
- remove index.html
- Create "Hot topics" screen

# work out if you can limit the amount of characters returned in a sql query
- on the cards in the main screen, only require a preview of the blog 

# work out how to track a users most visited categories
- used for returning the suggested categories on the main screen cards

# work out if i need a new blog-category table (for assigning multiple categories to a single blog)
- used for a blog which would be in multiple categories
- blog_id & cat_id would be the composit primary key (see followers table)