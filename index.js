var _ = require('lodash');

/**
 * Email validation regex
 *
 * @type {RegExp}
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validator map
 *
 * @type {{required: string, string: string, numeric: string, phone: string, email: string}}
 */
var validators = {
    'required': 'validateIsRequired',
    'string': 'validateIsString',
    'numeric': 'validateIsNumeric',
    'phone': 'validateIsPhone',
    'email': 'validateIsEmail'
};

/**
 * Accepted phone patterns
 *
 * @type {string[]}
 */
var phonePatterns = [
    '### ### ####',
    '##########',
    '# ### ### ####'
];

/**
 * Internal rules for matching
 *
 * @type {{string: RegExp, numeric: RegExp}}
 */
var rules = {
    string: /^[A-Z]+$/i
};

/**
 * Validates if input was provided
 * @param input
 * @returns {boolean}
 */
function validateIsRequired(input) {
    return ((_.isUndefined(input) || _.isNull(input) || _.isNaN(input) || input === '') === false);
}

/**
 * Validates if input is string
 * @param input
 * @returns {boolean}
 */
function validateIsString(input) {
    return (_.isNull(input.match(rules.string)) === false);
}

/**
 * Validates if input is numeric
 * @param input
 * @returns {boolean}
 */
function validateIsNumeric(input) {
    return _.isFinite(+input);
}

/**
 * Validates if input matches accepted phone pattern
 * @param input
 * @returns {boolean}
 */
function validateIsPhone(input) {
    var converted = (""+input).trim().replace(/[0-9]/g, "#").replace(/[-.]/g, " ");
    return (phonePatterns.indexOf(converted) !== -1);
}

/**
 * Validates if input matches EMAIL_PATTERN
 * @param input
 * @returns {boolean}
 */
function validateIsEmail(input) {
    return (_.isNull(input.match(EMAIL_PATTERN)) === false);
}

/**
 * Executes local function given a string of function name
 *
 * @param funcname
 * @param context
 * @returns {*}
 */
function executeByString(funcname, context) {
    if (typeof context[funcname] === 'function') {
        var args = Array.prototype.slice.call(arguments, 2);
        return context[funcname].apply(context, args);
    }

    return false;
}

/**
 * Returns whether or not a given input matches a given pattern
 *
 * @param pattern
 * @param input
 * @returns {boolean}
 */
function isValid(pattern, input) {
    var segments = pattern.split('|');
    console.log(segments);

    for (var i = segments.length; i > 0; i--) {
        var current = segments[i];
        if (_.has(validators, current)) {
            if (executeByString(validators[current], this, input) === false) {
                return false;
            }
        }
    }

    return true;
}

// Reveal Sentry API
function Sentry() {}

// Add items to Sentry prototype
_.extend(Sentry.prototype, {
    isValid: isValid,
    validateIsRequired: validateIsRequired,
    validateIsString: validateIsString,
    validateIsPhone: validateIsPhone,
    validateIsNumeric: validateIsNumeric,
    validateIsEmail: validateIsEmail
});

var inst = new Sentry();
module.exports = inst;