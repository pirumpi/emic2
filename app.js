/**
 * Created by carlos on 11/26/14.
 */
var tessel = require('tessel');
var emic2 = require('../').use(tessel.port['C']);


emic2.on('ready', function(){
   console.log('ready');
});