const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'obituary_platform'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Handle form submission
app.post('/submit_obituary', (req, res) => {
    const { name, date_of_birth, date_of_death, content, author } = req.body;

    const sql = 'INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author, submission_date) VALUES (?, ?, ?, ?, ?, NOW())';
    db.query(sql, [name, date_of_birth, date_of_death, content, author], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted:', result);
            res.send('Obituary submitted successfully');
        }
    });
});

// Serve the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/obituary_form.html');
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(5016, () => {
    console.log(`Server running on port http://localhost:5016/`);
});
