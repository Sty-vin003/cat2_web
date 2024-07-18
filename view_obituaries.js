const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Replace with your MySQL password
    database: 'obituary_platform'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Route to fetch and display obituaries
app.get('/view_obituaries', (req, res) => {
    const perPage = 10; // Number of results per page
    const page = req.query.page || 1; // Current page number, default is 1

    // Calculate the offset for pagination
    const offset = (page - 1) * perPage;

    // Query to fetch obituaries with pagination
    const sql = `SELECT * FROM obituaries ORDER BY date_of_death DESC LIMIT ${perPage} OFFSET ${offset}`;

    // Execute query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching obituaries:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Calculate total number of pages
            db.query('SELECT COUNT(*) AS totalCount FROM obituaries', (err, countResult) => {
                if (err) {
                    console.error('Error counting obituaries:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    const totalCount = countResult[0].totalCount;
                    const totalPages = Math.ceil(totalCount / perPage);

                    // Prepare data to send to client
                    const obituariesData = {
                        obituaries: results,
                        currentPage: parseInt(page),
                        totalPages: totalPages
                    };

                    // Send data as JSON
                    res.json(obituariesData);
                }
            });
        }
    });
});

// Route to serve obituaries.html
app.get('/obituaries.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'obituaries.html'));
});

// Route to handle root URL and redirect to view_obituaries
app.get('/', (req, res) => {
    res.redirect('/view_obituaries');
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(5050, () => {
    console.log(`Server running on http://localhost:5050/`);
});
