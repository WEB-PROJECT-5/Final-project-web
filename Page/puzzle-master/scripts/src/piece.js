function Piece(id, game, width, height, x, y, startPoint, target, holder, moveble, placed) {
  if(arguments.length > 0) {
    this.id = id; // ID của mảnh
    this.game = game; // Trò chơi mà mảnh thuộc về
    this.width = width; // Chiều rộng của mảnh
    this.height = height; // Chiều cao của mảnh
    this.x = x; // Tọa độ x của mảnh
    this.y = y; // Tọa độ y của mảnh
    this.target = target; // Tọa độ đích
    this.startPoint = new Point2D(target.x, target.y); // Điểm bắt đầu
    this.holder = holder; // Vị trí giữ mảnh
    this.moveble = moveble; // Có thể di chuyển không
    this.placed = placed; // Đã đặt chưa
    this.moveble = false; // Mặc định không thể di chuyển
    this.m = (target.y - this.y) / (target.x - this.x); // Độ dốc
    this.b = target.y - (this.m * target.x); // Hằng số
    if(Math.random() >= 0.5)
      this.p = 0.1; // Biến điều chỉnh ngẫu nhiên
    else
      this.p = -0.1; // Biến điều chỉnh ngẫu nhiên
  }
  else {
    // Giá trị mặc định nếu không có tham số
    this.id = 0;
    this.game = null;
    this.width = 10;
    this.height = 10;
    this.x = 0;
    this.y = 0;
    this.target = null;
    this.startPoint = null;
    this.holder = null;
    this.moveble = false;
    this.placed = null;
  }
  this.tolerance = 200; // Độ dung sai
  this.moving = false; // Trạng thái di chuyển
  this.placed = false; // Trạng thái đã đặt
}

Piece.prototype.draw = function() {
  if ((!this.moveble) && (!this.placed)) {
    this.game.context.globalAlpha = 1; // Đặt độ trong suốt

    this.p = this.p * 1.1; // Điều chỉnh biến p
    this.startPoint.x = this.startPoint.x + this.p; // Cập nhật tọa độ x
    this.startPoint.y = this.m * this.startPoint.x + this.b; // Cập nhật tọa độ y

    // Kiểm tra xem mảnh có ra ngoài biên không
    if ((this.startPoint.x + this.width / 2 >= (this.game.canvas.width / this.game.scale)) || 
        (this.startPoint.y + this.height / 2 >= (this.game.canvas.height / this.game.scale)) || 
        (this.startPoint.x - this.width / 2 <= 0) || 
        (this.startPoint.y - this.height / 2 <= 60)) {
      this.moveble = true; // Đánh dấu có thể di chuyển
      this.x = this.startPoint.x; // Cập nhật tọa độ x
      this.y = this.startPoint.y; // Cập nhật tọa độ y
      this.iniPoint = new Point2D(this.x, this.y); // Điểm khởi đầu
    }

    // Vẽ mảnh
    this.game.context.drawImage(this.game.img, this.holder.column * this.game.piece_width, this.holder.line * this.game.piece_height, this.game.piece_width, this.game.piece_height, 
      this.startPoint.x - this.game.piece_width / 2, this.startPoint.y - this.game.piece_height / 2, this.game.piece_width, this.game.piece_height);
  } else {
    // Nếu mảnh đã đặt hoặc có thể di chuyển
    if (this.placed)
      this.game.context.globalAlpha = 1; // Đặt độ trong suốt
    else if (!this.game.is_over)
      this.game.context.globalAlpha = 0.8; // Đặt độ trong suốt nếu trò chơi chưa kết thúc
    else
      this.game.context.globalAlpha = 1; // Đặt độ trong suốt nếu trò chơi đã kết thúc

    this.game.context.fillStyle = "rgba(255, 255, 255, 0.5)"; // Màu nền

    // Kiểm tra xem mảnh có được chọn hay không
    if (this == this.game.selected) {
      this.game.context.fillStyle = "rgba(0, 0, 255, 0.1)"; // Màu cho mảnh được chọn
    } else if (this.game.over == this) {
      this.game.context.fillStyle = "rgba(255, 0, 0, 0.1)"; // Màu cho mảnh đang ở trên
    }

    // Tự động đặt nếu đủ gần
    if ((this.game.selected == this) && (this.near())) {
      this.game.context.fillStyle = "rgba(0, 255, 0, 0.1)"; // Màu cho mảnh gần đúng
      if ((this.game.auto_snap == true) && (!this.placed)) {
        // Cập nhật tọa độ và trạng thái
        this.game.selected.x = this.game.selected.target.x;
        this.game.selected.y = this.game.selected.target.y;
        this.game.selected.placed = true;
        this.game.selected.moveble = false;
        this.game.placed_pieces.push(this.game.selected); // Thêm vào danh sách các mảnh đã đặt
        if (this.game.drip.currentTime != 0)
          this.game.drip.currentTime = 0; // Đặt lại thời gian phát nhạc
        this.game.drip.play(); // Phát âm thanh
      }
    }

    // Vẽ mảnh
    this.game.context.drawImage(this.game.img, this.holder.column * this.game.piece_width, this.holder.line * this.game.piece_height, this.game.piece_width, this.game.piece_height, 
      this.x - this.game.piece_width / 2, this.y - this.game.piece_height / 2, this.game.piece_width, this.game.piece_height);

    if (!this.game.is_over) {
      // Có thể thêm logic khác nếu cần
    }
  }

  // Ghi lại thông tin debug
  if (this.game.debug)
    console.log('mảnh: ' + this.id + ' đã vẽ');
}

Piece.prototype.near = function() {
  var r = false; // Biến lưu trữ kết quả
  var dx = this.x - this.target.x; // Tính khoảng cách x
  var dy = this.y - this.target.y; // Tính khoảng cách y
  var distance = (dx * dx + dy * dy); // Tính khoảng cách tổng
  if (distance <= this.tolerance) {
    r = true; // Nếu khoảng cách nhỏ hơn độ dung sai
  }
  if (this.game.debug) {
    console.log(this.id + ': ' + distance); // Ghi lại khoảng cách nếu đang trong chế độ debug
  }
  return r; // Trả về kết quả
}

Piece.prototype.mouse_is_over = function() {
  return this.game.mouse.isOverPiece(this); // Kiểm tra xem chuột có đang ở trên mảnh không
}