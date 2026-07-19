const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/TaskModel');
const User = require('./models/UserModel');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requireAuth } = require('./middleware/authMiddleware');
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// connect to Mondodb
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log('DB connection error:', err);
    });

// -middleware------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});
// -routes----------------------------
// JWT authentication routes
// handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = { email: '', password:'' };

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out' });
});

// routes
app.get('/api/auth/me', requireAuth, (req, res) => {
    res.status(200).json({ 
        user: { id: req.user._id, email: req.user.email } 
    });
});

app.use('/api/tasks', taskRoutes);