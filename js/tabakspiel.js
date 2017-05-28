//Global Counter um Kisten ID's hochzuzählen
var kistencounter = 0;
AFRAME.registerComponent('kistenspawn', {

    schema: {
    },

    init: function () {
        //Kisten spawnen und mit fortlaufender Nummer versehen
        setInterval( function () {
            // Kiste erstellen und Eigenschaften von Hauptkiste kopieren
            var name = 'kiste' + kistencounter,
                productionLine = document.querySelector('#fließband3'),
                box = document.createElement('a-entity'),
                attributes = {
                    'id': name,
                    'class': 'kiste',
                    'geometry': {
                        primitive: 'box',
                        height: 1,
                        width: 1
                    },
                    'position': '1 1.88 0.9',
                    'kistenabstand': '',
                    'kistenclick': '',
                    'material': {
                        side: 'double'
                    },
                    'scale': '1 0.4 0.8'
                },
                animationattributes = {
                    'attribute': 'position',
                    'from': '1 1.88 0.9',
                    'to': '8 1.88 0.9',
                    'dur': '12000',
                    'begin': ''
                    //'end': 'animationStop'
                };

            for (var property in attributes) {
                box.setAttribute(property, attributes[property]);
            }
            if (box.getAttribute('id') == 'kiste0') {
                box.removeAttribute('kistenabstand');
            }
            productionLine.appendChild(box);
            kistencounter++;


            var newBox = document.querySelector('#' + name),
                newAnimation = document.createElement('a-animation');

            for (var animationProperty in animationattributes) {
                newAnimation.setAttribute(animationProperty, animationattributes[animationProperty]);
            }
            if (newBox.getAttribute('id') == 'kiste0') {
                newAnimation.removeAttribute('begin');
            }

            newBox.appendChild(newAnimation);
        },10000);
    }
});


AFRAME.registerComponent('kistenabstand', {
    schema: {
        prename: { type: 'string' },
        thisname: { type: 'string' },
        prebox: {type: 'selector'},
        thisbox: { type: 'selector' },
        status: {type: 'boolean', default: true},
        distance: {type: 'number'}
    },


    init: function () {
        var data = this.data,
            el = this.el;
        data.prename = 'kiste' + (kistencounter - 2);
        data.prebox = document.querySelector('#' + data.prename);
        data.thisname = 'kiste' + (kistencounter - 1);
        data.thisbox = document.querySelector('#' + data.thisname);


        this.el.addEventListener('anhalten', function() {
            el.firstChild.setAttribute('begin', 'animationGo');
            var thisPosition = el.getAttribute('position').x;
            el.firstChild.setAttribute('from', thisPosition + ' 1.88 0.9');
            el.firstChild.setAttribute('dur', (15 - thisPosition) * 1000);
        });

    },

    tick: function () {
            this.data.distance = this.data.prebox.getAttribute('position').x - this.data.thisbox.getAttribute('position').x;
            if (this.data.distance < 1.5 && this.data.status == true) {
                this.el.emit('anhalten');
                this.data.status = false;
            }
            else if (this.data.distance > 1.5 && this.data.status == false) {
                this.el.emit('animationGo');
                this.data.status = true;
            }
     }
});

AFRAME.registerComponent('kistenclick', {

    init: function() {
        var el = this.el;
        //var zustand = true;
        el.addEventListener('click', function () {
            var neueAnimation = document.createElement('a-animation');
            neueAnimation.setAttribute('attribute', 'position');
            neueAnimation.setAttribute('from', '8 1.88 0.9');
            neueAnimation.setAttribute('to', '12 1.88 0.9');
            neueAnimation.setAttribute('dur', '8000');
            el.appendChild(neueAnimation);
        });
    }
});

