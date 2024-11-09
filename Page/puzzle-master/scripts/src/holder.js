// Hàm khởi tạo Holder
function Holder(id, game, x, y, line, column, moveble) {
  // Kiểm tra xem có tham số được truyền vào không
  if(arguments.length > 0) {
    // Nếu có, gán các giá trị được truyền vào
    this.id = id; // ID của vị trí
    this.game = game; // Tham chiếu đến đối tượng game
    this.x = x; // Tọa độ x
    this.y = y; // Tọa độ y
    this.line = line; // Dòng
    this.column = column; // Cột
    this.moveble = moveble; // Có thể di chuyển không
  }
  else{
    // Nếu không có tham số, khởi tạo các giá trị mặc định
    this.id = 0;
    this.game = null;
    this.x = 0;
    this.y = 0;
    this.line = null;
    this.column = null;
    this.moveble = null;
  }
}

// Phương thức vẽ vị trí
Holder.prototype.draw = function() {
  // Đặt độ dày đường viền
  this.game.context.lineWidth = 1;
  
  // Vẽ hình chữ nhật biểu diễn vị trí
  // Vị trí được điều chỉnh để nằm chính giữa
  this.game.context.strokeRect(
    this.x - this.game.piece_width/2,  // Tọa độ x bắt đầu
    this.y - this.game.piece_height/2, // Tọa độ y bắt đầu
    this.game.piece_width,              // Chiều rộng
    this.game.piece_height              // Chiều cao
  );
}