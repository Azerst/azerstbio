// 1. Chặn menu chuột phải (context menu)
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('Chức năng chuột phải đã bị vô hiệu hóa vì lý do bảo mật.');
});

// 2. Chặn các phím tắt mở DevTools
document.addEventListener('keydown', function (e) {
    // Chặn F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        alert('Phím F12 đã bị chặn.');
        return false;
    }
    // Chặn Ctrl+Shift+I (Inspect) và Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
        alert('Tổ hợp phím Inspect/Console đã bị chặn.');
        return false;
    }
    // Chặn Ctrl+U (Xem mã nguồn)
    if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
        e.preventDefault();
        alert('Tổ hợp phím xem mã nguồn đã bị chặn.');
        return false;
    }
});
