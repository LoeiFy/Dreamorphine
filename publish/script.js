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

})
