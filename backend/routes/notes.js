const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

// Route 1 : Get All the Notes Using: GET "/api/notes/getuser" . Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    }
    // catches an errors
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// Route 2 : Add a Note Using : POST "/api/notes/addnote" . Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // if there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save();

            res.json(savedNote);
        }
        // catches an errors
        catch (error) {
            console.error(error.message)
            res.status(500).send("Internal server error")
        }
    })

// Route 3 : Update an existing Note Using : PUT "/api/notes/updatenote" . Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        // Create a newNote onject
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note to be updted and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    }
    // catches an errors
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }

})

// Route 4 : Delete an existing Note Using : DELETE "/api/notes/updatenote" . Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        // Find the note to be updted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "note has been deleted", note: note });

    }
    // catches an errors
    catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
module.exports = router