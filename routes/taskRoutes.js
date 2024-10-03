const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect,taskController.createTask);
router.get('/', protect,taskController.getMyTasks);
router.get('/all/', taskController.getTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);


router.get('/:userId', taskController.getUserTasksByManger);
module.exports = router;
