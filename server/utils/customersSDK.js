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
var _ = require('lodash');
var Mnubo = require('./mnubo.js');

var customers = [

    {
        name: 'ic',
        id: '',
        secret: ''
    }

];

var customersSDK = {
    getCustomers: function() {
        return _.sortBy(_.map(customers, 'name'), function(customer) {
            return customer;
        });
    },
    initializeSDKS: function() {
        _.forEach(customers, function(value, key) {
            customers[key].sdk = new Mnubo({
                id: customers[key].id,
                secret: customers[key].secret,
                env: 'sandbox'
            });
        });
    },
    getSDK: function(customer) {
        var customerId = _.findIndex(customers, ['name', customer]);
        if (customers[customerId].sdk) {
            return customers[customerId].sdk;
        } else {
            customerId.sdk = new Mnubo({
                id: customers[customerId].id,
                secret: customers[customerId].secret,
                env: 'sandbox'
            });
            return customerId.sdk;
        }
    }
};

// export the module
module.exports = customersSDK;
