## Objectives

* Get familiar with the event sourcing programming style used in project
* Get project into runnable state on development machine.
* Write mock-up test scenarios.
* Get to know the fluent-api style of writing tests.

## Steps

Fork https://github.com/hgop/week2

Start preparing for implementing unit tests for a tic-tac-toe server by collecting examples
using an event based approach **See lecture** 

- Consider failure (illegal move) scenarios. *Do not trust the clients to do the right things in the
  right order* 
- Consider winning scenarios
  - Hint: There are at least three winning scenarios that must be considered from a programming perspective.
- Consider draw scenarios

Note that this is a learning tool to approach the problem like this, which can be useful when
 exploring new ground.

Create a new md file called testExamples.md where you collect your examples and put in your project root.

Update the sources  of your project with changes made to master.

You can use the following procedure.

 https://help.github.com/articles/merging-an-upstream-repository-into-your-fork/

## Incomplete database 
There is a missing column in the database (aggregate_id). You can expect errors in the output of the server
for this reason.

You will eventually have to fix this by adding a database migration. There are already two database migrations in the project,
you will have to add one more. For this particular one, see [here](https://db-migrate.readthedocs.io/en/latest/API/SQL/#addcolumntablename-columnname-columnspec-callback) 

This is NOT a part of today's project.

## State (when are you done)

When you have given-events/when-command/then-events scenarios for at least the following:

1. Create game command
 *    should emit game created event

2. Join game command
 *    should emit game joined event
 *    should emit FullGameJoinAttempted when game full

3. Place move command
 *    should emit MovePlaced on first game move
 *    should emit IllegalMove when square is already occupied
 *    Should emit NotYourMove if attempting to make move out of turn
 *    Should emit game won on <case x>
 *    Should not emit game draw if won on last move
 *    Should emit game draw when neither wins <case x>


When you can run the database, server, server specs, client and client specs on your machine. 
See project readme.md for instructions.

