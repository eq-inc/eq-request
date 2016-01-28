/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/*jslint node: true */
/*global before, describe, it */
'use strict';


// Variables
const http = require('http'),
    nurl = require('url'),
    util = require('util'),
    expect = require('expect.js'),
    request = require('../'),
    port = 3000,
    url = util.format('http://localhost:%d/', port);


// Before
before(function () {
    http.createServer(function (req, res) {
        let data = '';
        req.on('data', function (chunk) {
            data = data + chunk;
        });
        req.on('end', function () {
            const url_object = nurl.parse(req.url),
                result = {
                    method: req.method,
                    query: url_object.query || '',
                    data: data || '',
                    test: req.headers['x-test']
                };

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result));
            res.end();
        });
    }).listen(port);
});


// Test
describe('EqRequest', function () {
    describe('getHeader', function () {
        it('Should get header', function () {
            const client = request({
                key1: 'value1',
                key2: 'value2'
            });

            expect(client.getHeader('key1')).to.be('value1');
            expect(client.getHeader('key2')).to.be('value2');
        });
    });

    describe('setHeader', function () {
        it('Should set header', function () {
            const client = request();

            expect(client.getHeader('key')).to.be(undefined);

            client.setHeader('key', 'value');
            expect(client.getHeader('key')).to.be('value');
        });
    });

    describe('client', function () {
        it('Should get request', function () {
            const client = request(),
                superagent = client.request();

            expect(superagent).to.be.an(Object);
        });
    });

    describe('get', function () {
        it('Should send get request', function (done) {
            const client = request(),
                data = {data: 'Test'},
                test = 'test.get';
            client.setHeader('x-test', test);
            client.get(url, data, function (error, result) {
                if (error) {
                    return done(error);
                }

                expect(result.body).to.eql({
                    method: 'GET',
                    query: 'data=Test',
                    data: '',
                    test: test
                });

                done();
            });
        });
    });

    describe('post', function () {
        it('Should send post request', function (done) {
            const client = request(),
                data = 'Test',
                test = 'test.post';
            client.setHeader('x-test', test);
            client.post(url, data, function (error, result) {
                if (error) {
                    return done(error);
                }

                expect(result.body).to.eql({
                    method: 'POST',
                    query: '',
                    data: data,
                    test: test
                });

                done();
            });
        });
    });

    describe('api', function () {
        it('Should get api function', function () {
            const client = request(),
                api = client.api(url);

            expect(api).to.be.a(Function);
        });
    });
});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
