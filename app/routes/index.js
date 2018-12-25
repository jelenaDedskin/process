const express = require('express');
const serverController = require('../controllers/serverController');

const router = express.Router();
/**
 * @api {post} / Calculate price for unprocessed calls or for given call id
 * @apiName Telephony Server
 * @apiGroup Telephony Server
 *
 * @apiParam {String} callId.
 *
 * @apiSuccess {String} data Success message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": "Server initialized",
 *       "error": ""
 *     }
 *
 * @apiError Error There was an error.
 *
 * @apiErrorExample Error-Response:
 *     {
 *       "data": "",
 *       "error": "There was an error"
 *     }
 */
router.post('/', (req, res) => {
  const { callId } = req.body;
  serverController.calculatePrice(req, res, callId);
});

module.exports = router;
