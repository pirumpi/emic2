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
    self.uart = null;
    self.timer = 200;
    self.currentAction = 'idle';
    self.baudrate = 9600;
    self.hardware = hardware;
    self.queue = new Queue();
    self.init(callback);
    return self;
}

util.inherits(emic2, EventEmitter);

emic2.prototype.init = function(hardware, callback){
    console.log('Initiating Emic 2 module TTS');
    var self = this;
    if(!self.hardware){ throw 'Missing hardware reference'; }

    self.uart = new self.hardware.UART();
    var statusResponse = function(data){
        var res = data.toString();
        console.log(res);
        if(res.indexOf(':') !== -1){
            self.uart.removeListener('data', statusResponse);
            if(callback) callback();
            self.emit('ready');
            self.setListener();
        }
    };
    setTimeout(function(){
        self.uart.write('\n');
        self.uart.on('data', statusResponse);
    }, self.timer);
};

emic2.prototype.setListener = function(){
    var self = this;
    self.uart.on('data', function(data){
        var res = data.toString();
        if(res.indexOf(':') !== -1){
            self.emit('done', self.currentAction);
            self.speaking = false;
            self.queue.next();
        }else if(res.indexOf('?') !== -1){
            self.speaking = false;
            self.emit('error');
            self.queue.next();
        }
    });
};

emic2.prototype.speak = function (text) {
    var self = this;
    self.queue.place(function s(){
        self.currentAction = 'speaking';
        self.uart.write('S' + text + '\n');
    });
    return this;
};

emic2.prototype.setLanguage = function(lan, op){
    var self = this;
    self.queue.place(function(){
        self.currentAction = 'setting language';
        var l = 0;
        switch(lan){
            case 'en':
                l = 0;
                break;
            case 'es':
                l = typeof op === 'undefined' ? 1 : (op === 'lan' ? 2 : 1 );
                break;
        }
        self.uart.write('l' + l + '\n');
    });
    return this;
};

emic2.prototype.setVolume = function(vol){
    var self = this;
    self.queue.place(function(){
        self.currentAction = 'setting volume';
        self.uart.write('V' + vol + '\n');
    });
    return this;
};

emic2.prototype.setVoice = function(voice){
    var self = this;
    self.queue.place(function(){
        self.currentAction = 'setting voice';
        self.uart.write('N' + voice + '\n');
    });
    return this;
};

emic2.prototype.setRate = function(rate){
    var self = this;
    self.queue.place(function(){
        self.currentAction = 'setting rate';
        self.uart.write('W' + rate + '\n');
    });
    return this;
};

emic2.prototype.pause = function(){
    this.uart.write('Z\n');
    return this;
};

emic2.prototype.stop = function(){
    this.uart.write('X\n');
    return this;
};

emic2.prototype.reset = function(){
    var self = this;
    self.queue.place(function(){
        self.currentAction = 'resetting';
        self.uart.write('R\n');
    });
    return this;
};

function use(hardware, callback){
    return new emic2(hardware, callback);
}

module.exports.emic2 = emic2;
module.exports.use = use;
