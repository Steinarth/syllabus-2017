# Deployment

## Part 1 - Extending the app

Lets further develop the app by adding a database that stores items posted to the web api. If you want you can also change the name of the service in your docker-compose.yml from my_page_counter_app to my_page_counter_and_item_storage_app.

### Part 1.1 - Installing a postgres client

There are a lot of NodeJS packages available from the official Node Package Manager (npm). To communicate with postgres we need a postgres client that implements the socket/network communications with the postgres database. Npm is a part of NodeJS so it is already installed on your machine, it keeps information about the packages you are using in a file called package.json along with other useful information. Install a package called "pg" by using the command:
~~~
npm install pg
~~~
pg should appear in your package.json files list of dependencies.

### Part 1.2 - Adding a postgres container

Your application will need a postgres database to communicate with luckily there is a docker image available for that called postgres.
Add a postgres container to your docker-compose.yml it should look like the redis container already setup with a few additional environment variables that the docker image needs to setup.
Lookup how to add environment variables to a docker-compose file and provide the following environment variables for the postgres container:

* POSTGRES_DB
* POSTGRES_USER
* POSTGRES_PASSWORD

You should now be able to run docker-compose and see it pull and run the postgres image.

### Part 1.3 - Connecting to postgres

Create a new javascript file called database.js and add the following:

~~~javascript
const { Client } = require('pg');

function getClient() {
    return new Client({
        host: /* your container name */,
        user: /* your postgres username */,
        password: /* your postgres password */,
        database: /* your postgres database */
    });
}

function initialize() {
    var client = getClient();
    client.connect(() => {
        client.query('CREATE TABLE IF NOT EXISTS Item (ID SERIAL PRIMARY KEY, Name VARCHAR(32) NOT NULL, InsertDate TIMESTAMP NOT NULL);', (err) => {
            console.log('successfully connected to postgres!')
            client.end();            
        });
    });
}

// give the postgres container a couple of seconds to setup.
setTimeout(initialize, 10000);
~~~

Now open your app.js file and add:
~~~javascript
const database = require('./database');
~~~
At the top of the file.

Now build and push your docker image to the cloud, run:
~~~
docker-compose up
~~~
After the postgres container finishes setting up you should see a message from your application:
~~~
successfully connected to postgres!
~~~

### Part 1.4 - Adding api methods

Now it's time to add some functionality to the app, lets start by implementing two functions in database.js one for inserting an item and another to get items from the table.
Hints: the initialize method, [npm pg queries](https://node-postgres.com/features/queries)

~~~javascript
// module.exports: if you are not familiar with NodeJS module.exports is similar to C#/C++ public access modifier.
// you use it to call functions or access properties from outside the file.  
module.exports = {
    // Should insert an item to the items table.
    // param name: item name.
    // param insertDate: item insertdate.
    // param onInsert: on item insert callback method.
    insert: (name, insertDate, onInsert) => {
        // todo
    },
    // Should get the top 10 items sorted by inserteddate descending.
    // param onGet: on items get callback method.
    get: (onGet) => {
        // todo
    }
}
~~~

Now go to the app.js file and add two api methods:

~~~javascript
// Should return an array of 10 item names.
app.get('/items', (req, res) => {
    database.get...
    // todo
});

// Should add an item to the database.
app.post('/items/:name', (req, res) => {
    var name = req.params.name;
    database.insert...
    // todo
});
~~~

After you have implemented the two methods build and push your docker image, then run:
~~~
docker-compose up
~~~

You should now be able to post items by running:
~~~
curl -X POST http://localhost:3000/items/duck
curl -X POST http://localhost:3000/items/dog
curl -X POST http://localhost:3000/items/donkey
curl -X POST http://localhost:3000/items/monkey
curl -X POST http://localhost:3000/items/zebra
curl -X POST http://localhost:3000/items/lion
curl -X POST http://localhost:3000/items/elephant
curl -X POST http://localhost:3000/items/chicken
curl -X POST http://localhost:3000/items/cow
curl -X POST http://localhost:3000/items/deer
curl -X POST http://localhost:3000/items/rhino
curl -X POST http://localhost:3000/items/tiger
~~~

Now there should be 12 items in the database, try running:
~~~
curl -X GET http://localhost:3000/items
~~~
If you get:
~~~
["chicken","cow","deer","donkey","elephant","lion","monkey","rhino","tiger","zebra"]
~~~
You have finished part 1

## Part 2 - Deploy the app

Deploy the app on AWS.

Verify that you can post and get the items using the curl commands on your deployed app. If that and the page counter works, you are done :D
