// scoreManager.js

// Biến để lưu điểm số của người chơi
let score = 0;

// Cập nhật điểm số
function updateScore(points) {
    score += points; // Thêm điểm vào tổng điểm
    document.getElementById('score').innerText = score; // Cập nhật điểm hiển thị
}

// Lưu điểm vào localStorage
function saveScore() {
    localStorage.setItem('playerScore', score); // Lưu điểm vào localStorage
    alert('Điểm của bạn đã được lưu!'); // Thông báo cho người chơi
}

// Khôi phục điểm từ localStorage khi tải lại trang
function loadScore() {
    const savedScore = localStorage.getItem('playerScore'); // Lấy điểm đã lưu
    if (savedScore !== null) {
        score = parseInt(savedScore); // Chuyển đổi điểm thành số
        document.getElementById('score').innerText = score; // Cập nhật điểm hiển thị
    }
}

// Gọi hàm loadScore khi trang được tải
window.onload = function() {
    loadScore(); // Khôi phục điểm khi trang được tải
};

// Gán sự kiện cho nút lưu điểm
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('save-score');
    if (saveButton) {
        saveButton.addEventListener('click', saveScore); // Gán sự kiện cho nút lưu điểm
    }
});