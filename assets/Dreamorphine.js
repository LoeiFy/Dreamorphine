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

    var str = '<div>';

    for (var i = 0; i < covers.length; i ++) {
        
        // random left, top
        var w = container.width(), h = 300, _w = 200, _h = 200, t = 0, l = 0;

        t = R(- _h / 8, h - _h / 8 * 7);

        if (i % 3 === 0) {
            l = R(_w / 8, w / 3 - _w / 8 * 7)
        }

        if (i % 3 === 1) {
            l = R(- _w / 8, w / 3 - _w / 8 * 7)
        }

        if (i % 3 === 2) {
            l = R(- _w / 8, w / 3 - _w / 8 * 9)
        }

        str += '<img style="margin-top:'+ t +'px;margin-left:'+ l +'px" src="thumbnails/'+ covers[i][0] +'.jpg" data-c="'+ covers[i][1] +'" data-w="'+ covers[i][2] +'" data-h="'+ covers[i][3] +'" data-m="'+ covers[i][4] +'" data-r="'+ covers[i][5] +'" />';

        if ((i + 1) % 3 === 0) {
            str += '</div><div>'
        }
    }

    str += '</div>';

    $('#container').html(str)

    // show big cover
    container.on('click', function(e) {
        if (container.data('click') == 1) {
            return
        }

        var target = $(e.target);

        if (parseInt(target.css('opacity')) === 0 || !target.data('u') || !target.attr('src')) {
            return
        }

        container.data('click', 1)

        var cover = 'covers/'+ target.data('u') +'.jpg';
        $('<img src="'+ cover +'" />').on('load', function() {
            mark.addClass('show')

            mark.find('.inner').width(target.data('w')).height(target.data('h'))
            mark.find('.img').html($(this))
            mark.find('.bg').css('background-color', target.data('c'))
            mark.find('.info').html('<h2>'+ target.data('m') +'</h2><h3>'+ target.data('r') +'</h3>')
        })
    })

    // close mark
    mark.on('click', function(e) {
        mark.removeClass('show').addClass('loading').find('.img').html('')
        container.data('click', 0)
    })

})
