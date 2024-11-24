// routes/groups.js

const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create a new group
router.post('/', async (req, res) => {
  try {
    const { name, members } = req.body; // members: array of User IDs
    const group = new Group({ name, members });
    await group.save();
    // Populate members before sending response
    await group.populate('members');
    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all groups with populated members
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('members')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific group by ID with populated members
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members');
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found.' });
    }
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a group
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (group) {
      // Optionally, delete associated expenses here
      res.json({ message: 'Group deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Group not found.' });
    }
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
