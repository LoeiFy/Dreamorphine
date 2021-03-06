// shuffle Array
Array.prototype.shuffle = function() {
    var i = this.length, p, t;
    while (i --) {
        p = Math.floor(Math.random() * i);
        if (p > 0) {
            t = this[i];
            this[i] = this[p];
            this[p] = t;
        }
    }
    return this
}

// random number
function R(a, b) {
    return Math.floor(Math.random() * (b - a) + a)
}

function template(cover) {
    var s = '<ul>';

    var w = $('#container').width(), 
        h = 400, 
        _w = 200, 
        _h = 200; 

    if (window.innerWidth <= 800) {
        h = 200;
        _w = 100;
        _h = 100;
    }

    cover = cover.split('@@').shuffle();

    for (var i = 0; i < cover.length; i ++) {
        var t, l;

        // margin top
        t = R(- _h / 8, h - _h / 8 * 7);

        // margin left
        if (i % 3 === 0) {
            l = R(0, w / 3 - _w / 8 * 7)
        }
        if (i % 3 === 1) {
            l = R(- _w / 8, w / 3 - _w / 8 * 7)
        }
        if (i % 3 === 2) {
            l = R(- _w / 8, w / 3 - _w)
        }

        cover[i] = cover[i].split(',');

        if (cover[i].length == 1) {
            if (t > 70) {
                t = 70
            }
            if (l > 37) {
                l = 37
            }

            s += '<li class="static" style="margin-top:'+ t +'px;margin-left:'+ l +'px">'+
                 '<h2>'+ cover[i][0].split('##')[0] +'</h2>'+
                 '<p>'+ cover[i][0].split('##')[1] +'</p>'+
                 '</li>';
        } else {
            s += '<li data-u="'+ cover[i][0] +'" data-w="'+ cover[i][2] +'" data-h="'+ cover[i][3] +'" data-c="'+ cover[i][1] +'" data-m="'+ cover[i][4] +'" data-r="'+ cover[i][5] +'" style="margin-top:'+ t +'px;margin-left:'+ l +'px">'+
                 '<img src="thumbnails/'+ cover[i][0] +'.jpg?0" />'+
                 '<div></div>'+
                 '</li>';
        }

        if ((i + 1) % 3 === 0) {
            s += '</ul><ul>'
        }
    }

    s += '</ul>';

    return s.split('<ul></ul>')[0];
}

var svg = '<svg x="0px" y="0px" width="36px" height="36px" viewBox="0 0 36 36"><circle fill="none" stroke="#2a76e8" stroke-width="2" cx="18" cy="18" r="16" style="transition: stroke-dashoffset .3s ease;" stroke-dasharray="100 100" stroke-dashoffset="100" transform="rotate(-90 18 18)"></circle></svg>';

$(function($) {

    window.onload = function() {
        $('.static h2').addClass('font')
    }

    var container = $('#container'), mark = $('#mark'),
        page = 0,   // current page
        target,     // current image
        time,       // scroll time
        loader,     // image load function
        xhr;        // global xhr

    ;(loader = function(covers) {
        $(template(covers)).appendTo(container).find('img').each(function() {
            var that = $(this);

            that.on('load', function() {
                that.css('opacity', 1).off('load')
            })
            if (that.prop('complete')) {
                setTimeout(function() {
                    that.trigger('load')
                }, 0)
            }
        })
    }).call(window, cover0)

    // scroll
    $(window).on('DOMMouseScroll mousewheel touchmove', function(e) {
        if (mark.hasClass('show')) {
            e.preventDefault()
            return
        }

        clearTimeout(time)
        time = setTimeout(function() {
            if (parseInt($(window).scrollTop()) + 1000 > container.height()) {
                if ($('body').hasClass('loading') || $('body').data('end') == 1) {
                    return
                }
                $('body').addClass('loading')

                page ++;

                setTimeout(function() {
                    $.ajax({
                        type: 'GET',
                        url: 'pages/'+ page,
                        success: function(data) {
                            loader(data)
                            setTimeout(function() {
                                $('body').removeClass('loading')
                            }, 0)
                        },
                        error: function(a, b, c) {
                            $('body').removeClass('loading')
                            if (a.status == 404) {
                                $('body').data('end', 1)
                            }
                        }
                    })
                }, 0)
            }
        }, 300)
    })

    // show cover
    container.on('click', function(e) {
        if (e.target.tagName == 'DIV' || e.target.tagName == 'LI') {
            if (xhr) {
                // abort previous
                xhr.abort()
                target.find('div').html('')
            }

            target = e.target.tagName == 'LI' ? $(e.target) : $(e.target).parent();

            if (target.attr('id') == 'static') {
                return
            }

            if (target.find('img').css('opacity') != 1) {
                return
            }

            target.css('z-index', '1')

            var cover = 'covers/'+ target.data('u') +'.jpg?0';
            $('#canvas').attr('src', cover)

            xhr = new CBFimage($('#canvas')[0], {
                start: function() {
                    target.find('div').append('<p style="color:'+ target.data('c') +'">0</p>')
                    target.find('div').append(svg).find('circle').attr('stroke', target.data('c'))
                },
                progress: function(loaded, total) {
                    target.find('circle').attr('stroke-dashoffset', 100 - (loaded / total) * 100)
                    target.find('p').html(Math.ceil((loaded / total) * 100))
                },
                complete: function(image) {
                    mark.addClass('show')

                    mark.find('.inner').width(target.data('w')).height(target.data('h'))
                    mark.find('.bg').css('background-color', target.data('c'))
                    mark.find('.info').html('<h2>'+ target.data('m') +'</h2><h3>'+ target.data('r') +'</h3>')
                }
            })    
        }
    })

    // close cover
    mark.on('click', function(e) {
        container.data('loading', 0)
        mark.removeClass('show').addClass('loading')
        target.css('z-index', '')
        target.find('div').html('')
    })
})

/*
 * https://github.com/LoeiFy/CBFimage/blob/master/README.md
 *
 * @version 1.0.1
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

            for (var y = - this.blur; y <= this.blur; y += 2) {
                for (var x = - this.blur; x <= this.blur; x += 2) {
                    context.drawImage(this.element, x + 1, y + 1)
                    if (x >= 0 && y >= 0) {
                        context.drawImage(this.element, - (x - 1), - (y - 1))
                    }
                }
            }
            context.globalAlpha = 1;
        }

    }

    // xhr get image
    CBFimage.prototype.loadImg = function () {

        var that = this;
        this.request = new XMLHttpRequest();

        this.request.onloadstart = function() {
            that.option.start()
        }

        this.request.onprogress = function(e) {
            // may total = 0
            if (parseInt(e.total) !== 0) {
                that.option.progress(e.loaded, e.total)
            }
        }

        this.request.onload = function(e) {
            if (this.status >= 200 && this.status < 400) {
                var image = new Image();
                image.onload = function() {
                    that.canvasImg(image)
                    that.option.complete(image)
                }

                var type = that.src.substr(that.src.lastIndexOf('.') + 1).substr(0, 3);

                if (type == 'jpg') {
                    type = 'jpeg'
                }

                image.src = 'data:image/'+ type +';base64,'+ base64Encode(that.request.responseText);
            }
        }

        this.request.open('GET', that.src, true)
        this.request.overrideMimeType('text/plain; charset=x-user-defined')
        this.request.send(null)

    }

    // abort
    CBFimage.prototype.abort = function() {
        this.request.abort()
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

