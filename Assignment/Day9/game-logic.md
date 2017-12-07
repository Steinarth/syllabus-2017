# Game logic - TDD
## Objectives
Day 7 assignment - game logic was about getting the project to run, and get clarity around what needed to be implemented. Final assignment this week is to implement game logic TDD style.

## Steps
Remember to commit every time you get a test passing, and remember also to refactor on green - when you have all tests running. Bonus points for using fluent-style API to simplify test blocks.

Sample fluent-style modification of test:
```
given=game().created('gulli').joined('me').events()
when=game().makeMove('X',0,1)
...
```
## State
You know you're done when you have unit tests implemented that cover all scenarios described at the end of day 7. Also, Jenkins build must fail if a test fails.