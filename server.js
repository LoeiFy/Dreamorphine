/*
 * $ node server.js 
 * http://127.0.0.1:2333
 * $ PORT=[port] node server.js
 */

var express = require('express'),
    gm = require('gm'),
    Vibrant = require('node-vibrant'),
    multer  = require('multer'),

    fs = require('fs'),
    crypto = require('crypto');

var server = express(),
    upload = multer({dest: './temp/'});

server.use(express.static('./publish'))

server.get('/covers', upload.array(), function(req, res, next) {
    var covers = fs.readFileSync('./temp/posts', 'utf8');

    res.json({
        c: 0,
        m: 'success',
        d: covers
    })
})

server.get('/img/:md5', function(req, res, next) {
    var opt = {
        root: __dirname +'/covers/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    var file = req.params.md5 +'.jpg';

    res.sendFile(file, opt, function(err) {
        if (err) {
            console.log(err)
            res.status(err.status).end()
        }
    })
})

server.post('/delete', upload.array(), function(req, res, next) {
    var md5 = req.body.md5,
        coverPath = './covers/'+ md5 +'.jpg',
        thumbnailPath = './thumbnails/'+ md5 +'.jpg',
        postPath = './posts/'+ md5;

    fs.unlink(coverPath, function(err) {
        if (err) {
            res.json({
                c: -1,
                m: 'fail'
            })
        } else {
            fs.unlink(thumbnailPath, function(err) {
                if (err) {
                    res.json({
                        c: -1,
                        m: 'fail'
                    })
                } else {
                    fs.unlink(postPath, function(err) {
                        if (err) {
                            res.json({
                                c: -1,
                                m: 'fail'
                            })
                        } else {
                            res.json({
                                c: 0,
                                m: 'success'
                            })
                        }
                    })
                }
            })
        }
    })
})

server.post('/', upload.single('file'), function(req, res, next) {
    var file = req.file,
        album = req.body.album.replace(/"/g, '\\"'),
        author = req.body.author.replace(/"/g, '\\"');

    var w, h;

    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {

        if (!fs.existsSync('./covers')) {
            fs.mkdirSync('./covers')
        }

        if (!fs.existsSync('./thumbnails')) {
            fs.mkdirSync('./thumbnails')
        }

        if (!fs.existsSync('./posts')) {
            fs.mkdirSync('./posts')
        }

        var type = file.mimetype == 'image/jpeg' ? 'jpg' : 'png';

        var md5 = crypto.createHash('md5'),
            fileData = fs.ReadStream(req.file.path);

        fileData.on('data', function(e) {
            md5.update(e)
        })

        fileData.on('end', function() {

            var hex = md5.digest('hex');

            fs.createReadStream(req.file.path)
            .pipe(fs.createWriteStream('./covers/'+ hex +'.'+ type))

            gm(req.file.path).size(function(err, value) {
                w = value.width;
                h = value.height;
            })
            .resize(200)
            .noProfile()
            .crop(200, 200, 0, 0)
            .quality(96)
            .write('./thumbnails/'+ hex +'.'+ type, function (err) {

                var v = new Vibrant(req.file.path, {});
                v.getSwatches(function(err, swatches) {
                    var color = '#000';
                    
                    if (swatches['DarkMuted']) {
                        color = swatches.DarkMuted.getHex()
                    }

                    if (swatches['Muted']) {
                        color = swatches.Muted.getHex()
                    }

                    if (swatches['DarkVibrant']) {
                        color = swatches.DarkVibrant.getHex()
                    }

                    if (swatches['Vibrant']) {
                        color = swatches.Vibrant.getHex()
                    }

                    // md5, Vibrant, width, height, album, author
                    var s = '["'+ 
                            hex +'","'+
                            color +'","'+
                            w +'","'+
                            h +'","'+
                            album +'","'+
                            author +'"]';

                    fs.writeFile('./posts/'+ hex, s, function() {
                        res.json({
                            c: 0,
                            m: 'success'
                        })
                    })
                })
            })
        })
    }
})

server.listen(process.env.PORT || 2333)

console.log('Running at: http://127.0.0.1:'+ (process.env.PORT || '2333'))
