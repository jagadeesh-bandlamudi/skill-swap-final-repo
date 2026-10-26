/**
 * Backend Password Validator utility
 * Imports the canonical, shared validation logic from frontend/js/password-validator.js
 * to ensure that frontend and backend rules are 100% consistent and can never drift.
 */
const path = require('path');
const passwordValidator = require(path.join(__dirname, '../../frontend/js/password-validator'));

module.exports = passwordValidator;
