/*****
 *
 *   Chuột.js
 *
 *****/

/*****
 *
 *   Hàm khởi tạo
 *
 *****/
function Mouse(game) {
  this.game = game;
  this.x = 0; // Tọa độ x của chuột
  this.y = 0; // Tọa độ y của chuột
  this.down = false; // Trạng thái nhấn chuột
  this.up = false; // Trạng thái nhả chuột
  var me = this; // Tham chiếu đến chính đối tượng này
  this.moving = false; // Trạng thái di chuyển
  this.interval = null; // Biến lưu trữ khoảng thời gian

  //this.element = window;
  this.element = document.getElementById('canvas'); // Phần tử canvas
  
  if(!Modernizr.touch){
    this.element.addEventListener('mousemove', function(e){ me.mousemove(e) }, false); // Sự kiện di chuyển chuột
    this.element.addEventListener('mousedown', function(e){ me.mousedown(e) }, false); // Sự kiện nhấn chuột
    this.element.addEventListener('mouseup', function(e){ me.mouseup(e) }, false); // Sự kiện nhả chuột
    //window.addEventListener('keyup', function(e){ me.keyup(e) }, false);
  }else{
    this.element.addEventListener('touchstart', function(e) { me.touchstart(e) }, false); // Sự kiện chạm bắt đầu
    this.element.addEventListener('touchmove', function(e) { me.touchmove(e) }, false); // Sự kiện chạm di chuyển
    this.element.addEventListener('touchend', function(e) { me.touchend(e) }, false); // Sự kiện chạm kết thúc
  }
}

/*****
 *
 *   Hàm khi nhả phím
 *
 *****/
Mouse.prototype.keyup = function(e) {
  console.log(e.keyCode); // In ra mã phím
}

/*****
 *
 *   Kiểm tra xem chuột có đang ở trên bóng không
 *    -
 *
 *****/
Mouse.prototype.isOverBall = function(ball) {
  var r = false; // Biến lưu trữ kết quả
  if((this.x > 0 && this.y > 0)&&(ball.x > 0 && ball.y > 0)){
    if(((this.x >= (ball.x - ball.radius)) && (this.x <= (ball.x + ball.radius)))&&
    ((this.y >= (ball.y - ball.radius)) && (this.y <= (ball.y + ball.radius)))){
      r = true; // Nếu chuột nằm trên bóng

      if(this.game.debug){
        console.log('trên '+this.x+' '+this.y); // Ghi lại tọa độ nếu đang trong chế độ debug
      }
    }
  }
  return r; // Trả về kết quả
}

Mouse.prototype.isOverPiece = function(piece) {
  var poly = new Array(); // Mảng lưu trữ các điểm của hình đa giác
  poly[0]= new Point2D(piece.x-piece.width/2, piece.y-piece.height/2);
  poly[1]= new Point2D(piece.x+piece.width/2, piece.y-piece.height/2);
  poly[2]= new Point2D(piece.x+piece.width/2, piece.y+piece.height/2);
  poly[3]= new Point2D(piece.x-piece.width/2, piece.y+piece.height/2);
  pt = new Point2D(this.x, this.y); // Tạo điểm từ tọa độ chuột
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c); // Kiểm tra xem điểm có nằm trong đa giác không
  return c; // Trả về kết quả
}

Mouse.prototype.isOverRect = function(p1, p2, p3, p4) {
  var poly = new Array(); // Mảng lưu trữ các điểm của hình chữ nhật
  poly[0]=p1;
  poly[1]=p2;
  poly[2]=p3;
  poly[3]=p4;
  pt = new Point2D(this.x, this.y); // Tạo điểm từ tọa độ chuột
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c); // Kiểm tra xem điểm có nằm trong hình chữ nhật không
  return c; // Trả về kết quả
}

/*****
 *
 *   Hàm di chuyển chuột
 *
 *****/
Mouse.prototype.mousemove = function(e) {
  
  body_scrollLeft = document.body.scrollLeft,
  element_scrollLeft = document.documentElement.scrollLeft,
  body_scrollTop = document.body.scrollTop,
  element_scrollTop = document.documentElement.scrollTop,
  offsetLeft = this.element.offsetLeft,
  offsetTop = this.element.offsetTop;
  
  var xx, yy;
  if (e.pageX || e.pageY) {
    xx = e.pageX; // Lấy tọa độ x
    yy = e.pageY; // Lấy tọa độ y
  } else {
    xx = e.clientX + body_scrollLeft + element_scrollLeft; // Tính tọa độ x khi không có pageX
    yy = e.clientY + body_scrollTop + element_scrollTop; // Tính tọa độ y khi không có pageY
  }
  
  xx = xx/this.game.scale; // Điều chỉnh theo tỷ lệ
  yy = yy/this.game.scale; // Điều chỉnh theo tỷ lệ
  
  this.moving = true; // Đánh dấu đang di chuyển
  interv(); // Gọi hàm interv
  this.x = xx; // Cập nhật tọa độ x
  this.y = yy; // Cập nhật tọa độ y
  this.event = e; // Lưu sự kiện

  if(this.game.debug){
    console.log('di chuyển '+xx); // Ghi lại tọa độ nếu đang trong chế độ debug
  }
}

/*****
 *
 *   Hàm nhấn chuột
 *
 *****/
Mouse.prototype.mousedown = function(e) {
  this.down = true; // Đánh dấu nhấn chuột
  this.up = false; // Đánh dấu chưa nhả chuột
  this.event = e; // Lưu sự kiện
  
  // Chọn
  if(this.game.over){
    this.game.selected = this.game.over; // Chọn đối tượng
  }

  if(this.game.debug){
    console.log('nhấn'); // Ghi lại sự kiện nhấn nếu đang trong chế độ debug
  }
}

/*****
 *
 *   Hàm nhả chuột
 *
 *****/
Mouse.prototype.mouseup = function(e) {
  e.preventDefault(); // Ngăn chặn hành vi mặc định

  this.up = true; // Đánh dấu nhả chuột
  this.down = false; // Đánh dấu không nhấn chuột
  this.event = e; // Lưu sự kiện

  // Đặt
  if((this.game.selected)&&(this.game.selected.near())&&(!this.game.selected.placed)){
    this.game.selected.x = this.game.selected.target.x; // Cập nhật tọa độ x
    this.game.selected.y = this.game.selected.target.y; // Cập nhật tọa độ y
    this.game.selected.placed = true; // Đánh dấu đã đặt
    this.game.selected.moveble = false; // Đánh dấu không thể di chuyển
    this.game.placed_pieces.push(this.game.selected); // Thêm vào danh sách các mảnh đã đặt
    if(this.game.drip.currentTime != 0)
      this.game.drip.currentTime = 0; // Đặt lại thời gian phát nhạc
    this.game.drip.play(); // Phát âm thanh
  }else if((this.game.selected)&&(!this.game.selected.near())){
    this.game.selected.p = 0; // Đặt chỉ số về 0
    this.game.selected.moveble = false; // Đánh dấu không thể di chuyển
    this.game.selected.placed = false; // Đánh dấu không đặt
    if(this.game.twang.currentTime != 0)
      this.game.twang.currentTime = 0; // Đặt lại thời gian phát nhạc
    this.game.twang.play(); // Phát âm thanh
  }

  // Bỏ chọn
  this.game.selected = null; // Đặt lại lựa chọn

  if(this.game.debug){
    console.log('nhả'); // Ghi lại sự kiện nhả nếu đang trong chế độ debug
  }
}

/*****
 *
 *   Hàm chạm bắt đầu
 *
 *****/
Mouse.prototype.touchstart = function(e) {
  this.game.drip.play(); // Phát âm thanh khi chạm

  e.preventDefault(); // Ngăn chặn hành vi mặc định

  this.moving = false; // Đánh dấu không di chuyển
  this.down = true; // Đánh dấu nhấn chuột
  this.up = false; // Đánh dấu chưa nhả chuột
  this.event = e; // Lưu sự kiện
  
  if(this.game.debug){
    console.log('chạm bắt đầu'); // Ghi lại sự kiện chạm bắt đầu nếu đang trong chế độ debug
  }
}

/*****
 *
 *   Hàm chạm kết thúc
 *
 *****/
Mouse.prototype.touchend = function(e) {
  if(this.game.debug)
    console.log('chạm kết thúc'); // Ghi lại sự kiện chạm kết thúc nếu đang trong chế độ debug
    
  e.preventDefault(); // Ngăn chặn hành vi mặc định

  this.moving = false; // Đánh dấu không di chuyển
  this.up = true; // Đánh dấu nhả chuột
  this.down = false; // Đánh dấu không nhấn chuột
  this.x = -1; // Đặt tọa độ x về -1
  this.y = -1; // Đặt tọa độ y về -1

  // Đặt
  if((this.game.selected)&&(this.game.selected.near())&&(!this.game.selected.placed)){
    this.game.selected.x = this.game.selected.target.x; // Cập nhật tọa độ x
    this.game.selected.y = this.game.selected.target.y; // Cập nhật tọa độ y
    this.game.selected.placed = true; // Đánh dấu đã đặt
    this.game.selected.moveble = false; // Đánh dấu không thể di chuyển
    this.game.placed_pieces.push(this.game.selected); // Thêm vào danh sách các mảnh đã đặt
    if(this.game.drip.currentTime != 0)
      this.game.drip.currentTime = 0; // Đặt lại thời gian phát nhạc
    this.game.drip.play(); // Phát âm thanh
  }else if((this.game.selected)&&(!this.game.selected.near())){
    this.game.selected.p = 0; // Đặt chỉ số về 0
    this.game.selected.moveble = false; // Đánh dấu không thể di chuyển
    this.game.selected.placed = false; // Đánh dấu không đặt
    if(this.game.twang.currentTime != 0)
      this.game.twang.currentTime = 0; // Đặt lại thời gian phát nhạc
    this.game.twang.play(); // Phát âm thanh
    this.game.selected = null; // Bỏ chọn
  }
  
  // Bỏ chọn
  this.game.selected = null; // Đặt lại lựa chọn
}

/*****
 *
 *   Hàm chạm di chuyển
 *
 *****/
Mouse.prototype.touchmove = function(e) {

  e.preventDefault(); // Ngăn chặn hành vi mặc định

  body_scrollLeft = document.body.scrollLeft,
  element_scrollLeft = document.documentElement.scrollLeft,
  body_scrollTop = document.body.scrollTop,
  element_scrollTop = document.documentElement.scrollTop,
  offsetLeft = this.element.offsetLeft,
  offsetTop = this.element.offsetTop;

  var xx, yy, touch_event = e.touches[0]; // Lấy sự kiện chạm đầu tiên
  if (touch_event.pageX || touch_event.pageY) {
    xx = touch_event.pageX; // Lấy tọa độ x
    yy = touch_event.pageY; // Lấy tọa độ y
  } else {
    xx = touch_event.clientX + body_scrollLeft + element_scrollLeft; // Tính tọa độ x khi không có pageX
    yy = touch_event.clientY + body_scrollTop + element_scrollTop; // Tính tọa độ y khi không có pageY
  }  
  //xx -= offsetLeft;
  //yy -= offsetTop;

  xx = xx/this.game.scale; // Điều chỉnh theo tỷ lệ
  yy = yy/this.game.scale; // Điều chỉnh theo tỷ lệ

  this.moving = true; // Đánh dấu đang di chuyển
  this.x = xx; // Cập nhật tọa độ x
  this.y = yy; // Cập nhật tọa độ y
  this.event = e; // Lưu sự kiện

  // Chọn
  if(this.game.over){
    this.game.selected = this.game.over; // Chọn đối tượng
  }

  if(this.game.debug)
    console.log('chạm di chuyển '+xx); // Ghi lại tọa độ nếu đang trong chế độ debug
}