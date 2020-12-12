const { query } = require('express');
const express = require('express');
const app = express();
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: "geoscavengedb.mysql.database.azure.com", 
    user: "Mrod@geoscavengedb", 
    password: "Rampage151998!", 
    database: "geoscavenge", 
    port: 3306, 
});

app.use(express.json());

app.post('/users/register', (req, res) => {
    if(!req.body.username || !req.body.password)
    {
        res.status(400).send('password and username are required.');
        return;
    }
    let checkusername = `SELECT * FROM users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`;
    conn.query(checkusername,(error, results, fields) => {
        if(error){
            res.status(400).send(error)
            throw error
        }
        if(results[0])
        {
            res.status(400).send("username already taken");
            return;
        }
        insertquery = `INSERT INTO users (username, password)`
        conn.query(insertquery,(error, results, fields) => {
            res.status(200).send("user created")
        })
    })
})

app.post('/users/single', (req, res) => {
    if(!req.body.username || !req.body.password)
    {
        res.status(400).send('password and username are required.');
        return;
    }
    let query = `SELECT * FROM users WHERE username = "${req.body.username}" AND password = "${req.body.password}"`
    conn.query(query, (error, results, fields) => {
        if(error){
            res.status(400).send(error)
            throw error
        }
        if(results[0])
            res.status(200).send(results[0])
        else
        {
            res.status(400).send('user not found');
            return;
        }
    });
})

app.post('/highscores', (req,res) => {
    if(!req.body.game)
    {
        res.status(400).send('game required');
        return;
    }
    let query = `SELECT * FROM high_scores WHERE highscore_type = "${req.body.game}" ORDER BY highscore ASC LIMIT 10`
    conn.query(query, (error, results, fields) => {
        if(error){
            res.status(400).send(error)
            throw error
        } 
        if(results[0])
            res.status(200).send(results)
        else
        {
            res.status(200).send('no high Scores found');
            return;
        }
    });
})

app.post('/highscores/new', (req , res) => {
    if(!req.body.user || !req.body.highscore || !req.body.highscore_type)
    {
        res.status(400).send('user, highscore, and type are required.');
        return;
    }
    let highscore = Number(req.body.highscore);
    let user = Number(req.body.user);
    let query = `INSERT INTO high_scores (highscore_type, highscore,user_id) VALUES ("${req.body.highscore_type}", ${req.body.highscore}, ${req.body.user})`;
    conn.query(query, (error, results, fields) => {
        if(error) throw error;
        res.status(200).send('high score added');
        return;
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`))