const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail')

// Create a secret for JWT
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_dev_secret';

// @route POST /api/auth/signup
// router.post('/signup', async (req, res) => {
//   const { email, password, phoneNumber } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Creating a new user instance
//     user = new User({
//       email,
//       password,
//       phoneNumber,
//       profile: {}
//     });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Saving the user to the database
//     await user.save();

//     // Creating and sign a JWT
//     const payload = {
//       user: {
//         id: user.id
//       }
//     };

//     jwt.sign(
//       payload,
//       JWT_SECRET,
//       { expiresIn: '1h' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token, msg: 'Registration successful. Redirect to profile setup.' });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// @route POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user && user.isEmailVerified) { // Check if a verified user already exists
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // If user exists but is not verified, we'll overwrite their OTP
    if (user && !user.isEmailVerified) {
        await User.deleteOne({ email });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Create a new user instance
    user = new User({
      email,
      password,
      phoneNumber,
      profile: {},
      emailVerificationToken: otp,
      emailVerificationTokenExpires: otpExpires,
      isEmailVerified: false
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send the OTP email
    try {
        const message = `Welcome to SkillSwap!\n\nYour One-Time Password (OTP) for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes.`;
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email for SkillSwap',
            message
        });

        res.status(200).json({ msg: 'OTP has been sent to your email. Please verify to complete registration.' });

    } catch (emailError) {
        console.error("Email sending error:", emailError.message);
        // Fallback: if the email service is unavailable, don't block sign-up.
        // Print the OTP to the server console so the account can still be verified.
        console.log('==================================================');
        console.log(`📧  Email could not be sent. VERIFICATION CODE for ${user.email}:`);
        console.log(`     >>>  ${otp}  <<<   (valid for 10 minutes)`);
        console.log('==================================================');
        return res.status(200).json({
            msg: 'We could not send the email right now. Your verification code has been printed in the server console — enter it to continue.',
            emailUnavailable: true
        });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user with the matching email, OTP, and ensure the OTP is not expired
        const user = await User.findOne({
            email,
            emailVerificationToken: otp,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please request a new one.' });
        }

        // Verification successful: update the user's status
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        await user.save();

        // Create and sign a JWT to log the user in
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: 'Email verified successfully. You are now logged in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});





// @route POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  console.log("SIGNIN REQUEST");
  console.log("Email:", email);
  console.log("Password received:", password);

  try {
    let user = await User.findOne({ email });

    console.log("User found:", user ? user.email : "NO USER");

    if (!user) {
      console.log("❌ Email does not exist");
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;

        res.json({
          token,
          user: {
            _id: user._id,
            email: user.email,
            profile: user.profile
          },
          msg: 'Login successful. Redirect to homepage.'
        });
      }
    );

  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    res.status(500).send('Server Error');
  }
});




// @route   POST /api/auth/forgot-password
// @desc    User requests a password reset OTP.
//          The account MUST exist: if the email is not in the users
//          collection we do NOT generate an OTP and do NOT send an email.
router.post('/forgot-password', async (req, res) => {
    const rawEmail = req.body && req.body.email;

    // Must be a non-empty string. (Also stops query-operator objects such as
    // {"$ne": null} from being passed straight into the database query.)
    if (typeof rawEmail !== 'string' || !rawEmail.trim()) {
        return res.status(400).json({ msg: 'Please enter your email address.' });
    }
    const email = rawEmail.trim();

    try {
        // 1) Exact match first - this is how Sign In / Sign Up store and look up emails.
        let user = await User.findOne({ email });

        // 2) Fall back to a case-insensitive match, so "John@Example.com" still finds
        //    an account stored as "john@example.com" (and vice-versa).
        if (!user) {
            const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            user = await User.findOne({ email: new RegExp(`^${escaped}$`, 'i') });
        }

        // No account with this email: stop here. Nothing is generated, stored or emailed.
        if (!user) {
            return res.status(404).json({
                msg: "You don't have an account with this email. Please create an account first.",
                code: 'ACCOUNT_NOT_FOUND'
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.passwordResetToken = otp;
        user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send the OTP email
        try {
            const message = `You are receiving this because you (or someone else) have requested the reset of the password for your SkillSwap account.\n\nYour password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\nIf you did not request this, please ignore this email.`;
            await sendEmail({
                email: user.email,
                subject: 'SkillSwap - Password Reset OTP',
                message
            });

            // `email` is returned exactly as stored on the account, because the
            // reset-password step matches emails exactly.
            return res.status(200).json({
                msg: 'OTP has been sent to your email.',
                email: user.email
            });

        } catch (emailError) {
            console.error("Email sending error:", emailError);
            // Be honest with the user: the code was NOT delivered.
            return res.status(500).json({
                msg: "We couldn't send the email right now. Please try again in a moment."
            });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/reset-password
// @desc    User submits OTP and new password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find the user with the matching email, OTP, and ensure it's not expired
        const user = await User.findOne({
            email,
            passwordResetToken: otp,
            passwordResetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Please try again.' });
        }

        // Verification successful: Hash new password and update user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear the reset token fields
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();

        // Generate a new JWT to log the user in automatically
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, msg: 'Password reset successful. You are now logged in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;