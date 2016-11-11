/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true, nomen: true, regexp: true, unparam: true, vars: true */
'use strict';



// Variables
const nurl = require('url'),
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
     * @param      {Object} options
     */
    constructor(headers, options) {
        const self = this;
        self.suparagent = superagent;

        self.config = options || {};
        self.headers = headers || {};

        self.method = self.config.method || 'method';
        self.params = self.config.params || 'params';
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
        if (Object.getPrototypeOf(key) === Object.prototype) {
            self.headers = Object.assign(self.headers, key);
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

        return self.headers[key] || default_value;
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
        if (parameters instanceof Function) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
            request = self.request(),
            url_object = nurl.parse(url);
        url_object.search = '';
        url_object.query = Object.assign(url_object.query || {}, parameters || {});

        const client = request.get(nurl.format(url_object));
        Object.keys(self.headers).forEach(function (key) {
            client.set(key, self.headers[key]);
        });

        return new Promise(function (resolve, reject) {
            client.end(function (error, result) {
                return (error) ? reject(error) : resolve(result);
            });
        }).then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Post request
     *
     * @param {string} url
     * @param {Object} parameters
     * @param {Function} callback
     */
    post(url, parameters, callback) {
        if (parameters instanceof Function) {
            callback = parameters;
            parameters = {};
        }

        const self = this,
            request = self.request(),
            client = request.post(url);
        Object.keys(self.headers).forEach(function (key) {
            client.set(key, self.headers[key]);
        });
        client.send(parameters);

        return new Promise(function (resolve, reject) {
            client.end(function (error, result) {
                return (error) ? reject(error) : resolve(result);
            });
        }).then(function (result) {
            return (callback) ? callback(null, result) : Promise.resolve(result);
        }).catch(function (error) {
            return (callback) ? callback(error) : Promise.reject(error);
        });
    }

    /**
     * Get API function
     *
     * @param   {string} location
     * @returns {Function}
     */
    api(location) {
        const self = this;

        return function (method, params, callback) {
            if (params instanceof Function) {
                callback = params;
                params = {};
            }

            const parameters = {};
            parameters['jsonrpc'] = '2.0';
            parameters[self.method] = method;
            parameters[self.params] = params;

            return self.post(location, parameters, callback);
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
