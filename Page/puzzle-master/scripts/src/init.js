( function() {
  var lastTime = 0; // Thời gian cuối cùng
  var vendors = ['ms', 'moz', 'webkit', 'o']; // Các tiền tố trình duyệt
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']; // Thiết lập requestAnimationFrame
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']; // Thiết lập cancelAnimationFrame
  }
  if(!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime(); // Thời gian hiện tại
      var timeToCall = Math.max(0, 22 - (currTime - lastTime)); // Tính toán thời gian gọi
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall); // Gọi callback sau thời gian đã tính toán
      lastTime = currTime + timeToCall; // Cập nhật thời gian cuối cùng
      return id; // Trả về id
    };
  }
  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id); // Hủy bỏ timeout
    };
  }
}());

if(Modernizr.fullscreen){
  function RunPrefixMethod(obj, method) {
    var pfx = ["webkit", "moz", "ms", "o", ""]; // Các tiền tố trình duyệt
    var p = 0, m, t;
    while (p < pfx.length && !obj[m]) {
      m = method; // Phương thức hiện tại
      if (pfx[p] == "") {
        m = m.substr(0,1).toLowerCase() + m.substr(1); // Chuyển đổi tên phương thức về chữ thường
      }
      m = pfx[p] + m; // Thêm tiền tố vào phương thức
      t = typeof obj[m]; // Kiểm tra kiểu dữ liệu
      if (t != "undefined") {
        pfx = [pfx[p]]; // Chỉ giữ lại tiền tố hiện tại
        return (t == "function" ? obj[m]() : obj[m]); // Gọi phương thức hoặc trả về thuộc tính
      }
      p++;
    }
  }
}

var game = new Game(); // Khởi tạo trò chơi
var interval = null; // Biến lưu interval
var gameInterval = null; // Biến lưu game interval
game.debug = false; // Chế độ debug
m = {
  game : game // Đối tượng game
};

interv = function() {
  interval = setTimeout("game.mouse.moving = false; document.getElementById('moving').value = false; intervClear();", 500); // Thiết lập timeout để dừng di chuyển chuột
};
intervClear = function() {
  clearInterval(interval); // Xóa interval
};

stopGame = function() {
  clearInterval(gameInterval); // Dừng game interval
  
  game.started = false; // Đánh dấu trò chơi đã dừng
  stopSFX(); // Dừng âm thanh hiệu ứng
  stopBGM(); // Dừng nhạc nền
  window.cancelAnimationFrame(game.interval); // Hủy bỏ animation frame

  $('#home').addClass('active'); // Đánh dấu home là active

  $('#play').show(); // Hiện nút play
  $('.control').hide(); // Ẩn điều khiển
  $('#canvas, #canvas_bg').hide(); // Ẩn canvas
  $('.content').show(); // Hiện nội dung
};

startGame = function() {
  clearInterval(gameInterval); // Dừng game interval
  gameInterval = setInterval(function() { game.remaining_time--; }, 1000); // Thiết lập interval để giảm thời gian còn lại
  game.started = true; // Đánh dấu trò chơi đã bắt đầu
  startSFX(); // Bắt đầu âm thanh hiệu ứng
  startBGM(); // Bắt đầu nhạc nền
  loop(); // Bắt đầu vòng lặp
  $('#home').removeClass('active'); // Bỏ đánh dấu home là active
  $('#canvas, .control, .abs').show(); // Hiện canvas và điều khiển
  $('.content, #play, #exitfullscreen, #bgm, #sfx, #autosnap').hide(); // Ẩn các nội dung khác
  $('.container, .footer').hide(); // Ẩn container và footer
  $('#body').css('padding', '0px'); // Đặt padding cho body
  $('#body').css('margin', '0px'); // Đặt margin cho body
};

pauseGame = function() {
  clearInterval(gameInterval); // Dừng game interval
  game.started = false; // Đánh dấu trò chơi đã tạm dừng
  window.cancelAnimationFrame(game.interval); // Hủy bỏ animation frame

  $('.control').hide(); // Ẩn điều khiển  
  $('#play').show(); // Hiện nút play
  $('#btn-play').show(); // Hiện nút play
};

stopSFX = function() {
  game.drip.volume = 0.0; // Đặt âm lượng âm thanh hiệu ứng về 0
  game.twang.volume = 0.0; // Đặt âm lượng âm thanh hiệu ứng về 0
  game.drip.pause(); // Dừng âm thanh hiệu ứng
  game.twang.pause(); // Dừng âm thanh hiệu ứng
  $('#sfxoff').hide(); // Ẩn nút tắt âm thanh hiệu ứng
  $('#sfx').show(); // Hiện nút bật âm thanh hiệu ứng
};

startSFX = function() {
  game.drip.volume = 1.0; // Đặt âm lượng âm thanh hiệu ứng về 1
  game.twang.volume = 1.0; // Đặt âm lượng âm thanh hiệu ứng về 1
  $('#sfxoff').show(); // Hiện nút tắt âm thanh hiệu ứng
  $('#sfx').hide(); // Ẩn nút bật âm thanh hiệu ứng
};

stopBGM = function() {
  game.bgm.volume = 0.0; // Đặt âm lượng nhạc nền về 0
  game.bgm.pause(); // Dừng nhạc nền
  $('#bgmoff').hide(); // Ẩn nút tắt nhạc nền
  $('#bgm').show(); // Hiện nút bật nhạc nền
};

startBGM = function() {
  game.bgm.volume = 1.0; // Đặt âm lượng nhạc nền về 1
  game.bgm.play(); // Bắt đầu phát nhạc nền
  $('#bgmoff').show(); // Hiện nút tắt nhạc nền
  $('#bgm').hide(); // Ẩn nút bật nhạc nền
};

fullscreen = function() {
  RunPrefixMethod(game.canvas, "RequestFullScreen"); // Yêu cầu chế độ toàn màn hình
};

exitfullscreen = function() {
  RunPrefixMethod(document, 'CancelFullScreen'); // Hủy chế độ toàn màn hình
};

function start() {
  startGame(); // Bắt đầu trò chơi
}
function stop() {
  stopGame(); // Dừng trò chơi
}
function pause() {
  pauseGame(); // Tạm dừng trò chơi
}

function loop() {
  game.interval = window.requestAnimationFrame(loop, game.canvas); // Thiết lập vòng lặp

  game.render(); // Vẽ trò chơi

  var elapsed = game.getTimer() - game.time; // Tính toán thời gian đã trôi qua
  game.time = game.getTimer(); // Cập nhật thời gian
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed; // Cập nhật thời gian tối đa đã trôi qua
}

function loadAssets(g, assets) {
  for(i = 0; i < assets.length; i++) {
    if(assets[i].type == "image") {
      eval("g." + assets[i].slug + ' = new Image();'); // Tạo đối tượng hình ảnh
      eval("g." + assets[i].slug + '.src = "' + assets[i].src + '";'); // Thiết lập nguồn hình ảnh
      eval("g." + assets[i].slug + '.onload = g.loaded_items++;'); // Tăng số tài nguyên đã tải
    }
    else if(assets[i].type == "audio") {
      eval("g." + assets[i].slug + ' = document.createElement(\'audio\');'); // Tạo đối tượng âm thanh
      eval("g." + assets[i].slug + '.addEventListener(\'canplaythrough\', itemLoaded(g), false);'); // Thêm sự kiện cho âm thanh
      var source = document.createElement('source'); // Tạo phần tử nguồn
      if(Modernizr.audio.ogg) {
        source.type = 'audio/ogg'; // Đặt loại âm thanh
        source.src = assets[i].src + '.ogg'; // Thiết lập nguồn âm thanh
      }
      else if(Modernizr.audio.mp3 ) {
        source.type = 'audio/mpeg'; // Đặt loại âm thanh
        source.src = assets[i].src + '.mp3'; // Thiết lập nguồn âm thanh
      }
      if(source.src != "") {
        eval("g." + assets[i].slug + '.appendChild(source);'); // Thêm nguồn vào âm thanh
      }
      else {
        g.itens_to_load--; // Giảm số tài nguyên cần tải
      }
    }
  }
}

function itemLoaded(g) {
  g.loaded_items++; // Tăng số tài nguyên đã tải
}

function resizeGame() {  
  game.apply_scale(); // Áp dụng tỉ lệ
  if(game.started)
    game.init(); // Khởi tạo lại trò chơi nếu đã bắt đầu
}
window.addEventListener('resize', resizeGame, false); // Thêm sự kiện thay đổi kích thước
window.addEventListener('orientationchange', resizeGame, false); // Thêm sự kiện thay đổi hướng

$(function() {  
  $(".popover-test").popover(); // Khởi tạo popover

  $("#next").click(function() {
    game.nextStage(); // Chuyển sang giai đoạn tiếp theo
    $('#modal-success').modal('hide'); // Ẩn modal thành công
  });

  $("#play, #btn-play, #play-btn-lg").click(function() {
    start(); // Bắt đầu trò chơi
  });

  $("#btn-pause").click(function() {
    pause(); // Tạm dừng trò chơi
  });

  $("#btn-fullscreen").click(function() {
    fullscreen(); // Bật chế độ toàn màn hình
  });

  $("#btn-exitfullscreen").click(function() {
    exitfullscreen(); // Hủy chế độ toàn màn hình
  });

  $("#btn-bmg-on").click(function() {
    startBGM(); // Bật nhạc nền
  });

  $("#btn-bmg-off").click(function() {
    stopBGM(); // Tắt nhạc nền
  });

  $("#play-top").click(function() {
    start(); // Bắt đầu trò chơi
  });

  $("#btn-home").click(function() {
    self.location.href = "./index.html"; // Quay về trang chính
  });

  $("#modal-success").removeClass('show'); // Ẩn modal thành công
});