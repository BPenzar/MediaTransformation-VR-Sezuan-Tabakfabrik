AFRAME.registerComponent('play-next-sound', {
    schema: {type: 'selector'},

    init: function () {
        var targetEl = this.data;  // Specified via schema.
        var soundEl = this.el;

        soundEl.addEventListener('sound-ended', function () {
            targetEl.components.sound.playSound();
        });
    }
});

AFRAME.registerComponent('sound-event-animate', {
    schema: {
        aevent: {default: 'soundanim1'},

        target5: { parse:function(value){
            return document.getElementsByClassName(value);

        } }
    },

    init: function () {

        var data = this.data;

        this.el.addEventListener('sound-ended', function () {
            for (var i=0; i<4; i++)
                data.target5[i].emit(data.aevent);
        });
    }
});



AFRAME.registerComponent('event-animate', {
    schema: {
        target: {type: 'selector'},
        aevent: {default: 'animation1'},
        // triggeraction Beispiele: 'sound-ended', 'mouseenter', 'animationend'
        triggeraction: {default: 'click'}
    },

    init: function () {


        var data = this.data;

        this.el.addEventListener(data.triggeraction, function () {
            data.target.emit(data.aevent);
            console.log('leave');
        });
        this.el.addEventListener(data.triggeraction, function () {
            data.target.emit(data.aevent);
            console.log('leave');
        });

    }

});

AFRAME.registerComponent('fliessband-animate', {
    schema: {
        target: {type: 'selector'},
        aevent: {default: 'animation1'}, // 'nolook' animation
        aevent2: {default: 'animation2'} // 'look' animation
    },

    init: function () {
        var data = this.data;
        var kamera = this.el;
        var zustand = 'true';
        var zeit = 0;

        /* Funktion, die jede Sekunde prüft ob man nach x-Achsen-Wert auf das Fließband schaut.
           Ist dies nicht der Fall, sendet sie ein nolook event an sich selbst
           Standardmäßig sendet sie ein look event.*/
        setInterval( function () {

            var firstRotation = kamera.getAttribute('rotation');
            var myRotation = firstRotation[Object.keys(firstRotation)[0]];

            if (myRotation > -35 || myRotation < -82)  {
                kamera.emit('nolook');
            }
            else {
                kamera.emit('look');
            }
        }, 1000);

        /*Eventhandler, der prüft ob 4 mal hintereinander (also 4 sekunden lang) das nolook event gesendet wurde
          ist dies der Fall und sollte der zustand true sein, sendet der ein event an die hitbox
          danach setzt er den zustand auf false und setzt den zeitzähler zurück.
          Der Zustand soll verhindern, dass zwei mal das gleiche Event hintereinander gesendet wird*/
        this.el.addEventListener('nolook', function(){
            zeit ++;

            if ( zeit === 4 && zustand == 'true'){
                data.target.emit(data.aevent);
                zustand = 'false';
                zeit = 0;
            }
        });
        /*Eventhandler, der prüft ob wieder auf das Fließband geschaut wurde
          Ist dies der Fall und sollte der zustand false sein, sendet er das gegenevent an die hitbox
          danach setzt er den zustand auf true und den zeitzähler zurück.*/
        this.el.addEventListener('look', function(){
            if( zustand == 'false'){
                data.target.emit(data.aevent2);
                zustand = 'true';
                zeit = 0;
            }
        });
    }

});




