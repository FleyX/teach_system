const redis = require('redis');
const config = require('../config/config.js');

let client = redis.createClient(config.redis);
client.on('error', err => {
    throw err;
})

client.on('ready', () => {
    console.log('redis 初始化');
})

class RedisHelper {

    static getClient() {
        return client;
    }

    static setString(key, value, expiration = 300) {
        if (typeof value != 'string') {
            value = JSON.stringify(value);
        }
        return new Promise((resolve, reject) => {
            client.set(key, value, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                RedisHelper.setExpiration(key, expiration);
                resolve(reply);
            });
        })
    }

    static getString(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(reply);
            });
        })
    }

    static async setObject(key, obj, expiration = 300) {
        if (typeof (obj) != 'object') {
            reject('obj 不是一个对象');
            return;
        }
        let keys = Object.keys(obj);
        let temp = null;
        for (let i = 0; i < keys.length; i++) {
            temp = obj[keys[i]];
            if (typeof (temp) == 'object') {
                temp = JSON.stringify(temp);
            }
            if (expiration > 0) {
                await RedisHelper.setObjectItem(key, keys[i], temp);
            }
        }
        await RedisHelper.setExpiration(key, expiration);
        return 'OK';
    }

    static getObject(key) {
        return new Promise((resolve, reject) => {
            client.hgetall(key, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(reply);
            })
        })
    }

    static setObjectItem(key, itemName, value) {
        return new Promise((resolve, reject) => {
            client.hmset(key, itemName, value, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(reply);
            })
        })
    }
    static setExpiration(key, time = 300) {
        return new Promise((resolve, reject) => {
            client.expire(key, time, (err, reply) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(reply);
            })
        })
    }

    static setExpirationTimestamp(key,timestamp){
        return new Promise((resolve,reject)=>{
            client.pexpireat(key,timestamp,(err,reply)=>{
                if(err)
                    reject(err);
                else
                    resolve(reply);
            })
        })
    }

    static deleteKey(key) {
        return new Promise((resolve, reject) => {
            client.del(key,(err,reply)=>{
                resolve();
            });
        })
    }
}

module.exports = RedisHelper;