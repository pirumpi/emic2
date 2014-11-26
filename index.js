/*
author: Carlos Martin
Module Name: emic2
Description: Interact with Emic 2 TTS
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function emic2(hardware, callback){

    var self = this;

    self.pause = false;

    self.uart = null;

    self.timer = 200; //Wait for device to power up

    self.baudrate = 9600;

    self.hardware = hardware;

    self.init(callback);

    return self;
}

util.inherits(emic2, EventEmitter);

emic2.prototype.init = function(hardware, callback){

    var self = this;
  if(!hardware){ throw 'Missing hardware reference'; }

    self.uart = new self.hardware.UART();
    setTimeout(function(){
        self.uart.write('\n');
        self.uart.on('data', function(data){
            console.log('Response: ',data.toString());
        });
    }, self.timer);


};

emic2.prototype.speak = function (text) {

};

emic2.prototype.setLanguage = function(lan, op){

};

emic2.prototype.setVolume = function(vol){

};

emic2.prototype.setVoice = function(voice){

};

emic2.prototype.setRate = function(rate){

};

emic2.prototype.pause = function(){

};

emic2.prototype.resume = function(){

};

emic2.prototype.stop = function(){

};

function use(hardware, callback){
    return new emic2(hardware, callback);
}

module.exports.emic2 = emic2;
module.exports.use = use;
