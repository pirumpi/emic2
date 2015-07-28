#Emic 2
A simple JS API to communicate with the Emic 2. Emic 2 is a module used to perform TTS. This particular version of the API is targeted to [Tessel](http://tessel.io) microcontroller.

##Installation
```js
npm install emic2
```
![Alt text](http://goo.gl/VSVZSs "Tessel emic2")
##Initiating module
```js
var tessel = require('tessel');
var emic2 = require('emic2').use(tessel.port['D']);

emic2.on('ready', function(){
    emic2.speak('Hello, this is Tessel, your new friend');
});
```
##Methods
* **speak(txt)** The main function that transform text to speech
```js
emic2.speak('Hello there, today is going to be a great day');
```
* **setVoice(int)** Change between 9 available voices in Emic2
```js
    /*
     0: Perfect Paul (Paulo)
     1: Huge Harry (Francisco)
     2: Beautiful Betty
     3: Uppity Ursula
     4: Doctor Dennis (Enrique)
     5: Kit the Kid
     6: Frail Frank
     7: Rough Rita
     8: Whispering Wendy (Beatriz) 
    */
    emic2.setVoice(0); // default voice
```
* **setLanguage('es', ['lan'])** Set the language used in TTS
```js
    /*
     en: English
     es: Spanish | [ lan: latino or ca: castilian ] 
    */
    emic2.setLanguage('es', 'lan') //Setting language to espanish
    .speak('Hola amigos y amigas, esperon que todos esten bien')
    .setLanguage('en')
    .speak('As you can see, I am able to speak two languages, can you?');
```
* **setVolume(int)** Set the volume of the Emic 2
```js
    /*
     Volume range [-48 to 18] 
     -48 (softest) to 18 (loudest)
    */
    emic2.setVolume(10);
```
* **setRate(int)** Set the speaking rate in words per minute from 75 (slowest) to 600 (fastest). 
```js
    //Default value: 200
    emic2.setRate(500)
    .speak('I am speaking kind of fast');
```
* **stop()** Immediately stop the currently playing text-to-speech message. This command is only valid while a message is playing. 
```js
    emic2.speak('This is a really long text........');
    emic2.stop();
```
#License
MIT

**Free Software, Hell Yeah!**