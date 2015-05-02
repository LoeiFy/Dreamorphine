
var covers='a_journey_to_freedom,air_10_000HZ_legend_frontal,alcest_ecailles_de_lume,alone_journey,alternative_endings,and_water_cycles,art_of_the_world,as_if_to_nothing,aurora,b_sights,before_circus_over,best_of_jazzin_for_ghibli,beyond_the_clouds,catoblepas,china_lounge_feat_shanghai_divas,cinema,country_falls,dawning,debiut,digital_darkness,diorama,dreamorphine,dynamo,e18,east_end_girl,eating,eingya,euphony,eyes_wide_open,eyes_wide_open_album_art,fabric_39,falliccia,family_genesis,fantasia_pop,found_again,freedom_of_the_son,happiness,happy_up_here,i_am_in_a_polaroid_where_are_you,illuminus,in_a_tidal_wave_of_mystery,in_flesh_tones,insides,into_the_mellow_city,introducing_chill_out,kaleidoscope,kid_a,kinetic_world,ladera,land_and_water,let_it_be,libyus_music_sound_history,life,lost_imagination,melancholic_jazz_supreme,metaphorical_music,mirror,modal_soul,moonlight_sunrise,morning_star,niji_no_kashu,nujabeats,past_is_past,peace_of_mind,pilots,prima_vista,ray_guns_are_not_just_the_future,raz_ohara_and_the_odd_orchestra,safe_in_the_steep_cliffs,sakura_waltz_remixes,samurai_champloo_departure,say_i_am_you,school_of_the_flower,serenity,smooth_sound_collection,sonnambula,soulstice,star_of_love,still_here&onie,story_of_a_city,sunset_girls,take_cover,tense,the_archer_trilogy_part_2,the_electricity_in_your_house_wants_to_sing,the_melody,the_nothings_of_the_north,the_sound,the_sounds_fade_away_at_morning,the_stories_linger_in_my_mind,through_the_window,tide_of_stars,torches,tribute_to_Jun,tribute_to_jun_2,uphill_city,visionary,walls,what_has_happened_to_me_in_this_world,wind_up_musica_2';

covers = covers.split(',');

var R = covers.sort(function() { return Math.random() - 0.5 }),
    S = R.slice(0, 80),
    H = R.slice(80);

function rnd(start, end){
    return Math.floor(Math.random() * (end - start) + start);
}

$(function($) {

    var str = '';
    for (var i = 0; i < S.length; i ++) {

        str += '<li><img alt="'+ S[i] +'"/></li>';

    }

    $('#container').html(str)

    $('#container').find('li').each(function() {
        var t = $(this),
            w = t.width(),
            m = t.find('img');

        t.width(w).height(w)

        m.attr('src', 'thumbnails/'+ m.attr('alt') +'.jpg').on('load', function() {
            $(this).addClass('loaded')
        })
    })

    setTimeout(function() {

        var _a = [];
        for (var i = 0; i < 80; i ++) {
            _a.push(i)
        }

        (function f() {

            if (!_a.length) return;

            var n = rnd(0, _a.length),
                e = $('#container li').eq(_a[n]).find('img');

            if (e.hasClass('loaded')) {
                e.css('opacity', 1)
                _a.splice(n, 1)
            }

            setTimeout(function() { f() }, 200)

        })();

    }, 1000)

})
