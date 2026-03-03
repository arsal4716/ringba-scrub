const express = require('express');
const router = express.Router();
const { saveSchedule, getSchedule } = require('../controllers/scheduleController');
const { uploadDNC } = require('../controllers/dncController');
const { getFiles, downloadFile, deleteFile } = require('../controllers/filesController');
const { getDashboard } = require('../controllers/dashboardController');

// Schedule
router.get('/schedule', getSchedule);
router.post('/schedule', saveSchedule);

// DNC
router.post('/dnc/upload', uploadDNC);

// Files
router.get('/files', getFiles);
router.get('/files/:id/download', downloadFile);
router.delete('/files/:id', deleteFile);

// Dashboard
router.get('/dashboard', getDashboard);

module.exports = router;