function Mouse(a) {
    this.game = a, this.x = 0, this.y = 0, this.down = !1, this.up = !1;
    var b = this;
    this.moving = !1, this.interval = null, this.element = document.getElementById("canvas"), Modernizr.touch ? (this.element.addEventListener("touchstart", function(a) {
        b.touchstart(a)
    }, !1), this.element.addEventListener("touchmove", function(a) {
        b.touchmove(a)
    }, !1), this.element.addEventListener("touchend", function(a) {
        b.touchend(a)
    }, !1)) : (this.element.addEventListener("mousemove", function(a) {
        b.mousemove(a)
    }, !1), this.element.addEventListener("mousedown", function(a) {
        b.mousedown(a)
    }, !1), this.element.addEventListener("mouseup", function(a) {
        b.mouseup(a)
    }, !1))
}

function Point2D(a, b) {
    arguments.length > 0 && (this.x = a, this.y = b)
}

function Piece(a, b, c, d, e, f, g, h, i, j, k) {
    arguments.length > 0 ? (this.id = a, this.game = b, this.width = c, this.height = d, this.x = e, this.y = f, this.target = h, this.startPoint = new Point2D(h.x, h.y), this.holder = i, this.moveble = j, this.placed = k, this.moveble = !1, this.m = (h.y - this.y) / (h.x - this.x), this.b = h.y - this.m * h.x, this.p = Math.random() >= .5 ? .1 : -.1) : (this.id = 0, this.game = null, this.width = 10, this.height = 10, this.x = 0, this.y = 0, this.target = null, this.startPoint = null, this.holder = null, this.moveble = !1, this.placed = null), this.tolerance = 200, this.moving = !1, this.placed = !1
}

function Holder(a, b, c, d, e, f, g) {
    arguments.length > 0 ? (this.id = a, this.game = b, this.x = c, this.y = d, this.line = e, this.column = f, this.moveble = g) : (this.id = 0, this.game = null, this.x = 0, this.y = 0, this.line = null, this.column = null, this.moveble = null)
}

function Game() {
    this.started = !1, this.stage = 1, this.num_lines = 2, this.scale = 1, this.alpha = 1, this.fade1 = 0, this.fade2 = 0, this.resized = !0, this.loadAssets()
}

function RunPrefixMethod(a, b) {
    for (var c, d, e = ["webkit", "moz", "ms", "o", ""], f = 0; f < e.length && !a[c];) {
        if (c = b, "" == e[f] && (c = c.substr(0, 1).toLowerCase() + c.substr(1)), c = e[f] + c, d = typeof a[c], "undefined" != d) return e = [e[f]], "function" == d ? a[c]() : a[c];
        f++
    }
}

function start() {
    startGame()
}

function stop() {
    stopGame()
}

function pause() {
    pauseGame()
}

function loop() {
    game.interval = window.requestAnimationFrame(loop, game.canvas), game.render();
    var a = game.getTimer() - game.time;
    game.time = game.getTimer(), a > game.maxElapsedTime && (game.maxElapsedTime = a)
}

function loadAssets(g, assets) {
    for (i = 0; i < assets.length; i++)
        if ("image" == assets[i].type) eval("g." + assets[i].slug + " = new Image();"), eval("g." + assets[i].slug + '.src = "' + assets[i].src + '";'), eval("g." + assets[i].slug + ".onload = g.loaded_items++;");
        else if ("audio" == assets[i].type) {
        eval("g." + assets[i].slug + " = document.createElement('audio');"), eval("g." + assets[i].slug + ".addEventListener('canplaythrough', itemLoaded(g), false);");
        var source = document.createElement("source");
        Modernizr.audio.ogg ? (source.type = "audio/ogg", source.src = assets[i].src + ".ogg") : Modernizr.audio.mp3 && (source.type = "audio/mpeg", source.src = assets[i].src + ".mp3"), "" != source.src ? eval("g." + assets[i].slug + ".appendChild(source);") : g.itens_to_load--
    }
}

function itemLoaded(a) {
    a.loaded_items++
}

function resizeGame() {
    game.apply_scale(), game.started && game.init()
}
Mouse.prototype.keyup = function(a) {
        console.log(a.keyCode)
    }, Mouse.prototype.isOverBall = function(a) {
        var b = !1;
        return this.x > 0 && this.y > 0 && a.x > 0 && a.y > 0 && this.x >= a.x - a.radius && this.x <= a.x + a.radius && this.y >= a.y - a.radius && this.y <= a.y + a.radius && (b = !0, this.game.debug && console.log("over " + this.x + " " + this.y)), b
    }, Mouse.prototype.isOverPiece = function(a) {
        var b = new Array;
        b[0] = new Point2D(a.x - a.width / 2, a.y - a.height / 2), b[1] = new Point2D(a.x + a.width / 2, a.y - a.height / 2), b[2] = new Point2D(a.x + a.width / 2, a.y + a.height / 2), b[3] = new Point2D(a.x - a.width / 2, a.y + a.height / 2), pt = new Point2D(this.x, this.y);
        for (var c = !1, d = -1, e = b.length, f = e - 1; ++d < e; f = d)(b[d].y <= pt.y && pt.y < b[f].y || b[f].y <= pt.y && pt.y < b[d].y) && pt.x < (b[f].x - b[d].x) * (pt.y - b[d].y) / (b[f].y - b[d].y) + b[d].x && (c = !c);
        return c
    }, Mouse.prototype.isOverRect = function(a, b, c, d) {
        var e = new Array;
        e[0] = a, e[1] = b, e[2] = c, e[3] = d, pt = new Point2D(this.x, this.y);
        for (var f = !1, g = -1, h = e.length, i = h - 1; ++g < h; i = g)(e[g].y <= pt.y && pt.y < e[i].y || e[i].y <= pt.y && pt.y < e[g].y) && pt.x < (e[i].x - e[g].x) * (pt.y - e[g].y) / (e[i].y - e[g].y) + e[g].x && (f = !f);
        return f
    }, Mouse.prototype.mousemove = function(a) {
        body_scrollLeft = document.body.scrollLeft, element_scrollLeft = document.documentElement.scrollLeft, body_scrollTop = document.body.scrollTop, element_scrollTop = document.documentElement.scrollTop, offsetLeft = this.element.offsetLeft, offsetTop = this.element.offsetTop;
        var b, c;
        a.pageX || a.pageY ? (b = a.pageX, c = a.pageY) : (b = a.clientX + body_scrollLeft + element_scrollLeft, c = a.clientY + body_scrollTop + element_scrollTop), b /= this.game.scale, c /= this.game.scale, this.moving = !0, interv(), this.x = b, this.y = c, this.event = a, this.game.debug && console.log("move " + b)
    }, Mouse.prototype.mousedown = function(a) {
        this.down = !0, this.up = !1, this.event = a, this.game.over && (this.game.selected = this.game.over), this.game.debug && console.log("down")
    }, Mouse.prototype.mouseup = function(a) {
        a.preventDefault(), this.up = !0, this.down = !1, this.event = a, this.game.selected && this.game.selected.near() && !this.game.selected.placed ? (this.game.selected.x = this.game.selected.target.x, this.game.selected.y = this.game.selected.target.y, this.game.selected.placed = !0, this.game.selected.moveble = !1, this.game.placed_pieces.push(this.game.selected), 0 != this.game.drip.currentTime && (this.game.drip.currentTime = 0), this.game.drip.play()) : this.game.selected && !this.game.selected.near() && (this.game.selected.p = 0, this.game.selected.moveble = !1, this.game.selected.placed = !1, 0 != this.game.twang.currentTime && (this.game.twang.currentTime = 0), this.game.twang.play()), this.game.selected = null, this.game.debug && console.log("up")
    }, Mouse.prototype.touchstart = function(a) {
        this.game.drip.play(), a.preventDefault(), this.moving = !1, this.down = !0, this.up = !1, this.event = a, this.game.debug && console.log("touch start")
    }, Mouse.prototype.touchend = function(a) {
        this.game.debug && console.log("touchend"), a.preventDefault(), this.moving = !1, this.up = !0, this.down = !1, this.x = -1, this.y = -1, this.game.selected && this.game.selected.near() && !this.game.selected.placed ? (this.game.selected.x = this.game.selected.target.x, this.game.selected.y = this.game.selected.target.y, this.game.selected.placed = !0, this.game.selected.moveble = !1, this.game.placed_pieces.push(this.game.selected), 0 != this.game.drip.currentTime && (this.game.drip.currentTime = 0), this.game.drip.play()) : this.game.selected && !this.game.selected.near() && (this.game.selected.p = 0, this.game.selected.moveble = !1, this.game.selected.placed = !1, 0 != this.game.twang.currentTime && (this.game.twang.currentTime = 0), this.game.twang.play(), this.game.selected = null), this.game.selected = null
    }, Mouse.prototype.touchmove = function(a) {
        a.preventDefault(), body_scrollLeft = document.body.scrollLeft, element_scrollLeft = document.documentElement.scrollLeft, body_scrollTop = document.body.scrollTop, element_scrollTop = document.documentElement.scrollTop, offsetLeft = this.element.offsetLeft, offsetTop = this.element.offsetTop;
        var b, c, d = a.touches[0];
        d.pageX || d.pageY ? (b = d.pageX, c = d.pageY) : (b = d.clientX + body_scrollLeft + element_scrollLeft, c = d.clientY + body_scrollTop + element_scrollTop), b /= this.game.scale, c /= this.game.scale, this.moving = !0, this.x = b, this.y = c, this.event = a, this.game.over && (this.game.selected = this.game.over), this.game.debug && console.log("touchmove " + b)
    }, Point2D.prototype.clone = function() {
        return new Point2D(this.x, this.y)
    }, Point2D.prototype.add = function(a) {
        return new Point2D(this.x + a.x, this.y + a.y)
    }, Point2D.prototype.addEquals = function(a) {
        return this.x += a.x, this.y += a.y, this
    }, Point2D.prototype.offset = function(a, b) {
        var c = 0;
        if (!(b.x <= this.x || this.x + a.x <= 0)) {
            var d, e, f = b.x * a.y - a.x * b.y;
            f > 0 ? this.x < 0 ? (d = this.x * a.y, e = d / a.x - this.y) : this.x > 0 ? (d = this.x * b.y, e = d / b.x - this.y) : e = -this.y : b.x < this.x + a.x ? (d = (b.x - this.x) * a.y, e = b.y - (this.y + d / a.x)) : b.x > this.x + a.x ? (d = (a.x + this.x) * b.y, e = d / b.x - (this.y + a.y)) : e = b.y - (this.y + a.y), e > 0 && (c = e)
        }
        return c
    }, Point2D.prototype.rmoveto = function(a, b) {
        this.x += a, this.y += b
    }, Point2D.prototype.scalarAdd = function(a) {
        return new Point2D(this.x + a, this.y + a)
    }, Point2D.prototype.scalarAddEquals = function(a) {
        return this.x += a, this.y += a, this
    }, Point2D.prototype.subtract = function(a) {
        return new Point2D(this.x - a.x, this.y - a.y)
    }, Point2D.prototype.subtractEquals = function(a) {
        return this.x -= a.x, this.y -= a.y, this
    }, Point2D.prototype.scalarSubtract = function(a) {
        return new Point2D(this.x - a, this.y - a)
    }, Point2D.prototype.scalarSubtractEquals = function(a) {
        return this.x -= a, this.y -= a, this
    }, Point2D.prototype.multiply = function(a) {
        return new Point2D(this.x * a, this.y * a)
    }, Point2D.prototype.multiplyEquals = function(a) {
        return this.x *= a, this.y *= a, this
    }, Point2D.prototype.divide = function(a) {
        return new Point2D(this.x / a, this.y / a)
    }, Point2D.prototype.divideEquals = function(a) {
        return this.x /= a, this.y /= a, this
    }, Point2D.prototype.compare = function(a) {
        return this.x - a.x || this.y - a.y
    }, Point2D.prototype.eq = function(a) {
        return this.x == a.x && this.y == a.y
    }, Point2D.prototype.lt = function(a) {
        return this.x < a.x && this.y < a.y
    }, Point2D.prototype.lte = function(a) {
        return this.x <= a.x && this.y <= a.y
    }, Point2D.prototype.gt = function(a) {
        return this.x > a.x && this.y > a.y
    }, Point2D.prototype.gte = function(a) {
        return this.x >= a.x && this.y >= a.y
    }, Point2D.prototype.lerp = function(a, b) {
        return new Point2D(this.x + (a.x - this.x) * b, this.y + (a.y - this.y) * b)
    }, Point2D.prototype.distanceFrom = function(a) {
        var b = this.x - a.x,
            c = this.y - a.y;
        return Math.sqrt(b * b + c * c)
    }, Point2D.prototype.min = function(a) {
        return new Point2D(Math.min(this.x, a.x), Math.min(this.y, a.y))
    }, Point2D.prototype.max = function(a) {
        return new Point2D(Math.max(this.x, a.x), Math.max(this.y, a.y))
    }, Point2D.prototype.toString = function() {
        return this.x + "," + this.y
    }, Point2D.prototype.setXY = function(a, b) {
        this.x = a, this.y = b
    }, Point2D.prototype.setFromPoint = function(a) {
        this.x = a.x, this.y = a.y
    }, Point2D.prototype.swap = function(a) {
        var b = this.x,
            c = this.y;
        this.x = a.x, this.y = a.y, a.x = b, a.y = c
    }, Piece.prototype.draw = function() {
        this.moveble || this.placed ? (this.game.context.globalAlpha = this.placed ? 1 : this.game.is_over ? 1 : .8, this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)", this == this.game.selected ? this.game.context.fillStyle = "rgba(0, 0, 255, 0.1)" : this.game.over == this && (this.game.context.fillStyle = "rgba(255, 0, 0, 0.1)"), this.game.selected == this && this.near() && (this.game.context.fillStyle = "rgba(0, 255, 0, 0.1)", 1 != this.game.auto_snap || this.placed || (this.game.selected.x = this.game.selected.target.x, this.game.selected.y = this.game.selected.target.y, this.game.selected.placed = !0, this.game.selected.moveble = !1, this.game.placed_pieces.push(this.game.selected), 0 != this.game.drip.currentTime && (this.game.drip.currentTime = 0), this.game.drip.play())), this.game.context.drawImage(this.game.img, this.holder.column * this.game.piece_width, this.holder.line * this.game.piece_height, this.game.piece_width, this.game.piece_height, this.x - this.game.piece_width / 2, this.y - this.game.piece_height / 2, this.game.piece_width, this.game.piece_height), !this.game.is_over) : (this.game.context.globalAlpha = 1, this.p = 1.1 * this.p, this.startPoint.x = this.startPoint.x + this.p, this.startPoint.y = this.m * this.startPoint.x + this.b, (this.startPoint.x + this.width / 2 >= this.game.canvas.width / this.game.scale || this.startPoint.y + this.height / 2 >= this.game.canvas.height / this.game.scale || this.startPoint.x - this.width / 2 <= 0 || this.startPoint.y - this.height / 2 <= 60) && (this.moveble = !0, this.x = this.startPoint.x, this.y = this.startPoint.y, this.iniPoint = new Point2D(this.x, this.y)), this.game.context.drawImage(this.game.img, this.holder.column * this.game.piece_width, this.holder.line * this.game.piece_height, this.game.piece_width, this.game.piece_height, this.startPoint.x - this.game.piece_width / 2, this.startPoint.y - this.game.piece_height / 2, this.game.piece_width, this.game.piece_height)), this.game.debug && console.log("pieace: " + this.id + " drew")
    }, Piece.prototype.near = function() {
        var a = !1,
            b = this.x - this.target.x,
            c = this.y - this.target.y,
            d = b * b + c * c;
        return d <= this.tolerance && (a = !0), this.game.debug && console.log(this.id + ": " + d), a
    }, Piece.prototype.mouse_is_over = function() {
        return this.game.mouse.isOverPiece(this)
    }, Holder.prototype.draw = function() {
        this.game.context.lineWidth = 1, this.game.context.strokeRect(this.x - this.game.piece_width / 2, this.y - this.game.piece_height / 2, this.game.piece_width, this.game.piece_height)
    }, Game.prototype.loadAssets = function() {
        this.canvas = document.getElementById("canvas"), this.context = this.canvas.getContext("2d"), this.canvas_bg = document.getElementById("canvas_bg"), this.context_bg = this.canvas.getContext("2d"), document.getElementById("canvas").width = window.innerWidth, document.getElementById("canvas").height = window.innerHeight, document.getElementById("canvas_bg").width = window.innerWidth, document.getElementById("canvas_bg").height = window.innerHeight, document.getElementById("game").height = window.innerHeight, this.original_width = this.canvas.width, this.original_height = this.canvas.height, this.font_size = Math.round(this.canvas.width / 8), this.scaled_width = this.canvas.width / this.scale / 2, this.scaled_height = this.canvas.height / this.scale / 2, this.loaded_items = 0, this.loaded = !1, this.interval = null, this.maxElapsedTime = 0, this.start_time = 0, this.random_image = Math.floor(12 * Math.random()) + 1, this.random_image < 10 && (this.random_image = new String("0" + this.random_image)), this.random_image = new String("09"), this.drip = document.getElementById("audio-drip"), this.twang = document.getElementById("audio-twang"), this.bgm = document.getElementById("audio-bgm"), this.chimes = document.getElementById("chimes"), this.items_to_load = 1, this.loaded_items = 1, eval("this.img = document.getElementById('img" + this.random_image + "');"), this.w_rate = this.canvas.width / this.img.width, this.h_rate = this.canvas.height / this.img.height, this.w_scale = 1, this.h_scale = 1
    }, Game.prototype.apply_scale = function() {
        document.getElementById("canvas").width = window.innerWidth, document.getElementById("canvas").height = window.innerHeight, document.getElementById("canvas_bg").width = window.innerWidth, document.getElementById("canvas_bg").height = window.innerHeight, ws = document.getElementById("canvas").width / 1.5 / document.getElementById("img09").width, hs = document.getElementById("canvas").height / 1.5 / document.getElementById("img09").height, this.scale = Math.min(ws, hs), this.context.scale(this.scale, this.scale), this.resized = !1
    }, Game.prototype.init = function() {
        $("#game").css("height", window.innerHeight), this.loaded = !0, this.pieces = new Array, this.holders = new Array, this.placed_pieces = new Array, this.moving = !0, this.selected = null, this.over = null, this.is_over = !1, this.img_width = this.img.width, this.img_height = this.img.height, this.num_pieces = this.num_lines * this.num_lines, this.piece_width = this.img_width / this.num_lines, this.piece_height = this.img_height / this.num_lines, this.resized && this.apply_scale(), this.font_size = Math.round(this.canvas.width / 8), this.scaled_width = this.canvas.width / this.scale / 2, this.scaled_height = this.canvas.height / this.scale / 2, this.draw_bg(), this.remaining_time = this.num_pieces * (10 / this.stage), this.time_to_complete = this.remaining_time, this.clock_interval = null, this.mouse = new Mouse(this), this.auto_snap = !0, this.placeHolders(), this.placePieces()
    }, Game.prototype.placePieces = function() {
        for (i = 0; i < this.num_pieces; i++) x = Math.floor(Math.random() * this.scaled_width * 2), y = Math.floor(Math.random() * this.scaled_height * 2), temp = new Piece(i + 1, this, this.piece_width, this.piece_height, x, y, new Point2D(this.x, this.y), new Point2D(this.holders[i].x, this.holders[i].y), this.holders[i], !0, !1), this.pieces.push(temp);
        document.getElementById("audio-chimes").play()
    }, Game.prototype.placeHolders = function() {
        var a = 1,
            b = Math.round(this.scaled_width - this.img_width / 2),
            c = Math.round(this.scaled_height - this.img_height / 2);
        c += 26;
        for (var d = 0; d < this.num_lines; ++d)
            for (var e = 0; e < this.num_lines; ++e) temp = new Holder(a, this, e * this.piece_width + b + this.piece_width / 2, d * this.piece_height + c + this.piece_height / 2, d, e, !1), this.holders.push(temp), a++
    }, Game.prototype.render = function() {
        if (this.draw_bg(), this.loaded) {
            for (var a = 0; a < this.holders.length; a++) holder = this.holders[a], holder.draw();
            for (var b = new Array, c = !1, a = 0; a < this.pieces.length; a++) piece = this.pieces[a], !c && piece.mouse_is_over() && (c = !0), piece.placed ? piece != this.selected && piece.draw() : b.push(piece), this.selected || (!this.over || this.over.id < piece.id || piece.mouse_is_over()) && piece.mouse_is_over() && !piece.placed && (this.over = piece);
            for (var a = 0; a < b.length; a++) b[a].draw();
            this.selected && this.selected.draw(), c || (this.over = null), null != this.selected && this.selected.moveble && (this.selected.x = Math.round(this.mouse.x), this.selected.y = Math.round(this.mouse.y)), this.draw_remaining(), this.remaining_time <= 0 ? (this.remaining_time = 0, pauseGame(), confirm("Timeup! Try again") && (this.is_over = !1, this.init(), startGame())) : this.is_over ? (pauseGame(), $("#stage").html("Stage " + this.stage + " completed!"), $("#pieces").html(this.num_lines * this.num_lines + " pieces in " + (this.time_to_complete - this.remaining_time) + "s"), $("#modal-success").modal()) : this.num_pieces == this.placed_pieces.length && (this.is_over = !0)
        } else if (this.items_to_load > 0 && this.loaded_items == this.items_to_load) {
            this.items_to_load = 0;
            {
                setTimeout("game.init();", 1500)
            }
        } else this.draw_loading()
    }, Game.prototype.draw_bg = function() {
        this.scale || (this.scale = 1), this.context.fillStyle = "rgba(125, 125, 125, 1)", this.context_bg.fillRect(0, 0, this.canvas_bg.width / this.scale, this.canvas_bg.height / this.scale);
        var a = Math.round(this.scaled_width - this.img_width / 2),
            b = Math.round(this.scaled_height - this.img_height / 2);
        b += 26, this.context_bg.globalAlpha = .2, this.context_bg.drawImage(this.img, a, b, this.img_width, this.img_height)
    }, Game.prototype.draw_remaining = function() {
        this.fade1 = this.fade1 + .01 * this.alpha, this.fade1 >= .6 ? this.alpha = -1 : this.fade1 <= .2 && (this.alpha = 1), this.context.fillStyle = "rgba(255, 255, 255, " + this.fade1 + ")", this.context.strokeStyle = "rgba(0, 0, 0, 0.5)", this.context.lineWidth = 2, this.context.font = "bold " + this.font_size + "px Arial", this.context.textBaseline = "middle", this.context.textAlign = "center", this.context.fillText(parseInt(game.remaining_time), this.scaled_width, this.scaled_height)
    }, Game.prototype.draw_loading = function() {
        this.fade1 = this.fade1 + .025, this.fade1 >= 1 && (this.fade1 = 0), this.fade2 = 1 - this.fade1, this.context.fillStyle = "rgba(255, 255, 255, " + this.fade2 + ")", this.context.strokeStyle = "rgba(255, 255, 255, " + this.fade1 + ")", this.context.font = "bold " + this.font_size + "px Arial", this.context.textBaseline = "middle", this.context.textAlign = "center", this.context.lineWidth = 5, this.context.strokeText("LOADING", this.scaled_width, this.scaled_height), this.context.fillText("LOADING", this.scaled_width, this.scaled_height)
    }, Game.prototype.clockTick = function() {
        this.remaining_time--
    }, Game.prototype.getTimer = function() {
        return (new Date).getTime() - this.start_time
    }, Game.prototype.nextStage = function() {
        for (var r = this.random_image; r == this.random_image;) this.random_image = Math.floor(12 * Math.random()) + 1, this.random_image < 10 && (this.random_image = new String("0" + this.random_image));
        eval("this.img = document.getElementById('img" + this.random_image + "')"), this.is_over = !1, this.stage++, this.num_lines++, this.init(), startGame()
    },
    function() {
        for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
            var c = (new Date).getTime(),
                d = Math.max(0, 22 - (c - a)),
                e = window.setTimeout(function() {
                    b(c + d)
                }, d);
            return a = c + d, e
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
            clearTimeout(a)
        })
    }(), Modernizr.fullscreen;
var game = new Game,
    interval = null,
    gameInterval = null;
game.debug = !1, m = {
    game: game
}, interv = function() {
    interval = setTimeout("game.mouse.moving = false; document.getElementById('moving').value = false; intervClear();", 500)
}, intervClear = function() {
    clearInterval(interval)
}, stopGame = function() {
    clearInterval(gameInterval), game.started = !1, stopSFX(), stopBGM(), window.cancelAnimationFrame(game.interval), $("#home").addClass("active"), $("#play").show(), $(".control").hide(), $("#canvas, #canvas_bg").hide(), $(".content").show()
}, startGame = function() {
    clearInterval(gameInterval), gameInterval = setInterval(function() {
        game.remaining_time--
    }, 1e3), game.started = !0, startSFX(), startBGM(), loop(), $("#home").removeClass("active"), $("#canvas, .control, .abs").show(), $(".content, #play, #exitfullscreen, #bgm, #sfx, #autosnap").hide(), $(".container, .footer").hide(), $("#body").css("padding", "0px"), $("#body").css("margin", "0px")
}, pauseGame = function() {
    clearInterval(gameInterval), game.started = !1, window.cancelAnimationFrame(game.interval), $(".control").hide(), $("#play").show(), $("#btn-play").show()
}, stopSFX = function() {
    game.drip.volume = 0, game.twang.volume = 0, game.drip.pause(), game.twang.pause(), $("#sfxoff").hide(), $("#sfx").show()
}, startSFX = function() {
    game.drip.volume = 1, game.twang.volume = 1, $("#sfxoff").show(), $("#sfx").hide()
}, stopBGM = function() {
    game.bgm.volume = 0, game.bgm.pause(), $("#bgmoff").hide(), $("#bgm").show()
}, startBGM = function() {
    game.bgm.volume = 1, game.bgm.play(), $("#bgmoff").show(), $("#bgm").hide()
}, autoSnap = function() {
    game.auto_snap = !0, $("#autosnapoff").show(), $("#autosnap").hide()
}, autoSnapOff = function() {
    game.auto_snap = !1, $("#autosnapoff").hide(), $("#autosnap").show()
}, fullscreen = function() {
    RunPrefixMethod(game.canvas, "RequestFullScreen")
}, exitfullscreen = function() {
    RunPrefixMethod(document, "CancelFullScreen")
}, window.addEventListener("resize", resizeGame, !1), window.addEventListener("orientationchange", resizeGame, !1), $(function() {
    $(".popover-test").popover(), $("#next").click(function() {
        game.nextStage(), $("#modal-success").modal("hide")
    }), $("#play, #btn-play, #play-btn-lg").click(function() {
        start()
    }), $("#btn-pause").click(function() {
        pause()
    }), $("#btn-fullscreen").click(function() {
        fullscreen()
    }), $("#btn-exitfullscreen").click(function() {
        exitfullscreen()
    }), $("#btn-bmg-on").click(function() {
        startBGM()
    }), $("#btn-bmg-off").click(function() {
        stopBGM()
    }), $("#btn-sfx-on").click(function() {
        startSFX()
    }), $("#btn-sfx-off").click(function() {
        stopSFX()
    }), $("#btn-autosnap-on").click(function() {
        autoSnap()
    }), $("#btn-autosnap-off").click(function() {
        autoSnapOff()
    }), $("#play-top").click(function() {
        start()
    }), $("#btn-home").click(function() {
        self.location.href = "./index.html"
    }), $("#modal-success").removeClass("show")
});
// Khởi tạo một mảng để lưu điểm số
let scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];

// Hàm lưu điểm
function saveScore(score) {
    scoreHistory.push(score);
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
}

// Hàm hiển thị lịch sử điểm số
function showScoreHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Xóa danh sách cũ
    scoreHistory.forEach((score, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `Lần chơi ${index + 1}: ${score} điểm`;
        historyList.appendChild(li);
    });
}

// Thêm sự kiện cho nút "Lịch sử chơi"
document.getElementById('history-btn').addEventListener('click', () => {
    showScoreHistory();
    $('#modal-history').modal('show'); // Hiển thị modal lịch sử
});

// Khởi tạo các biến toàn cục cho trạng thái trò chơi
let piecesArray = []; // Mảng chứa trạng thái của các mảnh ghép
let currentScore = 0; // Điểm số hiện tại
let currentLevel = 1; // Cấp độ hiện tại

// Hàm lấy trạng thái của các mảnh ghép
function getPiecesState() {
    return piecesArray;
}

// Hàm lấy điểm số hiện tại
function getCurrentScore() {
    return currentScore;
}

// Hàm lấy cấp độ hiện tại
function getCurrentLevel() {
    return currentLevel;
}

// Hàm lưu trạng thái trò chơi
function saveGame() {
    const gameState = {
        pieces: piecesArray.map(piece => ({
            id: piece.id,
            x: piece.x,
            y: piece.y,
            placed: piece.placed // Lưu trạng thái đã được đặt
        })),
        score: currentScore, // Lưu điểm số hiện tại
        level: currentLevel // Lưu cấp độ hiện tại
    };
    localStorage.setItem('savedGameState', JSON.stringify(gameState)); // Lưu vào Local Storage
    alert('Trò chơi đã được lưu!'); // Thông báo cho người dùng
}

// Hàm khôi phục trạng thái trò chơi
// Hàm khôi phục trạng thái trò chơi
function loadGameState() {
    const savedGameState = localStorage.getItem('savedGameState'); // Lấy dữ liệu từ Local Storage
    if (savedGameState) {
        const gameState = JSON.parse(savedGameState); // Chuyển đổi chuỗi JSON thành đối tượng
        
        // Khôi phục trạng thái các mảnh ghép
        piecesArray = gameState.pieces.map(pieceData => {
            const piece = new Piece(pieceData.id, game, pieceWidth, pieceHeight, pieceData.x, pieceData.y, targetPoint, holderPoint, holder, pieceData.moveble, pieceData.placed);
            piece.placed = pieceData.placed; // Đặt trạng thái đã được đặt
            return piece;
        });

        currentScore = gameState.score; // Khôi phục điểm số
        currentLevel = gameState.level; // Khôi phục cấp độ

        // Cập nhật giao diện người dùng
        document.getElementById('score-display').textContent = `Điểm: ${currentScore}`;
        document.getElementById('level-display').textContent = `Cấp độ: ${currentLevel}`;
        // Gán sự kiện cho nút "Lưu Trò Chơi"
document.getElementById('save-btn').addEventListener('click', saveGame);

// Gán sự kiện cho nút "Tiếp tục chơi"
document.getElementById('continue-btn').addEventListener('click', loadGameState);
        renderPieces(); // Vẽ lại các mảnh ghép trên giao diện
        alert('Trò chơi đã được khôi phục!'); // Thông báo cho người dùng
    } else {
        alert('Không có trò chơi nào được lưu!'); // Thông báo nếu không có dữ liệu lưu
    }
}
// Hàm để vẽ lại các mảnh ghép trên giao diện
function renderPieces() {
    piecesArray.forEach(piece => {
        drawPiece(piece); // Giả định bạn có một hàm để vẽ từng mảnh ghép
    });
}

// Hàm để vẽ từng mảnh ghép
function drawPiece(piece) {
    // Thêm mã để vẽ mảnh ghép lên giao diện
    // Ví dụ: sử dụng canvas hoặc DOM để hiển thị mảnh ghép
}

// Hàm để đặt lại trạng thái của các mảnh ghép
function setPiecesState(pieces) {
    piecesArray = pieces; // Cập nhật mảng chứa thông tin về các mảnh ghép
}

// Hàm để đặt lại điểm số
function setCurrentScore(score) {
    currentScore = score; // Cập nhật điểm số hiện tại
    document.getElementById('score-display').textContent = `Điểm: ${currentScore}`; // Cập nhật giao diện
}

// Hàm để đặt lại cấp độ
function setCurrentLevel(level) {
    currentLevel = level; // Cập nhật cấp độ hiện tại
    document.getElementById('level-display').textContent = `Cấp độ: ${currentLevel}`; // Cập nhật giao diện
}

// Hàm để vẽ lại các mảnh ghép trên giao diện
function renderPieces() {
    // Logic để vẽ lại các mảnh ghép dựa trên trạng thái hiện tại
    piecesArray.forEach(piece => {
        drawPiece(piece); // Giả định bạn có một hàm để vẽ từng mảnh ghép
    });
}

// Hàm để vẽ từng mảnh ghép
function drawPiece(piece) {
    // Thêm mã để vẽ mảnh ghép lên giao diện
}

// Thêm sự kiện cho nút "Lưu Trò Chơi"
document.getElementById('save-btn').addEventListener('click', saveGame);

// Thêm sự kiện cho nút "Tiếp tục chơi"
document.getElementById('continue-btn').addEventListener('click', () => {
    const savedGameState = localStorage.getItem('savedGameState');
    if (savedGameState) {
        const gameState = JSON.parse(savedGameState);
        loadGameState(gameState);
        alert('Trò chơi đã được khôi phục!');
    } else {
        alert('Không có trò chơi nào được lưu!');
    }
});

// Hàm tính điểm
function calculateScore(piecesCompleted, timeTaken) {
    const pointsPerPiece = 10; // Điểm cho mỗi mảnh ghép
    const timePenalty = 1; // Điểm bị trừ cho mỗi giây

    // Tính điểm cơ bản
    let score = piecesCompleted * pointsPerPiece;

    // Trừ điểm theo thời gian
    score -= timeTaken * timePenalty;

    // Thưởng nếu hoàn thành dưới 30 giây
    if (timeTaken < 30) {
        score += 20;
    }

    // Đảm bảo điểm không âm
    return Math.max(score, 0);
}

// Hàm tính điểm
function calculateScore(piecesCompleted, timeTaken) {
    const pointsPerPiece = 10; // Điểm cho mỗi mảnh ghép
    const timePenalty = 1; // Điểm bị trừ cho mỗi giây

    // Tính điểm cơ bản
    let score = piecesCompleted * pointsPerPiece;

    // Trừ điểm theo thời gian
    score -= timeTaken * timePenalty;

    // Thưởng nếu hoàn thành dưới 30 giây
    if (timeTaken < 30) {
        score += 20;
    }

    // Đảm bảo điểm không âm
    return Math.max(score, 0);
}

// Hàm tính điểm
function calculateScore(piecesCompleted, timeTaken) {
    const pointsPerPiece = 10; // Điểm cho mỗi mảnh ghép
    const timePenalty = 1; // Điểm bị trừ cho mỗi giây

    // Tính điểm cơ bản
    let score = piecesCompleted * pointsPerPiece;

    // Trừ điểm theo thời gian
    score -= timeTaken * timePenalty;

    // Thưởng nếu hoàn thành dưới 30 giây
    if (timeTaken < 30) {
        score += 20;
    }

    // Đảm bảo điểm không âm
    return Math.max(score, 0);
}

// Khi người chơi hoàn thành một cấp độ
document.getElementById('next').addEventListener('click', () => {
    // Lấy số mảnh ghép và thời gian từ modal
    const piecesText = document.getElementById('pieces').textContent; // Lấy nội dung
    const timeText = piecesText.match(/(\d+) pieces in (\d+)s/); // Regex để lấy số mảnh ghép và thời gian

    if (timeText) {
        const piecesCompleted = parseInt(timeText[1]); // Số mảnh ghép đã hoàn thành
        const timeTaken = parseInt(timeText[2]); // Thời gian đã sử dụng

        // Tính điểm
        const score = calculateScore(piecesCompleted, timeTaken);
        
        // Lưu điểm
        saveScore(score);
        alert(`Bạn đã hoàn thành! Điểm: ${score}`);
    } else {
        alert('Không thể lấy thông tin số mảnh ghép và thời gian.');
    }
});

// Khởi tạo một mảng để lưu điểm số
let scoreHistorys = JSON.parse(localStorage.getItem('scoreHistory')) || [];

// Hàm lưu điểm
function saveScore(score) {
    scoreHistory.push(score);
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
}
