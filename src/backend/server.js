const authRoutes = require('./routes/authRoutes');

// ... other code

app.use('/api/auth', authRoutes);

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Girl Hype backend is running with MongoDB!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
