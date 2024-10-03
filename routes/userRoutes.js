const express = require('express');
const {
  authUser,
  registerUser, 
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,

  getTeamMembers
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/register').post(registerUser) ;
router.post('/auth', authUser); 

router.get('/', getAllUsers);  
router.post('/', createUser);  
router.put('/:id', updateUser);  
router.delete('/:id', deleteUser); 


router.get('/team/:managerId', getTeamMembers);
  
 

  module.exports = router;