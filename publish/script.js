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

// search
function search(covers, str) {
    str = str.toLowerCase().split(' ');

    var index = [];

    if (covers.length <= 0) {
        return -1
    }

    for (var i = 0; i < covers.length; i ++) {
        var album = covers[i][4].toLowerCase();

        for (var j = 0; j < str.length; j ++) {
            if (str[j].length >= 3 && album.indexOf(str[j]) > -1) {
                index.push(i)
                break;
            }
        }
    }

    return index
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
            note('please enter album')
            return false
        }
        if (!author) {
            note('please enter author')
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

    document.getElementById('check').addEventListener('click', function() {
        var album = document.getElementById('album').value;

        if (!album) {
            note('please enter album')
            return
        }

        var index = search(covers, album);

        if (index == -1) {
            note('not covers')
        }

        if (index.length <= 0) {
            note('not match')
        }

        var html = '';
        for (var i = 0; i < index.length; i ++) {
            var cover = covers[index[i]];

            html += '<li>'+
                    '<img src="img/'+ cover[0] +'" />'+
                    '<div>'+
                    '<h2>'+ cover[4] +'</h2>'+
                    '<p>'+ cover[5] +'</p>'+
                    '</div>'+
                    '</li>';
        }

        document.getElementById('show').innerHTML = html;
    }, false)

    document.getElementById('switch').addEventListener('click', function(e) {
        e = e.target;

        if (e.getAttribute('id') == 'left') {
            e.parentNode.children[1].classList.remove('active')
            document.getElementById('toggle').classList.remove('active')
        }

        if (e.getAttribute('id') == 'right') {
            e.parentNode.children[0].classList.remove('active')
            document.getElementById('toggle').classList.add('active')
        }

        e.classList.add('active')
    }, false)

    document.getElementById('delete').addEventListener('submit', function(e) {
        e.preventDefault()

        var album = this.album.value;

        if (!album) {
            note('please enter album')
            return false
        }

        var index = search(covers, album);
        if (index == -1) {
            note('not covers')
        }

        if (index.length <= 0) {
            note('not match')
        }

        var html = '';
        for (var i = 0; i < index.length; i ++) {
            var cover = covers[index[i]];

            html += '<li data-index="'+ index[i] +'" data-md5="'+ cover[0] +'">'+
                    '<img src="img/'+ cover[0] +'" />'+
                    '<div>'+
                    '<h2>'+ cover[4] +'</h2>'+
                    '<p>'+ cover[5] +'</p>'+
                    '</div>'+
                    '</li>';
        }

        document.getElementById('list').innerHTML = html;
    })

    document.getElementById('list').addEventListener('click', function(e) {
        var target;

        if (e.target.tagName == 'IMG' || e.target.tagName == 'DIV') {
            target = e.target.parentNode
        } else if (e.target.tagName == 'H2' || e.target.tagName == 'P') {
            target = e.target.parentNode.parentNode
        } else {
            return
        }

        var album = target.querySelectorAll('h2')[0].textContent;

        if (!confirm('Confirm Delete " '+ album +' " ?')) {
            return
        }

        var index = target.getAttribute('data-index'),
            md5 = target.getAttribute('data-md5');

        var xhr = new XMLHttpRequest(), DATA = new FormData();

        DATA.append('md5', md5)

        xhr.open('POST', '/delete', true)

        xhr.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.response);

                if (parseInt(data.c) === 0) {
                    note('success delete')

                    covers.splice(index, 1)
                    document.getElementById('list').innerHTML = '';
                } 
            }
        }

        xhr.send(DATA)
    }, false)

})
