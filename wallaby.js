'use strict';

module.exports = function () {
    return {
        files: [
            'package.json',
            'src/*.js'
        ],

        tests: [
            'test/unit/**/test.*.js'
        ],

        env: {
            type: 'node'
        },

        testFramework: 'jasmine'
    };
};
