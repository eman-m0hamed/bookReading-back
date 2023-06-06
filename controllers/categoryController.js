const CategoriesModel = require('../model/categories');

const getAll = async (req, res) => {
  try {
    const categories = await CategoriesModel.find({}, { __v: 0 }).populate(
      'books', {books:0, __v: 0}
    );
    return res.json({"success": true, "data":categories, "message": "all categories data are retrieved"});
  } catch (error) {
    return res.status(500).json({"success": false, "massage": error.message});
  }
};

const getOne = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = await CategoriesModel.findById({
      _id: categoryID,
    }).populate('books', {books:0, __v: 0});
    if (category) {
      return res.json({"success": true, "data":category, "message": "all category data is retrieved"});
    } else {
      res.satatus(404).json({ "success":false, message: "This Category Doesn't exist" });
    }
  } catch (error) {
    return res.status(500).json({"success": false, "massage": error.message});
  }
};

const addOne = async (req, res) => {
  try {
    const existCategory = await CategoriesModel.findOne({
      categoryName: req.body.categoryName,
    });
    if (existCategory) {
      return res.json({ success: false, message: 'this category arleady exists' });
    } else {
      await CategoriesModel.create(req.body)
        .then((category) => {
          return res.json({
            success: true,
            message: 'category added successfully',
            data: category,
          });
        })
        .catch((error) => {
          return res.json({ success: false, message: error.message });
        });
    }
  } catch (error) {
    return res.status(500).json({"success": false, "massage": error.message});
  }
};

const editOne = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const existCategory = await CategoriesModel.findOne({
      categoryName: req.body.categoryName,
      _id: { $ne: categoryID },
    });
    if (existCategory) {
      return res.json({ success: false, message: 'this category arleady exists' });
    }
    const category = await CategoriesModel.findByIdAndUpdate(
      categoryID,
      { $set: req.body },
      { new: true },
    );
    return res.json({
      success: true,
      message: 'category updated successfully',
      data: category,
    });
  } catch (error) {
    return res.status(500).json({"success": false, "massage": error.message});
  }
};

const deleteOne = async (req, res) => {
  try {
    const categoryID = req.params.id;
    const category = await CategoriesModel.findByIdAndDelete(categoryID);
    return res.json({ success: true, message: 'category Deleted successfully', data: category });
  } catch (error) {
    return res.status(500).json({"success": false, "massage": error.message});
  }
};

module.exports = { getAll, getOne, addOne, editOne, deleteOne };
