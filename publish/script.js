var note = function(s) {
    var t,
        n = document.getElementById('note'), 
        p = document.querySelectorAll('#note p')[0];

    clearTimeout(t)
    n.classList.remove('active')

    p.innerHTML = s;
    n.classList.add('active')

    t = setTimeout(function() {
        n.classList.remove('active')
    }, 1500)
}

document.addEventListener('DOMContentLoaded', function() {

    var FD, mk = false;

    var drop = document.getElementById('drop'),
        file = document.getElementById('file');

    drop.addEventListener('dragover', function(e) {
        e.preventDefault()
        this.classList.add('active')
    }, false)

    drop.addEventListener('dragleave', function(e) {
        e.preventDefault()
        this.classList.remove('active')
    }, false)

    drop.addEventListener('drop', function(e) {
        e.preventDefault()

        FD = null;
        FD = new FormData();
        FD.append('file', e.dataTransfer.files[0])
        this.innerHTML = e.dataTransfer.files[0].name;
        this.classList.add('active')

        mk = true;
    }, false)

    drop.addEventListener('click', function() {
        file.click()
    }, false)

    file.addEventListener('change', function(e) {
        FD = null;
        FD = new FormData();
        FD.append('file', e.target.files[0])
        drop.innerHTML = e.target.files[0].name;
        drop.classList.add('active')

        mk = true;
    })

    document.getElementById('form').addEventListener('submit', function(e) {
        e.preventDefault()

        var album = this.album.value,
            author = this.author.value;

        if (!mk) {
            note('please select an image')
            return false
        }
        if (!album) {
            note('please enter a title')
            return false
        }
        if (!author) {
            note('please enter a url')
            return false
        }

        var xhr = new XMLHttpRequest();

        FD.append('album', album)
        FD.append('author', author)

        xhr.open('POST', '/', true)

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                var d = JSON.parse(this.response);
                if (parseInt(d.c) === 0) {
                    mk = false;
                    drop.innerHTML = 'Drag cover image here or browse to upload [JPG, PNG]';
                    drop.classList.remove('active')
                   
                    document.getElementById('album').value = '';
                    document.getElementById('author').value = '';
                    alert(d.m)
                } else {
                    alert(d.m)
                }
            }
        }

        xhr.send(FD)
    }, false)

    // all covers
    var covers = [];

    ;(function() {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/covers', true)

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                covers = JSON.parse(this.response).d;
                covers = JSON.parse('['+ covers +']');
            }
        }

        xhr.send()
    }())

    document.getElementById('album').previousElementSibling.addEventListener('click', function() {

        var search = 'one fine day'.toLowerCase().split(' ');

        var back = [];

        if (covers.length <= 0) {
            alert('covers 0')
            return
        }

        for (var i = 0; i < covers.length; i ++) {
            var album = covers[i][4].toLowerCase();

            for (var j = 0; j < search.length; j ++) {
                if (album.indexOf(search[j]) > -1) {
                    back.push(i)
                    break;
                }
            }
        }

        if (back.length <= 0) {
            alert('not match')
            return
        }

        for (var k = 0; k < back.length; k ++) {
            console.log(covers[back[k]])
        }

    }, false)

/*
server.get('/check', upload.array(), function(req, res, next) {
    var covers = fs.readFileSync('./temp/posts', 'utf8');
    covers = JSON.parse('['+ covers +']');

    var url = req.originalUrl;
    url = url.split('?')[1];
    url = decodeURIComponent(url);
    url = url.split('&');

    var info = {};
    for (var i = 0; i < url.length; i ++) {
        var data = url[i].split('=');
        info[data[0]] = data[1]
    }

    for (var j = 0; j < covers.length; j ++) {
        var album = covers[j][4],
            author = covers[j][5];
        
        info.album = info.album.split(' ');
        info.author = info.author.split(' ');

        for (var k = 0; k < info.album.length; k ++) {
            if (album.indexOf(info.album[k]) > -1) {
            }
        }
    }

    res.json({
        c: 0,
        m: 'success',
        d: info
    })
})
*/

})
