console.log(process.env.NODE_ENV);
module.exports = process.env.NODE_ENV != 'production' ? require('./dev_config.js') : require('./prod_config.js');

