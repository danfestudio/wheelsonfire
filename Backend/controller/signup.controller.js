const argon2 = require('argon2'); // Import Argon2
const User = require('../models/user.model');

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, address, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Create a new user instance with the hashed password
    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      address, 
      password: hashedPassword 
    });

    // Save user to database
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
