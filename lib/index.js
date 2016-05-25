/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true, regexp: true, unparam: true, vars: true */
'use strict';



// Variables
const nurl = require('url'),
    _ = require('lodash'),
    superagent = require('superagent');


/**
 * EqRequest
 *
 * @class
 */
class EqRequest {

    /**
     * Constructor
     *
     * @constructs EqRequest
     * @param      {Object} headers
     */
    constructor(headers) {
        const self = this;
        self.headers = headers || {};
        self.suparagent = superagent;
    }

    /**
     * Set header
     *
     * @param   {string} key
     * @param   {string} value
     * @returns {EqRequest}
     */
    setHeader(key, value) {
        const self = this;
        self.headers = self.headers || {};
        if (_.isObject(key)) {
            self.headers = _.merge(self.headers, key);
        } else {
            self.headers[key] = value;
        }

        return self;
    }


    /**
     * Get header
     *
     * @param key
     * @param default_value
     * @returns {*}
     */
    getHeader(key, default_value) {
        const self = this;

        return _.get(self.headers, key, default_value);
    }


    /**
     * Get superagent object
     *
     * @returns {superagent}
     */
    request() {
        const self = this;

        return self.suparagent;
    }


    /**
     * Get request
     *
     * @param {string} url
     * @param {Object} parameters
     * @param {Function} callback
     */
    get(url, parameters, callback) {
        if (_.isFunction(parameters)) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
            request = self.request(),
            url_object = nurl.parse(url);
        url_object.search = '';
        url_object.query = _.merge(url_object.query, parameters);

        const client = request.get(nurl.format(url_object));
        _.forEach(self.headers, function (value, key) {
            client.set(key, value);
        });

        if (!callback) {
            return new Promise(function (resolve, reject) {
                client.end(function (error, result) {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                });
            });
        }

        client.end(callback);
    }


    /**
     * Post request
     *
     * @param {string} url
     * @param {Object} parameters
     * @param {Function} callback
     */
    post(url, parameters, callback) {
        if (_.isFunction(parameters)) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
            request = self.request(),
            client = request.post(url);
        _.forEach(self.headers, function (value, key) {
            client.set(key, value);
        });
        client.send(parameters);

        if (!callback) {
            return new Promise(function (resolve, reject) {
                client.end(function (error, result) {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                });
            });
        }

        client.end(callback);
    }


    /**
     * Get API function
     *
     * @param   {string} location
     * @returns {Function}
     */
    api(location) {
        const self = this;

        return function (method, data, callback) {
            if (_.isFunction(data)) {
                callback = data;
                data = {};
            }

            const parameters = {
                method: method,
                data: data
            };

            self.post(location, parameters, callback);
        };
    }
}


// Export module
module.exports = function (headers) {
    return new EqRequest(headers);
};






/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
