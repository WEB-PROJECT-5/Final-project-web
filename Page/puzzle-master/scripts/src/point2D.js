
function Point2D(x, y) {
  if(arguments.length > 0) {
    this.x = x; // Tọa độ x
    this.y = y; // Tọa độ y
  }
}


Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y); // Tạo bản sao của đối tượng Point2D
};


Point2D.prototype.add = function(that) {
  return new Point2D(this.x + that.x, this.y + that.y); // Cộng hai điểm
};


Point2D.prototype.addEquals = function(that) {
  this.x += that.x; // Cộng tọa độ x
  this.y += that.y; // Cộng tọa độ y

  return this; // Trả về đối tượng hiện tại
};


Point2D.prototype.offset = function(a, b) {
  var result = 0;

  if(!(b.x <= this.x || this.x + a.x <= 0)) {
    var t = b.x * a.y - a.x * b.y;
    var s;
    var d;

    if(t > 0) {
      if(this.x < 0) {
        s = this.x * a.y;
        d = s / a.x - this.y;
      } else if(this.x > 0) {
        s = this.x * b.y;
        d = s / b.x - this.y;
      } else {
        d = -this.y;
      }
    } else {
      if(b.x < this.x + a.x) {
        s = (b.x - this.x) * a.y;
        d = b.y - (this.y + s / a.x);
      } else if(b.x > this.x + a.x) {
        s = (a.x + this.x) * b.y;
        d = s / b.x - (this.y + a.y);
      } else {
        d = b.y - (this.y + a.y);
      }
    }

    if(d > 0) {
      result = d; // Gán kết quả nếu d lớn hơn 0
    }
  }

  return result; // Trả về kết quả
};


Point2D.prototype.rmoveto = function(dx, dy) {
  this.x += dx; // Cập nhật tọa độ x
  this.y += dy; // Cập nhật tọa độ y
};


Point2D.prototype.scalarAdd = function(scalar) {
  return new Point2D(this.x + scalar, this.y + scalar); // Cộng một số vô hướng vào điểm
};


Point2D.prototype.scalarAddEquals = function(scalar) {
  this.x += scalar; // Cộng số vô hướng vào tọa độ x
  this.y += scalar; // Cộng số vô hướng vào tọa độ y

  return this; // Trả về đối tượng hiện tại
};


Point2D.prototype.subtract = function(that) {
  return new Point2D(this.x - that.x, this.y - that.y); // Trừ hai điểm
};


Point2D.prototype.subtractEquals = function(that) {
  this.x -= that.x; // Trừ tọa độ x
  this.y -= that.y; // Trừ tọa độ y

  return this; // Trả về đối tượng hiện tại
};


Point2D.prototype.scalarSubtract = function(scalar) {
  return new Point2D(this.x - scalar, this.y - scalar); // Trừ một số vô hướng khỏi điểm
};


Point2D.prototype.scalarSubtractEquals = function(scalar) {
  this.x -= scalar; // Trừ số vô hướng khỏi tọa độ x
  this.y -= scalar; // Trừ số vô hướng khỏi tọa độ y

  return this; // Trả về đối tượng hiện tại
};


Point2D.prototype.multiply = function(scalar) {
  return new Point2D(this.x * scalar, this.y * scalar); // Nhân điểm với một số vô hướng
};


Point2D.prototype.multiplyEquals = function(scalar) {
  this.x *= scalar; // Nhân tọa độ x
  this.y *= scalar; // Nhân tọa độ y

  return this; // Trả về đối tượng hiện tại
};


Point2D.prototype.divide = function(scalar) {
  return new Point2D(this.x / scalar, this.y / scalar); // Chia điểm cho một số vô hướng
};


Point2D.prototype.divideEquals = function(scalar) {
  this.x /= scalar; // Chia tọa độ x
  this.y /= scalar; // Chia tọa độ y

  return this; // Trả về đối tượng hiện tại
};

/*****
 *
 *   phương thức so sánh
 *
 *****/

/*****
 *
 *   compare
 *
 *****/
Point2D.prototype.compare = function(that) {
  return (this.x - that.x || this.y - that.y); // So sánh hai điểm
};

/*****
 *
 *   eq - bằng
 *
 *****/
Point2D.prototype.eq = function(that) {
  return (this.x == that.x && this.y == that.y); // Kiểm tra hai điểm có bằng nhau không
};

/*****
 *
 *   lt - nhỏ hơn
 *
 *****/
Point2D.prototype.lt = function(that) {
  return (this.x < that.x && this.y < that.y); // Kiểm tra xem điểm này nhỏ hơn điểm kia không
};

/*****
 *
 *   lte - nhỏ hơn hoặc bằng
 *
 *****/
Point2D.prototype.lte = function(that) {
  return (this.x <= that.x && this.y <= that.y); // Kiểm tra xem điểm này nhỏ hơn hoặc bằng điểm kia không
};

/*****
 *
 *   gt - lớn hơn
 *
 *****/
Point2D.prototype.gt = function(that) {
  return (this.x > that.x && this.y > that.y); // Kiểm tra xem điểm này lớn hơn điểm kia không
};

/*****
 *
 *   gte - lớn hơn hoặc bằng
 *
 *****/
Point2D.prototype.gte = function(that) {
  return (this.x >= that.x && this.y >= that.y); // Kiểm tra xem điểm này lớn hơn hoặc bằng điểm kia không
};

/*****
 *
 *   phương thức tiện ích
 *
 *****/


Point2D.prototype.lerp = function(that, t) {
  return new Point2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t); // Nội suy tuyến tính giữa hai điểm
};


Point2D.prototype.distanceFrom = function(that) {
  var dx = this.x - that.x; // Tính khoảng cách x
  var dy = this.y - that.y; // Tính khoảng cách y

  return Math.sqrt(dx * dx + dy * dy); // Tính khoảng cách Euclide giữa hai điểm
};


Point2D.prototype.min = function(that) {
  return new Point2D(Math.min(this.x, that.x), Math.min(this.y, that.y)); // Lấy điểm có tọa độ nhỏ nhất
};

Point2D.prototype.max = function(that) {
  return new Point2D(Math.max(this.x, that.x), Math.max(this.y, that.y)); // Lấy điểm có tọa độ lớn nhất
};


Point2D.prototype.toString = function() {
  return this.x + "," + this.y; // Trả về chuỗi biểu diễn tọa độ
};

/*****
 *
 *   phương thức get/set
 *
 *****/


Point2D.prototype.setXY = function(x, y) {
  this.x = x; // Cập nhật tọa độ x
  this.y = y; // Cập nhật tọa độ y
};


Point2D.prototype.setFromPoint = function(that) {
  this.x = that.x; // Cập nhật tọa độ từ một điểm khác
  this.y = that.y; // Cập nhật tọa độ từ một điểm khác
};


Point2D.prototype.swap = function(that) {
  var x = this.x;
  var y = this.y;

  this.x = that.x; // Hoán đổi tọa độ x
  this.y = that.y; // Hoán đổi tọa độ y

  that.x = x; // Hoán đổi tọa độ x của điểm kia
  that.y = y; // Hoán đổi tọa độ y của điểm kia
};