const router = require("express").Router();

const TransactionSummaryController = require("../controllers/transactionSummaries.controller");


//Transaction_Summarries
router.post("/transaction/summary/create", TransactionSummaryController.createTransactionSummary);
router.get("/transaction/summary/list", TransactionSummaryController.fetchTransactionSummaryList);
// router.get("/transaction/summary/:id", TransactionSummaryController.fetchTransactionSummaryById);
router.put("/transaction/summary/update/:id", TransactionSummaryController.updateTransactionSummaryById);
router.delete("/transaction/summary/delete/:id", TransactionSummaryController.deleteTransactionSummaryById);

module.exports = router;