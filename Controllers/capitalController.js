//capitalController.js
const Capital = require('../Models/capitalModel');

exports.addCapitalAmount = async (req, res) => {
    try {
      const { userId, amount } = req.body;
  
      
      const existingCapital = await Capital.findOne({ userId });
  
      if (existingCapital) {
        
        existingCapital.amount += amount;
        await existingCapital.save();
  
        res.status(200).json({ message: 'Capital amount updated successfully', existingCapital });
      } else {
        
        const capital = await Capital.create({ userId, amount });
  
        res.status(201).json({ message: 'Capital amount added successfully', capital });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error adding or updating capital amount', error });
    }
  };  

exports.getCapitalAmount = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const capital = await Capital.findOne({ userId });
  
      if (!capital) {
        return res.status(404).json({ message: 'Capital amount not found for this user' });
      }
  
      res.status(200).json({ capitalAmount: capital.amount });
    } catch (error) {
      res.status(500).json({ message: 'Error getting capital amount', error });
    }
  };

exports.editCapitalAmount = async (req, res) => {
  try {
    const { userId, newAmount } = req.body;

    let capital = await Capital.findOne({ userId });

    if (!capital) {
      return res.status(404).json({ message: 'Capital amount not found for this user' });
    }

    capital.amount = newAmount;
    await capital.save();

    res.status(200).json({ message: 'Capital amount updated successfully', capital });
  } catch (error) {
    res.status(500).json({ message: 'Error updating capital amount', error });
  }
};

