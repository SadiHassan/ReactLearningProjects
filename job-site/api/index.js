const express = require('express')
const app = express()
const port = 3001 //because front-end is running on port 3000

//another instance of redis will be created here other than the one in fetch-github.js
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

// what does it mean to route to jobs using /jobs ?
app.get('/jobs', async (req, res) => {
    
    const jobs = await getAsync('github');
    //console.log("Total Jobs: " + JSON.parse(jobs).length)
    //res.send('Hello World!')
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.send(jobs)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))