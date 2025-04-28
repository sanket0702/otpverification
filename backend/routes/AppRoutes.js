import express from 'express';

import { emailOtpController, mobileOtpController } from '../controller/otpController.js';

const router = express.Router();

router.post('/send-verification-code-email',emailOtpController);
router.post('/send-verification-code-mobile',mobileOtpController);


export default router;