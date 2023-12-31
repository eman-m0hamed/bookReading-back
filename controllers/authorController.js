const authorsModel = require("../model/authors");
const BooksModel = require("../model/books")
const relationsHandler = require("./relationsController")
const fs = require("fs");

const getAll = async (req, res) => {
  try {
    const authors = await authorsModel.find({}, { __v: 0 })
    .populate("books", {category: 0, author: 0, __v: 0, user_review: 0, user_rate: 0})
    return res.json({"success": true, "data": authors, "message": "authors data are retrieved all"});
  } catch (error) {
    return res.status(500).json({"success": false, "message": error.message});
  }
};

const getOne = async (req, res) => {
  try {
    const authorID = req.params.id;
    const author = await authorsModel.findById({ _id: authorID })
    .populate("books", {category: 0, author: 0, __v: 0, user_review: 0, user_rate: 0})

    if (author){
      return res.json({"success": true , "data": author, "message": "author data is retrieved all"});
    }
    else{
      return res.status(404).json({"success": false, "message": "This Author Doesn't exist"})
    }
  } catch (error) {
    return res.status(500).json({"success": false, "message": error.message});
  }
};

const addOne = async (req, res) => {
  try {
    const {firstName, lastName, dateOfBirth} = req.body
    const profileImg = req.file;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "author image is required." });
    }
    await authorsModel.create({firstName, lastName, dateOfBirth, image: profileImg.path})
    .then((author)=>{return res.json({"success": true, "message": "Author added successfully", "data": author });})
    .catch((error)=>{return res.json({"success": false, "message": error.message});})

  } catch (error) {
    return res.status(500).json({"success": false, "message": error.message});
  }
};

const editOne = async (req, res) => {
  try {
    const authorID = req.params.id;
    const {firstName, lastName, dateOfBirth} = req.body
    const profileImg = req.file;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "author image is required." });
    }
    const existAuthor = await authorsModel.findById(authorID, {
      image: true
    });
    fs.unlink(existAuthor.image, (error) => {
      if (error) {
        return res.status(500).json({"success": false, "message": error.message});
      }
    });
    const author = await authorsModel.findByIdAndUpdate(authorID, {$set: {lastName, firstName, dateOfBirth}, image: profileImg.path}, {new: true});
    return res.json({"success": true, "message":"Author updated successfully", "data": author});
  } catch (error) {
    return res.status(500).json({"success": false, "message": error.message});
  }
};

const deleteOne = async (req, res) => {
  try {
    const authorID = req.params.id;
    const existAuthor = await authorsModel.findById(authorID, {
      image: true,
      _id: true,
    });

    if(existAuthor){
      books = await BooksModel.deleteMany({author: authorID})
      // const author = await authorsModel.findByIdAndDelete(authorID);
      // author.books.map((existBook, index)=>{
      //   let userDeleted = relationsHandler.deleteBookFromUsers(existBook._id)
      //   let bookDeleted = relationsHandler.deleteBookFromCategories(existBook._id)
      // })
      // fs.unlink(existAuthor.image, (error) => {
      //   if (error) {
      //     return res.status(500).json({"success": false, "message": error.message});
      //   }
      // });
      return res.json({"success": true, "message":"Author Deleted successfully", "data": books});
    }
    return res.json({"success": false, "message":"Author Deleting failed"});


  } catch (error) {
    return res.status(500).json({"success": false, "message": error.message});
  }
};

module.exports = { getAll, getOne, addOne, editOne, deleteOne };
