/*
 * ---------------------------------------------------------------------------
 *
 * COPYRIGHT (c) 2016 Mnubo Inc. All Rights Reserved.
 *
 * The copyright to the computer program(s) herein is the property of Mnubo
 * Inc. The program(s) may be used and/or copied only with the written
 * permission from Mnubo Inc. or in accordance with the terms and conditions
 * stipulated in the agreement/contract under which the program(s) have been
 * supplied.
 *
 * ---------------------------------------------------------------------------
 */

'use strict';

angular.module('ScoresexplorerApp')
    .directive('deviceWidget', function() {
        return {
            restrict: 'E',
            templateUrl: 'views/widget.html',
            scope: {
                title: '@',
                number: '@',
                icon: '@',
                color: '@'
            }

        };
    });
