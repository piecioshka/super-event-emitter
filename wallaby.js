'use strict';

module.exports = function () {
    return {
        files: [
            'package.json',
            'src/**/*.js'
        ],

        tests: [
            'test/unit/specs/**/test.*.js'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jasmine'
    };
};
