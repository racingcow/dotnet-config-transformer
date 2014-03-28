/*
 * dotnet-config-transformer
 * https://github.com/racingcow/dotnet-config-transformer
 *
 * Copyright (c) 2014 David Miller
 * Licensed under the MIT license.
 */

'use strict';

var querystring = require('querystring'),
    extend = require('xtend'),
    http,
    ops;

var _p = {

    httpPost: function(path, data, callback) {

        var body = '',
            postData = querystring.stringify(data),
            opts = extend(ops.post, { path: path });
            opts.headers = extend(opts.headers, { 'Content-Length': Buffer.byteLength(postData) });

        //console.log(opts);
        //console.log(postData);

        var req = http.request(opts, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                body += chunk;
            })
            .on('end', function() {
                callback(null, body);
            })
            .on('error', function(e) {
                callback(e);
            });
        }).on('error', function(e) {
            callback(e);
        });

        req.write(postData);
        req.end();
    }
};

//https://github.com/joyent/node/issues/1918#issuecomment-2480359
exports.deBOMify = function(text) {
    return text.replace(/^\uFEFF/, '');
};

exports.init = function(settings) {
    ops = settings;
    http = require(settings.protocol);
};

exports.transform = function(configXml, transformXml, callback) {
    var data = {
        webConfigXml: this.deBOMify(configXml),
        transformXml: this.deBOMify(transformXml)
    };
    _p.httpPost('/transform', data, callback);
};