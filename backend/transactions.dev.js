const uuid = require('uuid/v4')
const moment = require('moment')

const addTransaction = (transaction) => {
  if(transaction.quotas != 0){
    const uniqueIdentifier = uuid()
    
    for(let i = 0; i < transaction.quotas; i++){
      const { type, date, description, target, value, category, status, owner } = transaction
      const quota = new CreateTransactionDTO(
        type,
        moment(date, 'DD/MM/YYYY').add(i, 'month').format('DD-MM-YYYY'),
        description,
        target,
        value,
        category,
        status,
        uniqueIdentifier,
        owner
      )
      //Insert Method
    }
  }
  this.transactionsService.insert(transaction)
};

const updateTransaction = (transaction) => {
  if(transaction.quotas != undefined && transaction.quotas != 'unique') {
    this.transactionsService.getCorrelatedTransactions(transaction.quotas)
    .then((transactions) => {
      const firstIdx = transactions.indexOf(transactions.find((x) => x._id == transaction._id));
      const referenceDate = transaction.date;
      
      for (let i = firstIdx; i < transactions.length; i++){
        transaction._id = transactions[i]._id;
        if (transaction.date !== undefined) {
          transaction.date = moment(referenceDate, 'DD/MM/YYYY').add(i - firstIdx, 'month').format('DD-MM-YYYY')
        }
        //Update Method
      }
    });
  } else {
    //Update Method
  }
}

const deleteTransaction = (transaction) => {
  if(transaction.quotas != undefined && transaction.quotas != 'unique') {
    this.transactionsService.getCorrelatedTransactions(transaction.quotas)
    .then((transactions) => {
      const firstIdx = transactions.indexOf(transactions.find((x) => x._id == transaction._id));
      for (let i = firstIdx; i < transactions.length; i++){
        //Delete Method
      }
    });
  } else {
    //Delete Method
  }
}

module.exports = {
  inserTransaction,
  updateTransaction,
  deleteTransaction
}