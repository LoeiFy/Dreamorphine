// covers to Object
covers = covers.split(',');

// covers to Array
covers = Object.keys(covers).map(function(i) { return covers[i] });

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

// window resize
var resize = function(f) {
    var t;
    $(window).on('resize', function() {
        clearTimeout(t)
        t = setTimeout(function() {
            f()
        }, 500)
    })
}

// dom ready
$(function($) {

    // define
    var init, rows, columns, container = $('#container'), S, H, t0, t1;

    resize(function() {
        var _w = container.width(), _h = container.height();
        if (_w == container.data('w') && _h == container.data('h')) return;

        clearTimeout(t0)
        clearTimeout(t1)
        init()
    })

    ;(init = function() {

        var _width = container.width();

        switch (true) {

            case (_width <= 1000):
                columns = 10; 
            break;

            case (_width <= 1600):
                columns = 12; 
            break;

            case (_width <= 1800):
                columns = 14; 
            break;

            default:
                columns = 16;

        }

        // get item width and gap width
        var itemWidth = Math.floor(_width / columns),
            gapWidth = _width - itemWidth * columns,

            // html string
            str = '';

        // get rows
        rows = Math.ceil(window.innerHeight / itemWidth)

        // total covers to show
        S = covers.slice(0, rows * columns);

        // random covers
        H = covers.slice(rows * columns);

        for (var k = 0; k < S.length; k ++) {
            str += '<li><img alt="'+ S[k] +'"/></li>';
        }

        $('#container').html(str)

        for(var i = 0; i < rows; i ++) {
            for(var j = 0; j < columns; j ++) {
                var idx = columns * i + j,
                    item = container.find('li').eq(idx);

                item.css({
                    width : j < gapWidth ? itemWidth + 1 : itemWidth,
                    height : itemWidth
                })
            }
        }

        container.height(itemWidth * rows).data('w', _width).data('h', itemWidth * rows)

        container.find('li').each(function() {
            var m = $(this).find('img');

            m.attr('src', 'thumbnails/'+ m.attr('alt') +'.jpg').on('load', function() {
                $(this).addClass('loaded')
            })

        })

        setTimeout(function() {
            var _a = [];
            for (var i = 0; i < S.length; i ++) {
                _a.push(i)
            }

            ;(function f() {

                if (!_a.length) {
                    setTimeout(function() {

                        ;(function g() {

                            var Hn = R(0, H.length),
                                Hl = 'thumbnails/'+ H[Hn] +'.jpg',

                                Sn = R(0, S.length),
                                Sl = container.find('li').eq(Sn),
                                St = Sl.find('img').attr('alt');

                            $('<img src="'+ Hl +'" />').on('load', function() {

                                Sl.prepend('<img src="'+ Hl +'" alt="'+ H[Hn] +'" />')

                                $(Sl.find('img')[0]).css('opacity', 1)
                                $(Sl.find('img')[1]).css('opacity', 0)

                                setTimeout(function() {
                                    $(Sl.find('img')[1]).remove()
                                }, 1000)

                                H.splice(Hn, 1)
                                H.push(St)

                                t1 = setTimeout(function() { g() }, R(1001, 3000))
                            })

                        })();

                    }, 1000)

                    return;
                }

                var n = R(0, _a.length),
                    e = container.find('li').eq(_a[n]).find('img');

                if (e.hasClass('loaded')) {
                    e.css('opacity', 1)
                    _a.splice(n, 1)
                }

                t0 = setTimeout(function() { f() }, 100)

            })();
        }, 1000)

    })();

    container.on('click', function(e) {
        var target = $(e.target);

        if (target.css('opacity') == 0) return;
        var cover = 'covers/'+ target.attr('alt') +'.jpg';
    })

})
