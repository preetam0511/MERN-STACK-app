const express = require('express');
const router = express.Router();
const { 
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById
} = require('../controllers/usercontroller');

router.get('/',getAllNotes)

router.post('/create',createNote)
router.get('/:id',getNoteById)
router.put('/:id',updateNote)
router.delete('/:id',deleteNote)

module.exports = router;