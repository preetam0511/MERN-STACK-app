const Note = require('../../models/note.js');

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createNote = async (req, res) => {
    try{
        const {title,description,tag} = req.body;
        const note = await Note.create({title,description,tag});
        note.save();
        res.status(201).json({message:"Note created successfully"});
    }   
    catch(err){
        res.status(500).json({message:err.message});
    }
};

const getNoteById = async (req,res)=>{
    try{
        const id = req.params.id;
        const note = await Note.findById(id);
        res.status(200).json(note);
    }
    catch(err){
        res.status(500).json({message:console.log(err)});
    }
}

const updateNote = async (req, res) => {
    const {title,description} =  req.body; 
    const id = req.params.id;
    const updatedNote = await Note.findByIdAndUpdate(id,{title,description},{new:true}) 
    if(!updatedNote){
        return res.status(404).json({message:"Note not found"});
    }
    res.status(200).json({message:"Note updated successfully"}); 
};

const deleteNote = async (req, res) => {
    try{
        const id = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(id,{new:true});
    if(!deletedNote){
        return res.status(404).json({message:"Note not found"});
    }
    res.status(200).json({message:"Note deleted successfully"});
}
catch(err){
    res.status(500).json({message:err.message});
}
};

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById
};