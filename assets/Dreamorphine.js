
// all covers generate by grunt
var covers='Isabliss,a_journey_to_freedom,air_10_000HZ_legend_frontal,alcest_ecailles_de_lume,alone_journey,alternative_endings,an_airplane_carried_me_to_bed,and_water_cycles,art_of_the_world,as_if_to_nothing,aurora,b_sights,before_circus_over,best_of_jazzin_for_ghibli,beyond_the_clouds,catoblepas,china_lounge_feat_shanghai_divas,cinema,country_falls,dawning,debiut,digital_darkness,diorama,dreamorphine,dynamo,e18,east_end_girl,eating,eingya,euphony,eyes_wide_open,eyes_wide_open_album_art,fabric_39,falliccia,family_genesis,fantasia_pop,found_again,freedom_of_the_son,happiness,happy_up_here,hope_for_tomorrow,i_am_in_a_polaroid_where_are_you,i_can_do_better,illuminus,in_a_tidal_wave_of_mystery,in_flesh_tones,insides,into_the_mellow_city,introducing_chill_out,kaleidoscope,kid_a,kinetic_world,ladera,lady_soul,land_and_water,let_it_be,libyus_music_sound_history,life,lost_imagination,melancholic_jazz_supreme,metaphorical_music,mirror,modal_soul,moonlight_sunrise,morning_star,niji_no_kashu,nujabeats,past_is_past,peace_of_mind,pilots,prima_vista,ray_guns_are_not_just_the_future,raz_ohara_and_the_odd_orchestra,safe_in_the_steep_cliffs,sakura_waltz_remixes,samurai_champloo_departure,say_i_am_you,school_of_the_flower,serenity,smooth_sound_collection,sonnambula,soulstice,star_of_love,still_here&onie,story_of_a_city,sunset_girls,take_cover,tense,the_archer_trilogy_part_2,the_electricity_in_your_house_wants_to_sing,the_melody,the_nothings_of_the_north,the_sound,the_sounds_fade_away_at_morning,the_stories_linger_in_my_mind,through_the_window,tide_of_stars,torches,tribute_to_Jun,tribute_to_jun_2,uphill_city,visionary,walls,what_has_happened_to_me_in_this_world,wind_up_musica_2';

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

// define rows and columns
var rows = 4, columns = 15;

// total covers to show
var S = covers.slice(0, rows * columns);

// random covers
var H = covers.slice(rows * columns);

// return random number
function R(a, b){
    return Math.floor(Math.random() * (b - a) + a)
}

// dom ready
$(function($) {

    // get item width and gap width
    var itemWidth = Math.floor($('#container').width() / columns),
        gapWidth = $('#container').width() - itemWidth * columns,

        // html string
        str = '';

    for (var k = 0; k < S.length; k ++) {
        str += '<li><img alt="'+ S[k] +'"/></li>';
    }

    $('#container').html(str)

    for(var i = 0; i < rows; i ++) {
        for(var j = 0; j < columns; j ++) {
            var idx = columns * i + j,
                item = $('#container li').eq(idx);

            item.css({
                width : j < gapWidth ? itemWidth + 1 : itemWidth,
                height : itemWidth
            })
        }
    }


    $('#container li').each(function() {

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

        (function f() {

            if (!_a.length) {
                setTimeout(function() { grid() }, 1000)
                return;
            }

            var n = R(0, _a.length),
                e = $('#container li').eq(_a[n]).find('img');

            if (e.hasClass('loaded')) {
                e.css('opacity', 1)
                _a.splice(n, 1)
            }

            setTimeout(function() { f() }, 100)

        })();

    }, 1000)

    function grid() {

        (function g() {

            var Hn = R(0, H.length),
                Hl = 'thumbnails/'+ H[Hn] +'.jpg',

                Sn = R(0, S.length),
                Sl = $('#container li').eq(Sn),
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

                setTimeout(function() { g() }, R(1001, 3000))
            })

        })();

    }

})
