# Day 11 - API/Load tests 

### Start of week 3

You can choose whether to copy in relevant code to your project, or fork a new project from
this one:
[Week3 repo](https://github.com/hgop/week3.git)


### Migrations
There is one change required to the database in order to have the event persistence complete. 
API tests/load tests will not work without this change. Figure out what it is, and add a database 
schema migration to apply that change to the database. There are two database migrations already 
in the project.
[Documentation for db-migrate](https://db-migrate.readthedocs.io/en/latest/API/SQL/#addcolumntablename-columnname-columnspec-callback)

### API Tests / Load tests
When your migrations are complete, the API tests should run without failure but the load test will produce an error:
```
1) Tictactoe load test : should be able to play 1000 games to end within timelimit of 1000ms
   Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
       at ontimeout timers.js:475:11
       at tryOnTimeout timers.js:310:5
       at Timer.listOnTimeout timers.js:270:5
   ...
```
This is because the count and timelimit are not correct.
In the code for week three in apitest folder, there are five "Assignment:" comments. Finish each, 
compile your answers in (in your own words) in assignment.md in the apitest folder. Leave any log 
statements/comments you add to the code in order to finish these assignments, in place.

# State

You are done when the API and load tests pass and you've completed the Assignment:s found in the comments.
