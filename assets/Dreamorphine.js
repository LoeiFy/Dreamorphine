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

var L = {
    loader: function() {
        var w = window.innerWidth;
        var css = '<style id="loaderstyle">@-moz-keyframes loader{0%{background-position:0 0}100%{background-position:'+ w +'px 0}}@-webkit-keyframes loader{0%{background-position:0 0}100%{background-position:'+ w +'px 0}}></style>';
        $('#loaderstyle').remove()
        $('head').append(css)
    },
    loading: function() {
        $('.loader').addClass('loading').show()
    },
    loaded: function() {
        $('.loader').removeClass('loading').hide()
    }
}

$(function($) {

    // define
    var init, rows, columns, container = $('#container'), S, H, t0, t1;
    var mark = $('#mark');

    // window resize time
    var T;

    // get window width
    var W = window.innerWidth;

    // loader
    L.loader()

    ;(init = function() {

        L.loading()
        
        var _width = container.width();

        columns = Math.ceil(_width / 100);

        // get item width and gap width
        var itemWidth = Math.floor(_width / columns),
            gapWidth = _width - itemWidth * columns,

            // html string
            str = '';

        // get rows
        rows = 4;

        // total covers to show
        S = covers.slice(0, rows * columns);

        // random covers
        H = covers.slice(rows * columns);

        for (var k = 0; k < S.length; k ++) {
            str += '<li><img data-u="'+ S[k][0] +'" data-c="'+ S[k][1] +'" data-w="'+ S[k][2] +'" data-h="'+ S[k][3] +'" data-m="'+ S[k][4] +'" data-r="'+ S[k][5] +'" /></li>';
        }

        $('#container').html(str)

        for(var i = 0; i < rows; i ++) {
            for(var j = 0; j < columns; j ++) {
                var idx = columns * i + j,
                    item = container.find('li').eq(idx),
                    w = j < gapWidth ? itemWidth + 1 : itemWidth;

                item.css({
                    width : w,
                    height : itemWidth
                })

                if (i === 0) {
                    $('#line').append('<div style="width:'+ w +'px"></div>')
                }
            }
        }

        container.height(itemWidth * rows).data('w', _width).data('h', itemWidth * rows)

        container.find('li').each(function() {
            var m = $(this).find('img');

            m.attr('src', 'thumbnails/'+ m.data('u') +'.jpg').on('load', function() {
                $(this).addClass('loaded')
            })

        })

        setTimeout(function() {

            var _a = [];
            for (var i = 0; i < S.length; i ++) {
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
                        g()
                        L.loaded()
                    }
                }

                clearTimeout(t0)
                t0 = setTimeout(function() {
                    f() 
                }, 100)

            }())

            function g() {

                if (!H.length) {
                    return
                }

                var Hn = R(0, H.length),
                    Hl = 'thumbnails/'+ H[Hn][0] +'.jpg',

                    Sn = R(0, S.length),
                    Sl = container.find('li').eq(Sn);

                $('<img src="'+ Hl +'" />').on('load', function() {

                    Sl.prepend('<img src="'+ Hl +'" data-u="'+ H[Hn][0] +'" data-c="'+ H[Hn][1] +'" data-w="'+ H[Hn][2] +'" data-h="'+ H[Hn][3] +'" data-m="'+ H[Hn][4] +'" data-r="'+ H[Hn][5] +'" />')

                    $(Sl.find('img')[0]).css('opacity', 1)
                    $(Sl.find('img')[1]).css('opacity', 0)

                    setTimeout(function() {
                        $(Sl.find('img')[1]).remove()
                    }, 1000)

                    H.splice(Hn, 1)
                    H.push(S[Sn])

                    clearTimeout(t1)
                    t1 = setTimeout(function() {
                        g()
                    }, R(1001, 3000))
                })

            }

        }, 1000)

    }).call()

    // window resize
    $(window).on('resize', function() {
        mark.trigger('click')
        clearTimeout(T)

        T = setTimeout(function() {
            if (window.innerWidth != W) { 
                $('#line').html('')
                init()
            }
        }, 500)    
    })

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

        L.loading()

        var cover = 'covers/'+ target.data('u') +'.jpg';
        $('<img src="'+ cover +'" />').on('load', function() {
            mark.addClass('show')
            L.loaded()

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
