const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
//default route to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to read notes.'});
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to save notes.'});
        }
        const notes = JSON.parse(data)
       if (notes.length > 0) {
        newNote.id = notes[notes.length -1].id +1;
       } else {
        newNote.id = 1;
       }
       notes.push(newNote);

       fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to save notes.'});
        }
        res.json(newNote);
       });
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});