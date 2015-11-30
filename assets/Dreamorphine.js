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

    var str = '';

    for (var i = 0; i < covers.length; i ++) {
        str += '<li><img data-u="'+ covers[i][0] +'" data-c="'+ covers[i][1] +'" data-w="'+ covers[i][2] +'" data-h="'+ covers[i][3] +'" data-m="'+ covers[i][4] +'" data-r="'+ covers[i][5] +'" /></li>';
        }

    $('#container').html(str)

    container.find('li').each(function() {
        var m = $(this).find('img');

        m.attr('src', 'thumbnails/'+ m.data('u') +'.jpg').on('load', function() {
            $(this).addClass('loaded')
        })
    })

        setTimeout(function() {

            var _a = [];
            for (var i = 0; i < covers.length; i ++) {
                _a.push(i)
            }

            if (!_a.length) {
                return
            }

            (function f() {

                var n = R(0, _a.length),
                    e = container.find('li').eq(_a[n]).find('img');

                if (e.hasClass('loaded')) {
                    e.css('opacity', 1)
                    _a.splice(n, 1)

                    if (!_a.length) {
                    }
                }

                setTimeout(function() {
                    f() 
                }, 100)

            }())

        }, 1000)


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
