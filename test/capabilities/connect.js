var _ = require('lodash');

var baseConf = require('../../conf/default').connectors['appc.googlesearch'];

exports.connect = {
    baseConf: baseConf,
    badConfigs: [
        _.defaults({ cx: null }, baseConf)
    ]
};