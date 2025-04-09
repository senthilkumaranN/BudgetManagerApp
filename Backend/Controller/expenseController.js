const Expense = require("../Model/expenseModel");

const postExpense = async (req, res) => {
  try {
    const { type, account, category, amount, date, note, day } = req.body;
    const expenseSave = new Expense({
      type,
      account,
      category,
      amount,
      date,
      note,
      day,
    });

    await expenseSave.save();

    res.status(201).json({
      success: true,
      message: "Expense data saved successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Post expense internal server error",
    });
  }
};

const getExpense = async (req, res) => {
  try {
    const { date } = req.query;

    const fetchData = await Expense.find({ date: date });

    res.status(200).json(fetchData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Get expense internal server error",
    });
  }
};

const getAllData = async (req, res) => {
  try {
    const fetchAllData = await Expense.find({});

    res.status(200).json(fetchAllData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "getAllData internal server error",
    });
  }
};

const DeleteLastEntry = async (req, res) => {
   try {
     const { day } = req.query; // Expects: 2025-04-09
     
 
     const start = new Date(day);
     start.setHours(0, 0, 0, 0);
 
     const end = new Date(day);
     end.setHours(23, 59, 59, 999);
 
     const entries = await Expense.find({
       timeStamp: { $gte: start, $lte: end },
     });
 
     if (entries.length === 0) {
       return res.status(404).json({ message: 'No entries found on this date' });
     }
 
     const lastEntry = entries[entries.length - 1];
     await Expense.findByIdAndDelete(lastEntry._id);
 
     res.status(200).json({ message: 'Last entry deleted', deleted: lastEntry });
   } catch (error) {
     console.error('Delete error:', error);
     res.status(500).json({ message: 'Internal server error' });
   }
 };
 
 

module.exports = { postExpense, getAllData, getExpense, DeleteLastEntry };
