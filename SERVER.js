const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: read data
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

// Helper: write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST - Add user
app.post('/api/users', (req, res) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: 'Saari fields zaroori hain' });
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone 10 digits ka hona chahiye' });
  }

  const users = readData();
  const newUser = {
    id: Date.now().toString(),
    name,
    address,
    phone,
    date: new Date().toISOString()
  };
  users.unshift(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// GET - All users
app.get('/api/users', (req, res) => {
  res.json(readData());
});

// DELETE - Remove user
app.delete('/api/users/:id', (req, res) => {
  let users = readData();
  const filtered = users.filter(u => u.id !== req.params.id);
  writeData(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`👤 User App: http://localhost:${PORT}/`);
  console.log(`👨‍💼 Admin:  http://localhost:${PORT}/admin.html`);
});