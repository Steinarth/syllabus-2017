const { Client } = require('pg');

function getClient() {
    return new Client({
        host: 'my_postgres_cointainer',
        user: 'my_postgres_user',
        password: 'my_postgres_password',
        database: 'my_postgres_database'
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


// give the postgres container a couple of handfuls of seconds to setup.
setTimeout(initialize, 10000);

// export available database functions.
module.exports = {
    insert: (name, insertDate, onInsert) => {
        var client = getClient();
        client.connect(() => {
            const query = {
                text: 'INSERT INTO Item(Name, InsertDate) VALUES($1,$2);',
                values: [name, insertDate],
            }
            client.query(query, () => {
              onInsert();
              client.end();
            });
        });
        return;
    },
    get: (onGet) => {
        var client = getClient();
        client.connect(() => {
            const query = {
                text: 'SELECT ID, Name, InsertDate FROM Item ORDER BY InsertDate DESC LIMIT 10;',
                rowMode: 'array'
            }
            client.query(query, (err, res) => {
              onGet(res.rows.map(row => {
                  return {
                      id: row[0],
                      name: row[1],
                      insertdate: row[2]
                  }
              }));
              client.end();
            });
        });
        return;
    }
}