const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// ReviewSchema
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  breweryId: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true }
});

const Review = mongoose.model('Review', ReviewSchema);

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ReviewRoutes
app.get('/api/breweries/:id/reviews', async (req, res) => {
  const breweryId = req.params.id;
  try {
    const reviews = await Review.find({ breweryId }).populate('user', 'username');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/breweries/:id/reviews', async (req, res) => {
  const breweryId = req.params.id;
  const { userId, rating, description } = req.body;
  try {
    const newReview = new Review({ user: userId, breweryId, rating, description });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
