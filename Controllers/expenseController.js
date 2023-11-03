//expenseController.js
const Expenses = require('../Models/expensesModel');
const Capital = require('../Models/capitalModel');

exports.addExpenses = async (req, res) => {
    try {
      const { userId, title, category, date, price, quantity, description } = req.body;
  
      const totalPrice = price * quantity; 
  
      
      const userCapital = await Capital.findOne({ userId });
      if (!userCapital || userCapital.amount < totalPrice) {
        return res.status(400).json({ message: 'Insufficient capital balance for this expense' });
      }
  
      
      const expense = await Expenses.create({ userId, title, category, date, price, quantity, description, totalPrice });
  
      
      userCapital.amount -= totalPrice;
      await userCapital.save();
  
      res.status(201).json({ message: 'Expenses added successfully', expense });
    } catch (error) {
      res.status(500).json({ message: 'Error adding expenses', error });
    }
  };


  exports.getExpenseTransactionDetails = async (req, res) => {
    try {
      const { userId, expenseId } = req.params; 
  
      const expenseDetails = await Expenses.findOne({ userId, _id: expenseId });
  
      if (!expenseDetails) {
        return res.status(404).json({ message: 'Expense transaction not found for this user' });
      }
  
      res.status(200).json({ expenseDetails });
    } catch (error) {
      res.status(500).json({ message: 'Error getting expense transaction details', error });
    }
  };
  
  exports.getTotalExpenseTransactionsCount = async (req, res) => {
    try {
      const { userId } = req.params; 
  
      const totalTransactionsCount = await Expenses.countDocuments({ userId });
  
      res.status(200).json({ totalTransactionsCount });
    } catch (error) {
      res.status(500).json({ message: 'Error getting total transactions count', error });
    }
  };


//   exports.getCumulativeTotalAllExpensesByUserId = async (req, res) => {
//     try {
//       const { userId } = req.params; // Assuming userId is passed as a parameter in the URL
  
//       const totalAllExpenses = await Expenses.aggregate([
//         {
//           $match: { userId: userId } 
//         },
//         {
//           $group: {
//             _id: null,
//             totalAmount: { $sum: "$totalPrice" }
//           }
//         }
//       ]);
  
//       const cumulativeTotalAmount = totalAllExpenses.length > 0 ? totalAllExpenses[0].totalAmount : 0;
      

//       res.status(200).json({ cumulativeTotalExpense: cumulativeTotalAmount });
//     } catch (error) {
//       res.status(500).json({ message: 'Error getting cumulative total expense amount', error });
//       console.log(error);
//     }
//   };

exports.getCumulativeTotal = async (req, res) => {
    try {
      const userId = req.params.userId;
      const expenses = await Expenses.find({ userId: userId });
      const total = expenses.reduce((acc, expense) => acc + expense.totalPrice, 0);
      res.status(200).json({ total: total });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  exports.getAllExpenseTransactionsByUserId = async (req, res) => {
    try {
      const { userId } = req.params; 
  
      
      const expenseTransactions = await Expenses.find({ userId }).sort({ date: -1 });
  
      res.status(200).json({ expenseTransactions });
    } catch (error) {
      res.status(500).json({ message: 'Error getting expense transactions', error });
    }
  };

  exports.getAllExpenseTotalPriceAndDateByUserId = async (req, res) => {
    try {
      const { userId } = req.params; 
  
      const expenses = await Expenses.find({ userId }, 'totalPrice date') 
        .sort({ date: 1 }); 
  
      res.status(200).json({ expenses });
    } catch (error) {
      res.status(500).json({ message: 'Error getting expense transactions', error });
    }
  };

  exports.editExpenseTransaction = async (req, res) => {
    try {
      const { userId, expenseId, title, category, date, price, quantity, description } = req.body;
  
      const totalPrice = price * quantity; 
  
      
      const userCapital = await Capital.findOne({ userId });

      
      const expense = await Expenses.findOne({_id: expenseId, userId});

      if (!expense) {
        return res.status(404).json({ message: 'Expense transaction not found' });
      }
      
      const check= userCapital.amount + expense.totalPrice;

      if (!userCapital || check < totalPrice) {
        return res.status(400).json({ message: 'Insufficient capital balance for this expense' });
      }
  

       
       if(totalPrice>=expense.totalPrice)
       {
         const sub = totalPrice - expense.totalPrice;
       userCapital.amount -= sub;
       await userCapital.save();
     }
 
     if(totalPrice<=expense.totalPrice)
       {
         const add = expense.totalPrice- totalPrice ;
       userCapital.amount += add;
       await userCapital.save();
     }

      
      expense.title = title;
      expense.category = category;
      expense.date = date;
      expense.price = price;
      expense.quantity = quantity;
      expense.description = description;
      expense.totalPrice = totalPrice;
  
      
      await expense.save();
  
     

      res.status(200).json({ message: 'Expense transaction updated successfully', expense });
    } catch (error) {
      res.status(500).json({ message: 'Error editing expense transaction', error });
      console.log(error);
    }
  };


  exports.deleteExpenseTransaction = async (req, res) => {
    try {
      const { userId, transactionId } = req.params; 
  
      
      const deletedTransaction = await Expenses.findOneAndDelete({ userId, _id: transactionId });
  
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Expense transaction not found for this user' });
      }
  
      
      const userCapital = await Capital.findOne({ userId });
      if (!userCapital) {
        return res.status(404).json({ message: 'User capital data not found' });
      }
      
      userCapital.amount += deletedTransaction.totalPrice;
      await userCapital.save();
  
      res.status(200).json({ message: 'Expense transaction deleted successfully', deletedTransaction });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting expense transaction', error });
    }
  };

  