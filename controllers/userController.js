const asyncHandler = require('../middleware/asyncHandler.js');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/User.js');
const { get } = require('mongoose');

 
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      token: token 

    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

 
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    role, // Add role to the user creation
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username, // Ensure you're returning the username
      email: user.email,
      role: user.role, // Include role in the response if needed
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


 
 

 
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
     
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
 







 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  
  const { username, email, password, role, managerId } = req.body; 
 

  const user = new User({ 
    username, 
    email, 
    password, 
    role, 
    managerId });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update a user
const updateUser = async (req, res) => {
  const { username, email, role, managerId } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, managerId },
      { new: true }
    ).select('-password');  
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 





 

// Controller to get team members for a specific manager
const getTeamMembers = async (req, res) => {
    const { managerId } = req.params;

    try {
        const teamMembers = await User.find({ managerId });
        res.status(200).json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving team members', error: error.message });
    }
};

module.exports = { getTeamMembers };


module.exports = {
  authUser,
  registerUser, 
  getUserProfile,
  
 getAllUsers,
 createUser,
 updateUser,
 deleteUser,



 getTeamMembers
};