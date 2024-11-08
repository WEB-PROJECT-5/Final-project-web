function Game(canvas) {
  this.started = false; // Trạng thái trò chơi
  this.stage = 1; // Giai đoạn hiện tại
  this.num_lines = 2; // Số dòng
  this.scale = 1; // Tỉ lệ
  this.alpha = 1; // Độ trong suốt
  this.fade1 = 0; // Biến fade 1
  this.fade2 = 0; // Biến fade 2
  this.resized = true; // Trạng thái đã thay đổi kích thước

  this.loadAssets(); // Tải tài nguyên
}

Game.prototype.loadAssets = function() {
  this.canvas = document.getElementById('canvas'); // Lấy canvas chính
  this.context = this.canvas.getContext('2d'); // Lấy ngữ cảnh 2D của canvas
  this.canvas_bg = document.getElementById('canvas_bg'); // Lấy canvas nền
  this.context_bg = this.canvas_bg.getContext('2d'); // Lấy ngữ cảnh 2D của canvas nền
  
  // Thiết lập kích thước cho canvas
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  document.getElementById('canvas_bg').width = window.innerWidth;
  document.getElementById('canvas_bg').height = window.innerHeight;
  
  document.getElementById('game').height = window.innerHeight;

  this.original_width = this.canvas.width; // Lưu chiều rộng gốc
  this.original_height = this.canvas.height; // Lưu chiều cao gốc
  this.font_size = Math.round(this.canvas.width / 8); // Kích thước font
  this.scaled_width = (this.canvas.width / this.scale) / 2; // Chiều rộng đã scale
  this.scaled_height = (this.canvas.height / this.scale) / 2; // Chiều cao đã scale

  this.loaded_items = 0; // Số tài nguyên đã tải
  this.loaded = false; // Trạng thái đã tải
  this.interval = null; // Khoảng thời gian
  this.maxElapsedTime = 0; // Thời gian tối đa đã trôi qua
  this.start_time = 0; // Thời gian bắt đầu
  
  this.random_image = Math.floor(Math.random() * 12) + 1; // Chọn ngẫu nhiên hình ảnh
  if (this.random_image < 10)
    this.random_image = new String("0" + this.random_image);
    
  this.random_image = new String("09"); // Gán hình ảnh mặc định
  
  // Lấy các âm thanh
  this.drip = document.getElementById("audio-drip");
  this.twang = document.getElementById("audio-twang");
  this.bgm = document.getElementById("audio-bgm");
  this.chimes = document.getElementById("chimes");

  this.items_to_load = 1; // Số tài nguyên cần tải
  this.loaded_items = 1; // Số tài nguyên đã tải

  eval("this.img = document.getElementById('img" + this.random_image + "');"); // Lấy hình ảnh

  this.w_rate = this.canvas.width / this.img.width; // Tỉ lệ chiều rộng
  this.h_rate = this.canvas.height / this.img.height; // Tỉ lệ chiều cao
  this.w_scale = 1; // Tỉ lệ chiều rộng
  this.h_scale = 1; // Tỉ lệ chiều cao
};

Game.prototype.apply_scale = function() {
  // Cập nhật kích thước canvas
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  document.getElementById('canvas_bg').width = window.innerWidth;
  document.getElementById('canvas_bg').height = window.innerHeight;

  // Tính toán tỉ lệ
  ws = (document.getElementById('canvas').width / 1.5) / document.getElementById('img09').width;
  hs = (document.getElementById('canvas').height / 1.5) / document.getElementById('img09').height;
  this.scale = Math.min(ws, hs); // Chọn tỉ lệ nhỏ nhất

  this.context.scale(this.scale, this.scale); // Áp dụng tỉ lệ
  this.resized = false; // Đánh dấu đã thay đổi kích thước
};

Game.prototype.init = function() {
  $("#game").css('height', window.innerHeight ); // Thiết lập chiều cao cho game
  
  this.loaded = true; // Đánh dấu đã tải
  this.pieces = new Array(); // Mảng chứa các mảnh ghép
  this.holders = new Array(); // Mảng chứa các vị trí giữ
  this.placed_pieces = new Array(); // Mảng chứa các mảnh đã được đặt
  this.moving = true; // Trạng thái di chuyển
  this.selected = null; // Mảnh được chọn
  this.over = null; // Mảnh đang ở trên
  this.is_over = false; // Trạng thái trò chơi kết thúc

  this.img_width = this.img.width; // Chiều rộng hình ảnh
  this.img_height = this.img.height; // Chiều cao hình ảnh
  
  this.num_pieces = this.num_lines * this.num_lines; // Tổng số mảnh
  this.piece_width = this.img_width / this.num_lines; // Chiều rộng mỗi mảnh
  this.piece_height = this.img_height / this.num_lines; // Chiều cao mỗi mảnh

  if (this.resized)
    this.apply_scale(); // Áp dụng tỉ lệ nếu đã thay đổi kích thước

  this.font_size = Math.round(this.canvas.width / 8); // Cập nhật kích thước font
  this.scaled_width = (this.canvas.width / this.scale) / 2; // Cập nhật chiều rộng đã scale
  this.scaled_height = (this.canvas.height / this.scale) / 2; // Cập nhật chiều cao đã scale

  this.draw_bg(); // Vẽ nền

  this.remaining_time = this.num_pieces * (10 / this.stage); // Thời gian còn lại
  this.time_to_complete = this.remaining_time; // Thời gian để hoàn thành
  this.clock_interval = null; // Khoảng thời gian đồng hồ
  this.mouse = new Mouse(this); // Khởi tạo đối tượng chuột

  this.auto_snap = true; // Tự động gắn kết

  this.placeHolders(); // Đặt các vị trí giữ
  this.placePieces(); // Đặt các mảnh ghép
};

Game.prototype.placePieces = function() {
  for (i = 0; i < this.num_pieces; i++) {
    x = Math.floor(Math.random() * this.scaled_width * 2); // Tọa độ x ngẫu nhiên
    y = Math.floor(Math.random() * this.scaled_height * 2); // Tọa độ y ngẫu nhiên
    temp = new Piece(
      i + 1,
      this,
      this.piece_width,
      this.piece_height,
      x,
      y,
      new Point2D(this.x, this.y),
      new Point2D(this.holders[i].x, this.holders[i].y),
      this.holders[i],
      true,
      false
    );
    this.pieces.push(temp); // Thêm mảnh vào mảng
  }
  document.getElementById('audio-chimes').play(); // Phát âm thanh
};

Game.prototype.placeHolders = function() {
  var pieces = 1; // Biến đếm mảnh
  var offsetx = Math.round(this.scaled_width - (this.img_width) / 2); // Tính toán offset x
  var offsety = Math.round(this.scaled_height - (this.img_height) / 2); // Tính toán offset y
  offsety += 26; // Điều chỉnh offset y
  for (var i = 0; i < this.num_lines; ++i) {
    for (var j = 0; j < this.num_lines; ++j) {
      temp = new Holder(
        pieces,
        this,
        j * this.piece_width + offsetx + this.piece_width / 2,
        i * this.piece_height + offsety + this.piece_height / 2,
        i,
        j,
        false
      );
      this.holders.push(temp); // Thêm vị trí giữ vào mảng
      pieces++; // Tăng biến đếm
    }
  }
};

Game.prototype.render = function() {
  this.draw_bg(); // Vẽ nền

  if (!this.loaded) {
    if ((this.items_to_load > 0) && (this.loaded_items == this.items_to_load)) {
      this.items_to_load = 0; // Đánh dấu đã tải xong
      var t = setTimeout("game.init();", 1500); // Khởi tạo trò chơi sau 1.5 giây
    } else {
      this.draw_loading(); // Vẽ màn hình loading
    }
  } else {
    for (var i = 0; i < this.holders.length; i++) {
      holder = this.holders[i];
      holder.draw(); // Vẽ các vị trí giữ
    }

    var not_placed = new Array(); // Mảng chứa các mảnh chưa được đặt
    var over = false; // Biến kiểm tra mảnh đang ở trên
    for (var i = 0; i < this.pieces.length; i++) {
      piece = this.pieces[i];
      if (!over && piece.mouse_is_over())
        over = true; // Kiểm tra nếu chuột đang ở trên mảnh
      if (!piece.placed)
        not_placed.push(piece); // Thêm mảnh chưa được đặt vào mảng
      else if (piece != this.selected)
        piece.draw(); // Vẽ mảnh đã được đặt
        
      if (!this.selected) {
        if ((!this.over) || (this.over.id < piece.id) || (piece.mouse_is_over())) {
          if (piece.mouse_is_over() && !piece.placed) {
            this.over = piece; // Cập nhật mảnh đang ở trên
          }
        }
      }
    }
    for (var i = 0; i < not_placed.length; i++) {
      not_placed[i].draw(); // Vẽ các mảnh chưa được đặt
    }
    if (this.selected)
      this.selected.draw(); // Vẽ mảnh được chọn

    if (!over)
      this.over = null; // Đặt lại mảnh đang ở trên nếu không có

    if ((this.selected != null) && (this.selected.moveble)) {
      this.selected.x = Math.round(this.mouse.x); // Cập nhật tọa độ x của mảnh được chọn
      this.selected.y = Math.round(this.mouse.y); // Cập nhật tọa độ y của mảnh được chọn
    }

    this.draw_remaining(); // Vẽ thời gian còn lại

    if (this.remaining_time <= 0) {
      this.remaining_time = 0; // Đặt thời gian còn lại về 0
      pauseGame(); // Tạm dừng trò chơi
      if (confirm('Hết thời gian! Thử lại?')) {
        this.is_over = false; // Đánh dấu trò chơi chưa kết thúc
        this.init(); // Khởi tạo lại trò chơi
        startGame(); // Bắt đầu trò chơi
      }
    } else {
      if (this.is_over) {
        pauseGame(); // Tạm dừng trò chơi
        $('#stage').html("Giai đoạn " + this.stage + " đã hoàn thành!"); // Hiển thị thông báo hoàn thành
        $('#pieces').html(this.num_lines * this.num_lines + " mảnh trong " + (this.time_to_complete - this.remaining_time) + " giây"); // Hiển thị thông tin về số mảnh và thời gian
        $('#modal-success').modal(); // Hiển thị modal thành công
      } else {
        if (this.num_pieces == this.placed_pieces.length) {
          this.is_over = true; // Đánh dấu trò chơi đã hoàn thành
        }
      }
    }
  }
};

Game.prototype.draw_bg = function() {
  if (!this.scale) this.scale = 1; // Đảm bảo tỉ lệ không bằng 0
  this.context.fillStyle = "rgba(125, 125, 125, 1)"; // Màu nền
  this.context_bg.fillRect(0, 0, this.canvas_bg.width / this.scale, this.canvas_bg.height / this.scale); // Vẽ hình chữ nhật nền
  var offsetx = Math.round(this.scaled_width - (this.img_width) / 2); // Tính toán offset x
  var offsety = Math.round(this.scaled_height - (this.img_height) / 2); // Tính toán offset y
  offsety += 26; // Điều chỉnh offset y
  this.context_bg.globalAlpha = 0.2; // Đặt độ trong suốt
  this.context_bg.drawImage(this.img, offsetx, offsety, this.img_width, this.img_height); // Vẽ hình ảnh nền
};

Game.prototype.draw_remaining = function() {
  this.fade1 = this.fade1 + (0.010 * this.alpha); // Cập nhật biến fade1
  if (this.fade1 >= 0.6)
    this.alpha = -1; // Đảo ngược độ trong suốt
  else if (this.fade1 <= 0.2)
    this.alpha = 1; // Đảo ngược độ trong suốt
  this.context.fillStyle = "rgba(255, 255, 255, " + this.fade1 + ")"; // Màu chữ với độ trong suốt
  this.context.strokeStyle = "rgba(0, 0, 0, 0.5)"; // Màu viền
  this.context.lineWidth = 2; // Độ dày viền
  this.context.font = "bold " + this.font_size + "px Arial"; // Thiết lập font chữ
  this.context.textBaseline = 'middle'; // Căn chỉnh chữ theo chiều dọc
  this.context.textAlign = 'center'; // Căn chỉnh chữ theo chiều ngang
  this.context.fillText(parseInt(game.remaining_time), this.scaled_width, this.scaled_height); // Vẽ thời gian còn lại
};

Game.prototype.draw_loading = function() {
  this.fade1 = this.fade1 + 0.025; // Cập nhật biến fade1
  if (this.fade1 >= 1)
    this.fade1 = 0; // Đặt lại biến fade1
  this.fade2 = 1 - this.fade1; // Cập nhật biến fade2

  this.context.fillStyle = "rgba(255, 255, 255, " + this.fade2 + ")"; // Màu chữ với độ trong suốt
  this.context.strokeStyle = "rgba(255, 255, 255, " + this.fade1 + ")"; // Màu viền với độ trong suốt
  this.context.font = "bold " + this.font_size + "px Arial"; // Thiết lập font chữ
  this.context.textBaseline = 'middle'; // Căn chỉnh chữ theo chiều dọc
  this.context.textAlign = 'center'; // Căn chỉnh chữ theo chiều ngang
  this.context.lineWidth = 5; // Độ dày viền
  this.context.strokeText("ĐANG TẢI", this.scaled_width, this.scaled_height); // Vẽ chữ "ĐANG TẢI" với viền
  this.context.fillText("ĐANG TẢI", this.scaled_width, this.scaled_height); // Vẽ chữ "ĐANG TẢI"
};

Game.prototype.clockTick = function() {
  this.remaining_time--; // Giảm thời gian còn lại
};

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); // Trả về thời gian đã trôi qua tính bằng mili giây
};

Game.prototype.nextStage = function() {
  var r = this.random_image; // Lưu hình ảnh ngẫu nhiên
  while (r == this.random_image) {
    this.random_image = Math.floor(Math.random() * 12) + 1; // Chọn hình ảnh ngẫu nhiên mới
    if (this.random_image < 10)
      this.random_image = new String("0" + this.random_image); // Đảm bảo định dạng
  }
  
  eval("this.img = document.getElementById('img" + this.random_image + "')"); // Lấy hình ảnh mới
  
  this.is_over = false; // Đánh dấu trò chơi chưa kết thúc
  this.stage++; // Tăng giai đoạn
  this.num_lines++; // Tăng số dòng
  this.init(); // Khởi tạo lại trò chơi
  startGame(); // Bắt đầu trò chơi
};