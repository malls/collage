'use strict';

require('dotenv').config();

const url = require('url');
const { createClient } = require('redis');
let client;

//check if it's development, then use redis client if not
if (process.env.MODE === 'development') {
    client = createClient();
} else {
    const redisURL = url.parse(process.env.REDISCLOUD_URL);
    client = createClient({url: process.env.REDISCLOUD_URL});
}

client.on('error', (err) => console.log('Redis Client Error', err));

async function init() {
    await client.connect();
    await client.select(process.env.REDISDB || 0);
    //test client connection, output something in terminal
    await client.set('rthdnajfondaopfda', 'Redis connected.');
    const confirmation = await client.get('rthdnajfondaopfda');
    console.log(confirmation);
    client.del('rthdnajfondaopfda');
}

init();

module.exports = client;
