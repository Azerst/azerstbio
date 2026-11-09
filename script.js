/* ============================================================
   BẢO VỆ NỘI DUNG WEB - Chống xem mã nguồn / F12 / giữ màn hình
   Tác giả: (bạn có thể ghi tên)
   Lưu ý: Chỉ là lớp bảo vệ "làm khó", không bảo mật tuyệt đối.
   ============================================================ */

(function () {
    'use strict';

    // Cấu hình thời gian đếm ngược (giây)
    const RELOAD_DELAY = 5;

    // Cờ tránh hiện cảnh báo nhiều lần
    let isWarningShown = false;
    let countdownInterval = null;

    /* ------------------------------------------------------
       1. HÀM HIỂN THỊ CẢNH BÁO + ĐẾM NGƯỢC + RELOAD
    ------------------------------------------------------ */
    function showWarning(reason) {
        if (isWarningShown) return;
        isWarningShown = true;

        // Xóa console cho khó chịu
        try { console.clear(); } catch (e) {}

        // Tạo overlay cảnh báo
        const overlay = document.createElement('div');
        overlay.id = '__warning_overlay__';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.92);
            color: #fff;
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            user-select: none;
        `;

        overlay.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">⚠️</div>
            <h1 style="color: #ff4d4d; font-size: 24px; margin-bottom: 15px;">
                CẢNH BÁO BẢO MẬT
            </h1>
            <p style="font-size: 16px; line-height: 1.6; max-width: 500px; margin-bottom: 20px;">
                Hành vi xem mã nguồn hoặc sử dụng công cụ nhà phát triển
                đã bị phát hiện.<br>
                Lý do: <b>${reason}</b>
            </p>
            <p style="font-size: 14px; color: #aaa;">
                Trang sẽ tự động làm mới sau
                <b id="__countdown__" style="color:#ffd93d; font-size:18px;">${RELOAD_DELAY}</b> giây...
            </p>
        `;

        // Khi overlay được thêm vào, chặn mọi tương tác bên dưới
        overlay.addEventListener('contextmenu', e => e.preventDefault());
        overlay.addEventListener('mousedown', e => e.preventDefault());
        overlay.addEventListener('touchstart', e => e.preventDefault());

        document.body.appendChild(overlay);

        // Đếm ngược
        let remaining = RELOAD_DELAY;
        const countdownEl = document.getElementById('__countdown__');
        countdownInterval = setInterval(() => {
            remaining--;
            if (countdownEl) countdownEl.textContent = remaining;
            if (remaining <= 0) {
                clearInterval(countdownInterval);
                // Reload kèm cache-bust để chắc chắn tải lại
                window.location.reload();
            }
        }, 1000);
    }

    /* ------------------------------------------------------
       2. CHẶN CHUỘT PHẢI (CONTEXT MENU)
    ------------------------------------------------------ */
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showWarning('Bấm chuột phải');
        return false;
    }, false);

    /* ------------------------------------------------------
       3. CHẶN PHÍM TẮT MỞ DEVTOOLS / XEM MÃ NGUỒN
    ------------------------------------------------------ */
    document.addEventListener('keydown', function (e) {
        const key = e.key ? e.key.toLowerCase() : '';
        const code = e.keyCode || e.which;

        // F12
        if (code === 123 || key === 'f12') {
            e.preventDefault();
            showWarning('Nhấn F12');
            return false;
        }

        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (code === 73 || key === 'i')) {
            e.preventDefault();
            showWarning('Ctrl+Shift+I');
            return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (code === 74 || key === 'j')) {
            e.preventDefault();
            showWarning('Ctrl+Shift+J');
            return false;
        }

        // Ctrl+Shift+C (Chọn element)
        if (e.ctrlKey && e.shiftKey && (code === 67 || key === 'c')) {
            e.preventDefault();
            showWarning('Ctrl+Shift+C');
            return false;
        }

        // Ctrl+U (Xem mã nguồn)
        if (e.ctrlKey && (code === 85 || key === 'u')) {
            e.preventDefault();
            showWarning('Ctrl+U');
            return false;
        }

        // Cmd+Option+I / Cmd+Option+U trên macOS
        if (e.metaKey && e.altKey && (key === 'i' || key === 'u' || key === 'j' || key === 'c')) {
            e.preventDefault();
            showWarning('Phím tắt macOS');
            return false;
        }
    }, false);

    /* ------------------------------------------------------
       4. PHÁT HIỆN GIỮ (LONG-PRESS) TRÊN WEB
       - Giữ chuột trái hoặc chạm tay > 800ms → cảnh báo
       - Bỏ qua khi giữ trên thanh cuộn hoặc input
    ------------------------------------------------------ */
    const LONG_PRESS_MS = 800;
    let pressTimer = null;

    function startPress() {
        clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
            showWarning('Giữ chuột / chạm lâu trên trang');
        }, LONG_PRESS_MS);
    }

    function cancelPress() {
        clearTimeout(pressTimer);
    }

    // Chỉ kích hoạt trên vùng nội dung, bỏ qua input/textarea/button
    function shouldIgnore(target) {
        const tag = (target.tagName || '').toLowerCase();
        return ['input', 'textarea', 'select', 'button', 'a'].includes(tag);
    }

    document.addEventListener('mousedown', function (e) {
        if (e.button === 0 && !shouldIgnore(e.target)) startPress();
    }, false);

    document.addEventListener('mouseup', cancelPress, false);
    document.addEventListener('mouseleave', cancelPress, false);

    // Thiết bị cảm ứng
    document.addEventListener('touchstart', function (e) {
        if (!shouldIgnore(e.target)) startPress();
    }, { passive: true });

    document.addEventListener('touchend', cancelPress, { passive: true });
    document.addEventListener('touchcancel', cancelPress, { passive: true });
    document.addEventListener('touchmove', cancelPress, { passive: true });

    /* ------------------------------------------------------
       5. PHÁT HIỆN DEVTOOLS QUA KÍCH THƯỚC CỬA SỔ
       (Bắt được cả khi người dùng mở qua menu trình duyệt)
    ------------------------------------------------------ */
    const THRESHOLD = 160;

    setInterval(function () {
        if (isWarningShown) return;
        const widthDiff  = window.outerWidth  - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
            showWarning('Phát hiện DevTools đang mở');
        }
    }, 1000);

    /* ------------------------------------------------------
       6. CHẶN KÉO THẢ & COPY (tùy chọn, có thể xóa nếu không cần)
    ------------------------------------------------------ */
    document.addEventListener('dragstart', e => e.preventDefault(), false);
    document.addEventListener('selectstart', function (e) {
        // Cho phép chọn trong input/textarea
        if (shouldIgnore(e.target)) return;
        e.preventDefault();
    }, false);

    // Chặn Ctrl+C / Ctrl+A ngoài vùng input
    document.addEventListener('copy', function (e) {
        if (!shouldIgnore(e.target)) e.preventDefault();
    }, false);

})();
