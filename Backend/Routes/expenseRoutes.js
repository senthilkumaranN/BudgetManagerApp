const express = require("express");

const {
  getExpense,
  getAllData,
  postExpense,
  DeleteLastEntry
} = require("../Controller/expenseController");

const router = express.Router();

router.get("/get", getAllData);
router.get("/getMonth", getExpense);
router.post("/add", postExpense);
router.delete("/delete", DeleteLastEntry);

module.exports = router;
