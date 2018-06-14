'use strict';
const request = require('request');
const fs = require('fs');
const iconv = require('iconv-lite');

class RequestHelper {
    static GET(url, headers, charset='utf-8') {
        var options = {
            method: 'GET',
            url: url,
            headers: headers || null
        };
        return new Promise((resolve, reject) => {
            request(options)
                .on('error', (err) => {
                    reject(err);
                })
                .pipe(iconv.decodeStream(charset)).collect((err, body) => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        resolve(body);
                    }
                });
        })
    }

    static POST(url, form, headers, charset = 'utf-8') {
        var options = {
            method: 'POST',
            url: url,
            // form: form || null,
            body:form,
            json:true,
            headers: headers || null
        };
        return new Promise((resolve, reject) => {
            request(options)
                .on('error', (err) => {
                    reject(err);
                })
                .pipe(iconv.decodeStream(charset)).collect((err, body) => {
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        resolve(body);
                    }
                });
        })
    }

    static async download(url, path) {
        if (fs.existsSync(path))
            return;
        let options = {
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36'
            }
        };
        let stream = fs.createWriteStream(path);
        return new Promise((resolve, reject) => {
            request(options)
                .on('error', (err) => {
                    console.log(err);
                })
                .pipe(stream);
            stream.on('finish', () => {
                resolve(fs.statSync(path).size);
            })
        })
    }
}

module.exports = RequestHelper;