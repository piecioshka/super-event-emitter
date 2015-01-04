/**
 * @author Piotr Kowalski <piecioshka@gmail.com>
 * @fileOverview Underscore.js assertion helper
 * @see https://github.com/piecioshka/underscore.assert
 * @requires http://underscorejs.org/
 * @license The MIT License
 */

// Example of _.assert
// -------------------

//     _.assert(true, 'True must be truly value'); // idle...
//     _.assert(typeof Object === 'number', 'Global value *Object* should be fn'); // throws AssertionError with message

/*jslint nomen: true, indent: 4 */
/*global define */

(function (root, factory) {
    'use strict';

    if (typeof define !== 'undefined' && define.amd) {
        define(['underscore'], factory);
    } else {
        factory(root._);
    }
}(this, function (_) {
    'use strict';

    /**
     * Assertion Error module.
     *
     * @param {string} [message]
     */
    function AssertionError(message) {
        this.name = 'AssertionError';
        this.message = (message || this.name);
    }

    AssertionError.prototype = Error.prototype;
    AssertionError.prototype.constructor = AssertionError;

    /**
     * Check first param for `true`.
     * When first param is `false` value, throw `AssertionError`.
     *
     * @param {boolean} condition
     * @param {string} [message]
     * @throws When condition will be falsy value.
     */
    function assert(condition, message) {
        if (!condition) {
            throw new AssertionError(message);
        }
    }

    _.mixin({
        'assert': assert
    });
}));
