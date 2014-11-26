/*
 author: Carlos Martin
 Module Name: emic2
 Description: Interact with Emic 2 TTS
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Queue = require('sync-queue');

function emic2(hardware, callback){

    var self = this;

    self.pause = false;

    self.uart = null;

    self.timer = 200; //Wait for device to power up

    self.speaking = false;

    self.baudrate = 9600;

    self.hardware = hardware;

    self.queue = new Queue();

    EventEmitter.call(this);

    self.init(callback);

    return self;
}

util.inherits(emic2, EventEmitter);

emic2.prototype.init = function(hardware, callback){
    console.log('Initiating Emic 2 module TTS');
    var self = this;
    if(!self.hardware){ throw 'Missing hardware reference'; }

    self.uart = new self.hardware.UART();
    setTimeout(function(){
        self.uart.write('\n');
        self.uart.once('data', function(data){
            var res = data.toString();
            if(res.match(/:/)){
                if(callback) callback();
                self.emit('ready');
                self.setListener();
            }
        });
    }, self.timer);
};

emic2.prototype.setListener = function(){
    var self = this;
    self.uart.on('data', function(data){
        var res = data.toString();
        if(res.match(/:/)){
            self.emit('done');
            self.queue.next();
        }else if(res.match(/\?/)){
            self.emit('error');
            self.queue.next();
        }
    });
};

emic2.prototype.destroy = function(callback){
    this.uart.removeListener('data');
    if(callback) callback();
};

emic2.prototype.speak = function (text) {
    var self = this;
    self.queue.place(function s(){
        self.uart.write('S' + text + '\n');
    });
    return this;
};

emic2.prototype.setLanguage = function(lan, op){
    var self = this;
    self.queue.place(function(){
        var l = 0;
        switch(lan){
            case 'en':
                l = 0;
                break;
            case 'es':
                l = typeof op === 'undefined' ? 1 : (op === 'lan' ? 2 : 1 );
                break;
        }
        self.uart.write('L' + l + '\n');
    });
};

emic2.prototype.setVolume = function(vol){
    var self = this;
    self.queue.place(function(){
        self.uart.write('V' + vol + '\n');
    });
};

emic2.prototype.setVoice = function(voice){
    var self = this;
    self.queue.place(function(){
        self.uart.write('N' + voice + '\n');
    });
};

emic2.prototype.setRate = function(rate){
    var self = this;
    self.queue.place(function(){
        self.uart.write('W' + rate + '\n');
    });
};

emic2.prototype.pause = function(){
    self.uart.write('Z\n');
};

emic2.prototype.stop = function(){
    this.uart.write('X\n');
};

emic2.prototype.reset = function(){
    var self = this;
    self.queue.place(function(){
        self.uart.write('R\n');
    })
};

function use(hardware, callback){
    return new emic2(hardware, callback);
}

module.exports.emic2 = emic2;
module.exports.use = use;
