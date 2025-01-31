const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Adjust the path as necessary
const moment = require('moment-timezone'); // Use moment-timezone for timezone handling

router.post('/notes', async (req, res) => {
  const { startDate, endDate, userName } = req.body;

  try {
    const matchFilter = {};

    if (startDate) {
      // Convert startDate to UTC midnight of the local day
      const startOfDayUTC = moment
        .tz(startDate, 'YYYY-MM-DD', 'Australia/Brisbane')
        .startOf('day')
        .utc()
        .toDate();
      matchFilter['notes.date'] = { $gte: startOfDayUTC };
    }

    if (endDate) {
      // Convert endDate to UTC end of the local day
      const endOfDayUTC = moment
        .tz(endDate, 'YYYY-MM-DD', 'Australia/Brisbane')
        .endOf('day')
        .utc()
        .toDate();
      matchFilter['notes.date'] = matchFilter['notes.date']
        ? { ...matchFilter['notes.date'], $lte: endOfDayUTC }
        : { $lte: endOfDayUTC };
    }

    if (userName) {
      matchFilter['notes.createdBy'] = userName; // Match by userName
    }

    console.log('Match Filter:', JSON.stringify(matchFilter, null, 2)); // Debug log

    const matchStage = { $match: matchFilter };
    const unwindStage = { $unwind: '$notes' };
    const groupStage = {
      $group: {
        _id: null,
        totalNotes: {
          $sum: {
            $cond: [{ $ne: ['$notes.type', 'email'] }, 1, 0], // Exclude email notes
          },
        },
        contactedNotes: {
          $sum: {
            $cond: [{ $eq: ['$notes.contacted', true] }, 1, 0],
          },
        },
        totalEmailsSent: {
          $sum: {
            $cond: [{ $eq: ['$notes.type', 'email'] }, 1, 0], // Count only email notes
          },
        },
      },
    };

    const result = await Contact.aggregate([unwindStage, matchStage, groupStage]);

    res.status(200).json(result[0] || { totalNotes: 0, contactedNotes: 0, totalEmailsSent: 0 });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;