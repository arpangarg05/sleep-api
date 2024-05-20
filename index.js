const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'sleepData.json');

/* Reaing the file */
// Helper function to read sleep data from JSON file
const readSleepData = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper function to write sleep data to JSON file
const writeSleepData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize in-memory storage with data from file
let sleepData = readSleepData();
let recordId = sleepData.length > 0 ? Math.max(...sleepData.map(record => record.id)) + 1 : 0;

app.use(bodyParser.json());



/* Operations on file */
// POST /sleep - Store sleep data
app.post('/sleep', (req, res) => {
    const { userId, hours, timestamp } = req.body;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing userId' });
    }
    if (hours == null || typeof hours !== 'number' || hours <= 0) {
        return res.status(400).json({ error: 'Invalid or missing hours' });
    }
    if (!timestamp || isNaN(Date.parse(timestamp))) {
        return res.status(400).json({ error: 'Invalid or missing timestamp' });
    }

    const newRecord = {
        id: recordId++,
        userId,
        hours,
        timestamp
    };

    sleepData.push(newRecord);
    writeSleepData(sleepData);
    res.status(201).json(newRecord);
});

// GET /sleep/:userId - Retrieve sleep data for a user
app.get('/sleep/:userId', (req, res) => {
    const { userId } = req.params;
    const userSleepData = sleepData.filter(record => record.userId === userId);

    if (userSleepData.length === 0) {
        return res.status(404).json({ error: 'No sleep data found for this user' });
    }

    userSleepData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(userSleepData);
});

// GET /users - Retrieve a list of all users
app.get('/users', (req, res) => {
    const userIds = [...new Set(sleepData.map(record => record.userId))];
    if (userIds.length === 0) {
        return res.status(404).json({ error: 'No users found' });
    }
    res.json(userIds);
});

// DELETE /sleep/:recordId - Delete a specific sleep record
app.delete('/sleep/:recordId', (req, res) => {
    const { recordId } = req.params;
    const recordIndex = sleepData.findIndex(record => record.id == recordId);

    if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    sleepData.splice(recordIndex, 1);
    writeSleepData(sleepData);
    res.status(204).send();
});

// PUT /sleep/:recordId - Update a specific sleep record
app.put('/sleep/:recordId', (req, res) => {
    const { recordId } = req.params;
    const { userId, hours, timestamp } = req.body;

    const recordIndex = sleepData.findIndex(record => record.id == recordId);

    if (recordIndex === -1) {
        return res.status(404).json({ error: 'Record not found' });
    }

    const record = sleepData[recordIndex];

    if (userId && typeof userId !== 'string') {
        return res.status(400).json({ error: 'Invalid userId' });
    }
    if (hours && (typeof hours !== 'number' || hours <= 0)) {
        return res.status(400).json({ error: 'Invalid hours' });
    }
    if (timestamp && isNaN(Date.parse(timestamp))) {
        return res.status(400).json({ error: 'Invalid timestamp' });
    }

    if (userId) record.userId = userId;
    if (hours) record.hours = hours;
    if (timestamp) record.timestamp = timestamp;

    writeSleepData(sleepData);
    res.json(record);
});

// POST /sleep/:userId - Add more sleep data for a specific user
app.post('/sleep/:userId', (req, res) => {
    const { userId } = req.params;
    const { hours, timestamp } = req.body;

    if (hours == null || typeof hours !== 'number' || hours <= 0) {
        return res.status(400).json({ error: 'Invalid or missing hours' });
    }
    if (!timestamp || isNaN(Date.parse(timestamp))) {
        return res.status(400).json({ error: 'Invalid or missing timestamp' });
    }

    const existingUser = sleepData.some(record => record.userId === userId);
    if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    const newRecord = {
        id: recordId++,
        userId,
        hours,
        timestamp
    };

    sleepData.push(newRecord);
    writeSleepData(sleepData);
    res.status(201).json(newRecord);
});


/* Error Handling */
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
