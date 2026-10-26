/**
 * Password Validator - Universal Module (Browser & Node.js)
 * Enforces unified password security policies across LearnX:
 *  1. Minimum 8 characters
 *  2. At least one uppercase letter (A–Z)
 *  3. At least one lowercase letter (a–z)
 *  4. At least one number (0–9)
 *  5. At least one special character (@, #, $, !, %, etc.)
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.PasswordValidator = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var RULES = [
        {
            id: 'length',
            label: 'At least 8 characters',
            test: function (pw) { return typeof pw === 'string' && pw.length >= 8; },
            errorMessage: 'Password must be at least 8 characters long.'
        },
        {
            id: 'uppercase',
            label: 'At least one uppercase letter (A–Z)',
            test: function (pw) { return /[A-Z]/.test(pw); },
            errorMessage: 'Password must contain at least one uppercase letter (A–Z).'
        },
        {
            id: 'lowercase',
            label: 'At least one lowercase letter (a–z)',
            test: function (pw) { return /[a-z]/.test(pw); },
            errorMessage: 'Password must contain at least one lowercase letter (a–z).'
        },
        {
            id: 'number',
            label: 'At least one number (0–9)',
            test: function (pw) { return /[0-9]/.test(pw); },
            errorMessage: 'Password must contain at least one number (0–9).'
        },
        {
            id: 'special',
            label: 'At least one special character (@, #, $, !, %, etc.)',
            test: function (pw) { return /[^A-Za-z0-9\s]/.test(pw); },
            errorMessage: 'Password must contain at least one special character (@, #, $, !, %, etc.).'
        }
    ];

    function validatePassword(password) {
        var pw = typeof password === 'string' ? password : '';
        var rulesStatus = {};
        var errors = [];
        var passedCount = 0;

        for (var i = 0; i < RULES.length; i++) {
            var rule = RULES[i];
            var passed = rule.test(pw);
            rulesStatus[rule.id] = passed;
            if (passed) {
                passedCount++;
            } else {
                errors.push(rule.errorMessage);
            }
        }

        var isValid = (errors.length === 0);

        // Strength calculation
        var strength = 'Weak';
        var strengthClass = 'weak';
        var percentage = 0;

        if (pw.length === 0) {
            strength = '';
            strengthClass = 'none';
            percentage = 0;
        } else if (passedCount <= 2) {
            strength = 'Weak';
            strengthClass = 'weak';
            percentage = Math.max(20, passedCount * 20);
        } else if (passedCount <= 4) {
            strength = 'Moderate';
            strengthClass = 'medium';
            percentage = passedCount * 20;
        } else {
            // All 5 rules pass
            if (pw.length >= 12) {
                strength = 'Very Strong';
                strengthClass = 'very-strong';
                percentage = 100;
            } else {
                strength = 'Strong';
                strengthClass = 'strong';
                percentage = 100;
            }
        }

        return {
            isValid: isValid,
            rules: rulesStatus,
            passedCount: passedCount,
            totalRules: RULES.length,
            percentage: percentage,
            strength: strength,
            strengthClass: strengthClass,
            errors: errors
        };
    }

    return {
        RULES: RULES,
        validate: validatePassword,
        validatePassword: validatePassword
    };
}));
