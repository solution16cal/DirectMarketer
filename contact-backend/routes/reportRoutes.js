const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Adjust the path as necessary

router.post('/notes', async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const matchStage = {
      $match: {
        'notes.date': {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    };

    const unwindStage = { $unwind: '$notes' };

    const groupStage = {
      $group: {
        _id: null,
        totalNotes: { $sum: 1 },
        contactedNotes: {
          $sum: {
            $cond: [{ $eq: ['$notes.contacted', true] }, 1, 0],
          },
        },
      },
    };

    const result = await Contact.aggregate([unwindStage, matchStage, groupStage]);

    res.status(200).json(result[0] || { totalNotes: 0, contactedNotes: 0 });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;