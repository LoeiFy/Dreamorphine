//alert(window.devicePixelRatio)
// shuffle Array
Array.prototype.shuffle = function() {
    var i = this.length, p, t;
    while (i--) {
        p = Math.floor(Math.random()*i);
        t = this[i];
        this[i] = this[p];
        this[p] = t;
    }
    return this
}

// return shuffle covers
covers = covers.shuffle();

// return random number
function R(a, b){
    return Math.floor(Math.random() * (b - a) + a)
}

$(function($) {

    // define
    var container = $('#container'), mark = $('#mark');

    var str = '<ul>';

    for (var i = 0; i < covers.length; i ++) {
        
        // random left, top
        var w = container.width(), h = 400, _w = 200, _h = 200, t = 0, l = 0;

        t = R(- _h / 8, h - _h / 8 * 7);

        if (i % 3 === 0) {
            l = R(0, w / 3 - _w / 8 * 7)
        }

        if (i % 3 === 1) {
            l = R(- _w / 8, w / 3 - _w / 8 * 7)
        }

        if (i % 3 === 2) {
            l = R(- _w / 8, w / 3 - _w)
        }

        str += '<li data-u="'+ covers[i][0] +'" data-c="'+ covers[i][1] +'" data-m="'+ covers[i][4] +'" data-r="'+ covers[i][5] +'" style="margin-top:'+ t +'px;margin-left:'+ l +'px">'+
               '<img src="thumbnails/'+ covers[i][0] +'.jpg" />'+
               '<div style="background-color:'+ covers[i][1] +'"></div>'+
               '</li>';

        if ((i + 1) % 3 === 0) {
            str += '</ul><ul>'
        }
    }

    str += '</ul>';

    $('#container').html(str)

    // show big cover
    container.on('click', function(e) {
        if (container.data('click') == 1) {
            return
        }

        if (e.target.tagName == 'IMG') {

            var target = $(e.target).parent();

            container.data('click', 1)

            var cover = 'covers/'+ target.data('u') +'.jpg';
            
            $('#canvas').attr('src', cover)

            new CBFimage($('#canvas')[0], {
                start: function() {
                    // start load image
                },
                progress: function(loaded, total) {
                    console.log(loaded +'###'+ total)
                },
                complete: function(image) {
                    mark.addClass('show')

                    mark.find('.inner').width(600).height(600)
                    mark.find('.bg').css('background-color', target.data('c'))
                    mark.find('.info').html('<h2>'+ target.data('m') +'</h2><h3>'+ target.data('r') +'</h3>')
                }
            })    
        }
    })

    // close mark
    mark.on('click', function(e) {
        mark.removeClass('show').addClass('loading')
        container.data('click', 0)
    })

})

/*
 * https://github.com/LoeiFy/CBFimage/blob/master/README.md
 *
 * @version 1.0.0
 * @author LoeiFy@gmail.com
 * http://lorem.in/ | under MIT license
 */

;(function(window, undefined) {

    function CBFimage(element, option) {

        this.option = {
            start:      function() {},
            progress:   function(loaded, total) {},
            complete:   function(image) {}
        }

        if (option && typeof option === 'object') {
            for (var key in option) {
                this.option[key] = option[key]
            }
        }

        if (element && element.getAttribute('src') !== '') {
            this.element = element;

            this.src = element.getAttribute('src');

            var blur = parseInt(element.getAttribute('blur'));
            this.blur = blur > 0 && blur <= 10 ? blur : 0;

            this.loadImg()
        }

    }

    // canvas draw image
    CBFimage.prototype.canvasImg = function(image) {

        this.element.width = image.width;
        this.element.height = image.height;

        var context = this.element.getContext('2d');
        context.drawImage(image, 0, 0)

        if (this.blur > 0) {
            context.globalAlpha = 0.5;

            for (var y = -this.blur; y <= this.blur; y += 2) {
                for (var x = -this.blur; x <= this.blur; x += 2) {
                    context.drawImage(this.element, x + 1, y + 1)
                    if (x >= 0 && y >= 0) {
                        context.drawImage(this.element, -(x-1), -(y-1))
                    }
                }
            }
            context.globalAlpha = 1;
        }

    }

    // xhr get image
    CBFimage.prototype.loadImg = function () {

        var request = new XMLHttpRequest(),
            that = this;

        request.onloadstart = function() {
            that.option.start()
        }

        request.onprogress = function(e) {
            // may total = 0
            if (parseInt(e.total) !== 0) {
                that.option.progress(e.loaded, e.total)
            }
        }

        request.onload = function(e) {
            if (this.status >= 200 && this.status < 400) {
                var image = new Image();
                image.onload = function() {
                    that.canvasImg(image)
                    that.option.complete(image)
                }
                image.src = 'data:image/jpeg;base64,'+ base64Encode(request.responseText);
            }
        }

        request.open('GET', that.src, true)
        request.overrideMimeType('text/plain; charset=x-user-defined')
        request.send(null)

    }

    // http://www.philten.com/us-xmlhttprequest-image/
    function base64Encode(inputStr) {

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
            outputStr = '',
            i = 0;
                   
        while (i < inputStr.length) {
            //all three "& 0xff" added below are there to fix a known bug 
            //with bytes returned by xhr.responseText
            var byte1 = inputStr.charCodeAt(i++) & 0xff,
                byte2 = inputStr.charCodeAt(i++) & 0xff,
                byte3 = inputStr.charCodeAt(i++) & 0xff,
                
                enc1 = byte1 >> 2,
                enc2 = ((byte1 & 3) << 4) | (byte2 >> 4),       
                enc3,
                enc4;

                if (isNaN(byte2)) {
                    enc3 = enc4 = 64;
                } else {
                    enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                    if (isNaN(byte3)) {
                        enc4 = 64;
                    } else {
                        enc4 = byte3 & 63;
                    }
                }
            outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
        }         
        return outputStr

    }

    window.CBFimage = CBFimage;

})(window)
