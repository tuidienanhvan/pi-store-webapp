import re

with open(r'C:\Users\Administrator\Local Sites\saigonhouse\app\public\wp-content\pi-store-webapp\src\lib\adminI18n.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix syntax error
text = text.replace('  },\n  },\n  en: {', '  },\n  en: {')

replacements = {
    "?ang": "Đang",
    "t?i": "tải",
    "luu": "lưu",
    "Da": "Đã",
    "H?y": "Hủy",
    "Dóng": "Đóng",
    "S?a": "Sửa",
    "Xóa": "Xóa",
    "T?o": "Tạo",
    "C?p nh?t": "Cập nhật",
    "Tìm ki?m": "Tìm kiếm",
    "l?c": "lọc",
    "l?i": "lại",
    "Chi ti?t": "Chi tiết",
    "Hành d?ng": "Hành động",
    "T?ng": "Tổng",
    "Tr?ng thái": "Trạng thái",
    "Chua": "Chưa",
    "T?t c?": "Tất cả",
    "B?n ch?c ch?n mu?n xóa?": "Bạn chắc chắn muốn xóa?",
    "Trang": "Trang",
    "Hi?n th?": "Hiển thị",
    "Tru?c": "Trước",
    "Sau": "Sau",
    "Dang ký": "Đăng ký",
    "Dang nh?p": "Đăng nhập",
    "L?n ch?y cu?i": "Lần chạy cuối",
    "L?n ch?y k?": "Lần chạy kế",
    "Th?i gian": "Thời gian",
    "T?ng quan h? th?ng": "Tổng quan hệ thống",
    "S? li?u th?i gian th?c.": "Số liệu thời gian thực.",
    "ho?t d?ng": "hoạt động",
    "dã dùng": "đã dùng",
    "h? th?ng": "hệ thống",
    "Ma tr?n s?c kh?e": "Ma trận sức khỏe",
    "C?nh báo th?i gian th?c": "Cảnh báo thời gian thực",
    "S?p h?t h?n": "Sắp hết hạn",
    "ngày t?i": "ngày tới",
    "Xem t?t c?": "Xem tất cả",
    "Qu?n lý": "Quản lý",
    "m?i": "mới",
    "Thêm": "Thêm",
    "T?i lên b?n phát hành": "Tải lên bản phát hành",
    "tu?n này": "tuần này",
    "D? ki?n cu?i tháng": "Dự kiến cuối tháng",
    "gán gói": "gán gói",
    "c?p key cho khách hàng": "cấp key cho khách hàng",
    "Khách hàng": "Khách hàng",
    "Gói": "Gói",
    "H?n m?c": "Hạn mức",
    "H?t h?n": "Hết hạn",
    "Phân h?ng": "Phân hạng",
    "Thu h?i": "Thu hồi",
    "Kích ho?t l?i": "Kích hoạt lại",
    "Tìm theo": "Tìm theo",
    "tên": "tên",
    "d?ch v?": "dịch vụ",
    "H?n dùng": "Hạn dùng",
    "Chua có": "Chưa có",
    "nào": "nào",
    "B?t d?u": "Bắt đầu",
    "d?u tiên": "đầu tiên",
    "Không tìm th?y k?t qu?": "Không tìm thấy kết quả",
    "Vui lòng th? d?i b?": "Vui lòng thử đổi bộ",
    "trong": "trong",
    "ngày": "ngày",
    "Dã quá": "Đã quá",
    "M?i nh?t": "Mới nhất",
    "Cu nh?t": "Cũ nhất",
    "H?n xa nh?t": "Hạn xa nhất",
    "Ngu?i dùng": "Người dùng",
    "Qu?n tr?": "Quản trị",
    "tài kho?n": "tài khoản",
    "phân quy?n": "phân quyền",
    "H? so": "Hồ sơ",
    "Vai trò": "Vai trò",
    "S? du": "Số dư",
    "chi tiêu": "chi tiêu",
    "QU?N TR? VIÊN": "QUẢN TRỊ VIÊN",
    "NGU?I DÙNG": "NGƯỜI DÙNG",
    "DÃ KHÓA": "ĐÃ KHÓA",
    "H?y quy?n": "Hủy quyền",
    "C?p quy?n": "Cấp quyền",
    "Khóa": "Khóa",
    "M? khóa": "Mở khóa",
    "C?p quy?n Admin cho ngu?i dùng này?": "Cấp quyền Admin cho người dùng này?",
    "H?y quy?n Admin và chuy?n v? ngu?i dùng thu?ng?": "Hủy quyên Admin và chuyển về người dùng thường?",
    "B?n có ch?c ch?n mu?n khóa tài kho?n này?": "Bạn có chắc chắn muốn khóa tài khoản này?",
    "M? khóa tài kho?n này?": "Mở khóa tài khoản này?",
    "Không tìm th?y khách hàng phù h?p.": "Không tìm thấy khách hàng phù hợp.",
    "Nhà cung c?p": "Nhà cung cấp",
    "d?nh tuy?n": "định tuyến",
    "Uu tiên": "Ưu tiên",
    "mi?n phí": "miễn phí",
    "s? d?ng": "sử dụng",
    "tr? phí": "trả phí",
    "khi c?n ch?t lu?ng cao": "khi cần chất lượng cao",
    "Chi phí": "Chi phí",
    "Kích ho?t": "Kích hoạt",
    "c?u hình": "cấu hình",
    "Chua có key": "Chưa có key",
    "Ki?m tra": "Kiểm tra",
    "S?n d?ng": "Sẵn dụng",
    "Dã c?p phát": "Đã cấp phát",
    "Kh?e m?nh": "Khỏe mạnh",
    "Kho khóa API": "Kho khóa API",
    "upstream": "upstream",
    "M?i": "Mỗi",
    "du?c": "được",
    "c?p riêng": "cấp riêng",
    "không dùng chung": "không dùng chung",
    "Nh?p hàng lo?t": "Nhập hàng loạt",
    "D?t l?i chu k?": "Đặt lại chu kỳ",
    "T?ng c?ng": "Tổng cộng",
    "S?n dùng": "Sẵn dùng",
    "b? c?m": "bị cấm",
    "Nhãn": "Nhãn",
    "Ch? s? h?u": "Chủ sở hữu",
    "Kho khóa dang tr?ng": "Kho khóa đang trống",
    "C?n ít nh?t": "Cần ít nhất",
    "d?": "để",
    "có th?": "có thể",
    "D?nh nghia": "Định nghĩa",
    "các": "các",
    "di?u ch?nh": "điều chỉnh",
    "riêng": "riêng",
    "Giá hàng tháng": "Giá hàng tháng",
    "Giá hàng nam": "Giá hàng năm",
    "Ch?t lu?ng": "Chất lượng",
    "Ngu?i mua": "Người mua",
    "Phân tích": "Phân tích",
    "lu?t g?i": "lượt gọi",
    "doanh thu": "doanh thu",
    "chi phí": "chi phí",
    "và": "và",
    "l?i nhu?n": "lợi nhuận",
    "theo": "theo",
    "Kho?ng": "Khoảng",
    "u?c tính": "ước tính",
    "d?u vào": "đầu vào",
    "L?i nhu?n g?p": "Lợi nhuận gộp",
    "D? tr? trung bình": "Độ trễ trung bình",
    "Luu lu?ng": "Lưu lượng",
    "Thành công": "Thành công",
    "Th?t b?i": "Thất bại",
    "Phân b?": "Phân bổ",
    "T? tr?ng": "Tỷ trọng",
    "Báo cáo": "Báo cáo",
    "Doanh thu": "Doanh thu",
    "Theo dõi": "Theo dõi",
    "t? l? roi b?": "tỷ lệ rơi bỏ",
    "tháng": "tháng",
    "Thanh toán l?i": "Thanh toán lỗi",
    "Hóa don": "Hóa đơn",
    "B?n phát hành": "Bản phát hành",
    "t?p": "tệp",
    "t? d?ng": "tự động",
    "ki?m tra": "kiểm tra",
    "t?i dây": "tại đây",
    "b?n m?i": "bản mới",
    "Phiên b?n": "Phiên bản",
    "yêu c?u": "yêu cầu",
    "Kích thu?c": "Kích thước",
    "Ngày t?i lên": "Ngày tải lên",
    "O?n d?nh": "Ổn định",
    "G? b?": "Gỡ bỏ",
    "T?i v?": "Tải về",
    "b?n phát hành nào": "bản phát hành nào",
    "Nh?t ký": "Nhật ký",
    "Ghi l?i": "Ghi lại",
    "toàn b?": "toàn bộ",
    "l?ch s?": "lịch sử",
    "thao tác": "thao tác",
    "Ngu?i th?c hi?n": "Người thực hiện",
    "Tài nguyên": "Tài nguyên",
    "Thông di?p": "Thông điệp",
    "M?c d?": "Mức độ",
    "Tru?c": "Trước",
    "Sau": "Sau",
    "s? ki?n": "sự kiện",
    "c?p nh?t": "cập nhật",
    "T? ngày": "Từ ngày",
    "D?n ngày": "Đến ngày",
    "n?i dung": "nội dung",
    "C?u hình": "Cấu hình",
    "Thi?t l?p": "Thiết lập",
    "tham s?": "tham số",
    "v?n hành": "vận hành",
    "toàn c?u": "toàn cầu",
    "c?a": "của",
    "Thuong hi?u": "Thương hiệu",
    "Tên trang web": "Tên trang web",
    "Du?ng d?n": "Đường dẫn",
    "Màu ch? d?o": "Màu chủ đạo",
    "h? tr?": "hỗ trợ",
    "Tính nang": "Tính năng",
    "Tác v?": "Tác vụ",
    "ti?n trình": "tiến trình",
    "ch?y ng?m": "chạy ngầm",
    "l?ch trình": "lịch trình",
    "Ch?y ngay": "Chạy ngay",
    "bao gi?": "bao giờ",
    "B?o m?t": "Bảo mật",
    "Môi tru?ng": "Môi trường",
    "giá tr?": "giá trị",
    "d?c t?": "đọc từ",
    "bi?n môi tru?ng": "biến môi trường",
    "không luu": "không lưu",
    "co s? d? li?u": "cơ sở dữ liệu",
    "Cho phép": "Cho phép",
    "B?t n?p ti?n": "Bật nạp tiền",
    "B?t ch? ?ng d?ng": "Bật chợ ứng dụng",
    "Ch? d? b?o trì": "Chế độ bảo trì",
    "dang l?i": "đang lỗi",
    "tru?c": "trước",
    "n?a": "nữa",
    "v?a xong": "vừa xong",
    "ngày": "ngày",
    "M?i": "Mọi",
    "hoàn h?o": "hoàn hảo"
}

start_idx = text.find('  vi: {')
end_idx = text.find('  en: {')

if start_idx != -1 and end_idx != -1:
    vi_block = text[start_idx:end_idx]
    
    # We apply replacements only to the strings values, i.e., what is inside double quotes.
    def replace_in_string(match):
        val = match.group(1)
        for bad, good in replacements.items():
            if bad in val:
                val = val.replace(bad, good)
        
        # specific hard fixes for strings we couldn't match due to ? symbols
        if val == "?ang ti": val = "Đang tải"
        elif val == "?ang lu": val = "Đang lưu"
        elif val == "?A lu": val = "Đã lưu"
        elif val == "Hy": val = "Hủy"
        elif val == "?A3ng": val = "Đóng"
        elif val == "S-a": val = "Sửa"
        elif val == "XA3a": val = "Xóa"
        elif val == "To": val = "Tạo"
        elif val == "C-p nh-t": val = "Cập nhật"
        elif val == "TAm kim": val = "Tìm kiếm"
        elif val == "XA3a l?c": val = "Xóa lọc"
        elif val == "Ti li": val = "Tải lại"
        elif val == "Chi tit": val = "Chi tiết"
        elif val == "HAnh `Tng": val = "Hành động"
        elif val == "Tng": val = "Tổng"
        elif val == "Trng thAi": val = "Trạng thái"
        elif val == "Cha": val = "Chưa"
        elif val == "Tt c": val = "Tất cả"
        elif val == "Bn ch_c ch_n mu`n xA3a?": val = "Bạn chắc chắn muốn xóa?"
        elif val == "Hin th<": val = "Hiển thị"
        elif val == "+? Tr>c": val = "← Trước"
        elif val == "Sau +'": val = "Sau →"
        elif val == "?ng kA": val = "Đăng ký"
        elif val == "?ng nh-p": val = "Đăng nhập"
        elif val == "Ln chy cu`i": val = "Lần chạy cuối"
        elif val == "Ln chy k": val = "Lần chạy kế"
        elif val == "Th?i gian": val = "Thời gian"
        elif val == "Tng quan h th`ng": val = "Tổng quan hệ thống"
        elif val == "S` liu th?i gian thc.": val = "Số liệu thời gian thực."
        elif val == "Licenses `ang hot `Tng": val = "Licenses đang hoạt động"
        elif val == "Pi Tokens `A dA1ng": val = "Pi Tokens đã dùng"
        elif val == "Trng thAi h th`ng": val = "Trạng thái hệ thống"
        elif val == "Ma tr-n scc kh?e Provider": val = "Ma trận sức khỏe Provider"
        elif val == "Trng thAi Key Pool": val = "Trạng thái Key Pool"
        elif val == "Cnh bAo th?i gian thc": val = "Cảnh báo thời gian thực"
        elif val == "S_p ht hn (7 ngAy t>i)": val = "Sắp hết hạn (7 ngày tới)"
        elif val == "Xem tt c": val = "Xem tất cả"
        elif val == "Qun lA": val = "Quản lý"
        elif val == "License m>i": val = "License mới"
        elif val == "ThAm key": val = "Thêm key"
        elif val == "User m>i": val = "User mới"
        elif val == "Ti lAn bn phAt hAnh": val = "Tải lên bản phát hành"
        elif val == "m>i tun nAy": val = "mới tuần này"
        elif val == "D kin cu`i thAng": val = "Dự kiến cuối tháng"
        elif val == "Qun lA Licenses": val = "Quản lý Licenses"
        elif val == "Qun lA license, gAn gA3i Cloud vA cp key cho khAch hAng.": val = "Quản lý license, gán gói Cloud và cấp key cho khách hàng."
        elif val == "To license": val = "Tạo license"
        elif val == "KhAch hAng": val = "Khách hàng"
        elif val == "GA3i": val = "Gói"
        elif val == "GA3i & Hn mcc": val = "Gói & Hạn mức"
        elif val == "Ht hn": val = "Hết hạn"
        elif val == "Thu h\"i": val = "Thu hồi"
        elif val == "KA-ch hot li": val = "Kích hoạt lại"
        elif val == "TAm theo email / key / tAn": val = "Tìm theo email / key / tên"
        elif val == "PhAn hng": val = "Phân hạng"
        elif val == "GA3i d<ch v": val = "Gói dịch vụ"
        elif val == "Hn dA1ng": val = "Hạn dùng"
        elif val == "Cha cA3 license nAo": val = "Chưa có license nào"
        elif val == "B_t `u to license `u tiAn cho khAch hAng.": val = "Bắt đầu tạo license đầu tiên cho khách hàng."
        elif val == "KhA'ng tAm thy kt qu": val = "Không tìm thấy kết quả"
        elif val == "Vui lAng th- `i bT l?c hoc xA3a l?c.": val = "Vui lòng thử đổi bộ lọc hoặc xóa lọc."
        elif val == "?ang hot `Tng": val = "Đang hoạt động"
        elif val == "?A thu h\"i": val = "Đã thu hồi"
        elif val == "?A ht hn": val = "Đã hết hạn"
        elif val == "Ht hn trong < 7 ngAy": val = "Hết hạn trong < 7 ngày"
        elif val == "Ht hn trong < 30 ngAy": val = "Hết hạn trong < 30 ngày"
        elif val == "Ht hn trong < 90 ngAy": val = "Hết hạn trong < 90 ngày"
        elif val == "?A quA hn": val = "Đã quá hạn"
        elif val == "M>i nht": val = "Mới nhất"
        elif val == "Cc nht": val = "Cũ nhất"
        elif val == "S_p ht hn": val = "Sắp hết hạn"
        elif val == "Hn xa nht": val = "Hạn xa nhất"
        elif val == "KhAch hAng & Ng?i dA1ng": val = "Khách hàng & Người dùng"
        elif val == "Qun tr< tAi khon vA phAn quy?n h th`ng": val = "Quản trị tài khoản và phân quyền hệ thống"
        elif val == "tAi khon": val = "tài khoản"
        elif val == "To tAi khon": val = "Tạo tài khoản"
        elif val == "H\" s": val = "Hồ sơ"
        elif val == "Vai trA": val = "Vai trò"
        elif val == "S` d": val = "Số dư"
        elif val == "Tng chi tiAu": val = "Tổng chi tiêu"
        elif val == "?ng kA / ?ng nh-p cu`i": val = "Đăng ký / Đăng nhập cuối"
        elif val == "QUN TRS VIASN": val = "QUẢN TRỊ VIÊN"
        elif val == "NG_oI DATNG": val = "NGƯỜI DÙNG"
        elif val == "?A KHA\"A": val = "ĐÃ KHÓA"
        elif val == "Hy quy?n Admin": val = "Hủy quyền Admin"
        elif val == "Cp quy?n Admin": val = "Cấp quyền Admin"
        elif val == "KhA3a tAi khon": val = "Khóa tài khoản"
        elif val == "MY khA3a": val = "Mở khóa"
        elif val == "Cp quy?n Admin cho ng?i dA1ng nAy?": val = "Cấp quyền Admin cho người dùng này?"
        elif val == "Hy quy?n Admin vA chuyn v? ng?i dA1ng th?ng?": val = "Hủy quyền Admin và chuyển về người dùng thường?"
        elif val == "Bn cA3 ch_c ch_n mu`n khA3a tAi khon nAy?": val = "Bạn có chắc chắn muốn khóa tài khoản này?"
        elif val == "MY khA3a tAi khon nAy?": val = "Mở khóa tài khoản này?"
        elif val == "KhA'ng tAm thy khAch hAng phA1 hp.": val = "Không tìm thấy khách hàng phù hợp."
        elif val == "NhA cung cp AI": val = "Nhà cung cấp AI"
        elif val == "H th`ng `<nh tuyn AI Upstream. _u tiAn cAc gA3i mi.n phA-, s- dng tr phA- khi cn cht lng cao.": val = "Hệ thống định tuyến AI Upstream. Ưu tiên các gói miễn phí, sử dụng trả phí khi cần chất lượng cao."
        elif val == "ThAm nhA cung cp": val = "Thêm nhà cung cấp"
        elif val == "_u tiAn": val = "Ưu tiên"
        elif val == "Chi phA-": val = "Chi phí"
        elif val == "Trng thAi API Key": val = "Trạng thái API Key"
        elif val == "KA-ch hot": val = "Kích hoạt"
        elif val == "?A cu hAnh": val = "Đã cấu hình"
        elif val == "Cha cA3 key": val = "Chưa có key"
        elif val == "Kim tra": val = "Kiểm tra"
        elif val == "Sn dng": val = "Sẵn dụng"
        elif val == "?A cp phAt": val = "Đã cấp phát"
        elif val == "Kh?e mnh": val = "Khỏe mạnh"
        elif val == "Kho khA3a API (Key Pool)": val = "Kho khóa API (Key Pool)"
        elif val == "Qun lA API keys upstream. M-i key `c cp riAng cho khAch hAng, khA'ng dA1ng chung.": val = "Quản lý API keys upstream. Mỗi key được cấp riêng cho khách hàng, không dùng chung."
        elif val == "Nh-p hAng lot": val = "Nhập hàng loạt"
        elif val == "?t li chu k3": val = "Đặt lại chu kỳ"
        elif val == "Tng cTng": val = "Tổng cộng"
        elif val == "Sn dA1ng": val = "Sẵn dùng"
        elif val == "Ht hn mcc": val = "Hết hạn mức"
        elif val == "?A b< cm": val = "Đã bị cấm"
        elif val == "NhAn": val = "Nhãn"
        elif val == "Ch sY h_u": val = "Chủ sở hữu"
        elif val == "?A s- dng": val = "Đã sử dụng"
        elif val == "Kho khA3a `ang tr`ng": val = "Kho khóa đang trống"
        elif val == "Cn A-t nht 1 key trong kho ` khAch hAng cA3 th s- dng AI Cloud.": val = "Cần ít nhất 1 key trong kho để khách hàng có thể sử dụng AI Cloud."
        elif val == "GA3i d<ch v": val = "Gói dịch vụ"
        elif val == "?<nh nghca cAc gA3i subscription. Hn mcc key `c `i?u ch%nh riAng trong Key Pool.": val = "Định nghĩa các gói subscription. Hạn mức key được điều chỉnh riêng trong Key Pool."
        elif val == "ThAm gA3i m>i": val = "Thêm gói mới"
        elif val == "GiA hAng thAng": val = "Giá hàng tháng"
        elif val == "GiA hAng nm": val = "Giá hàng năm"
        elif val == "Hn mcc Token": val = "Hạn mức Token"
        elif val == "Cht lng": val = "Chất lượng"
        elif val == "Ng?i mua": val = "Người mua"
        elif val == "PhAn tA-ch s- dng": val = "Phân tích sử dụng"
        elif val == "PhAn tA-ch lt g?i AI, doanh thu, chi phA- vA li nhu-n theo plugin.": val = "Phân tích lượt gọi AI, doanh thu, chi phí và lợi nhuận theo plugin."
        elif val == "Khong th?i gian": val = "Khoảng thời gian"
        elif val == "ngAy": val = "ngày"
        elif val == "Tng lt g?i": val = "Tổng lượt gọi"
        elif val == "Doanh thu (>c tA-nh)": val = "Doanh thu (ước tính)"
        elif val == "Chi phA- `u vAo": val = "Chi phí đầu vào"
        elif val == "Li nhu-n gTp": val = "Lợi nhuận gộp"
        elif val == "?T tr. trung bAnh": val = "Độ trễ trung bình"
        elif val == "Lu lng theo ngAy": val = "Lưu lượng theo ngày"
        elif val == "ThAnh cA'ng": val = "Thành công"
        elif val == "Tht bi": val = "Thất bại"
        elif val == "PhAn b theo Plugin": val = "Phân bổ theo Plugin"
        elif val == "T tr?ng": val = "Tỷ trọng"
        elif val == "BAo cAo doanh thu": val = "Báo cáo doanh thu"
        elif val == "Theo dAi MRR, ARR, LTV vA t l r?i b?.": val = "Theo dõi MRR, ARR, LTV và tỷ lệ rơi bỏ."
        elif val == "T l r?i b?": val = "Tỷ lệ rơi bỏ"
        elif val == "Doanh thu theo thAng": val = "Doanh thu theo tháng"
        elif val == "Doanh thu theo gA3i": val = "Doanh thu theo gói"
        elif val == "Thanh toAn l-i": val = "Thanh toán lỗi"
        elif val == "HA3a `n": val = "Hóa đơn"
        elif val == "Bn phAt hAnh Plugin": val = "Bản phát hành Plugin"
        elif val == "Qun lA cAc tp ZIP. Plugin khAch hAng s t `Tng kim tra c-p nh-t ti `Ay.": val = "Quản lý các tệp ZIP. Plugin khách hàng sẽ tự động kiểm tra cập nhật tại đây."
        elif val == "PhiAn bn": val = "Phiên bản"
        elif val == "PhAn hng yAu cu": val = "Phân hạng yêu cầu"
        elif val == "KA-ch th>c": val = "Kích thước"
        elif val == "NgAy ti lAn": val = "Ngày tải lên"
        elif val == "\"n `<nh": val = "Ổn định"
        elif val == "?A thu h\"i": val = "Đã thu hồi"
        elif val == "?Anh du n `<nh": val = "Đánh dấu ổn định"
        elif val == "G b?": val = "Gỡ bỏ"
        elif val == "Ti v?": val = "Tải về"
        elif val == "Cha cA3 bn phAt hAnh nAo.": val = "Chưa có bản phát hành nào."
        elif val == "Nh-t kA h th`ng": val = "Nhật ký hệ thống"
        elif val == "Ghi li toAn bT l<ch s- thao tAc ca qun tr< viAn.": val = "Ghi lại toàn bộ lịch sử thao tác của quản trị viên."
        elif val == "Ng?i thc hin": val = "Người thực hiện"
        elif val == "TAi nguyAn": val = "Tài nguyên"
        elif val == "ThA'ng `ip": val = "Thông điệp"
        elif val == "Mcc `T": val = "Mức độ"
        elif val == "Tr>c": val = "Trước"
        elif val == "Sau": val = "Sau"
        elif val == "s kin": val = "sự kiện"
        elif val == "Cha cA3 s kin nAo": val = "Chưa có sự kiện nào"
        elif val == "Nh-t kA s t `Tng c-p nh-t khi cA3 thao tAc qun tr<.": val = "Nhật ký sẽ tự động cập nhật khi có thao tác quản trị."
        elif val == "T ngAy": val = "Từ ngày"
        elif val == "?n ngAy": val = "Đến ngày"
        elif val == "TAm theo ng?i thc hin / nTi dung": val = "Tìm theo người thực hiện / nội dung"
        elif val == "Cu hAnh h th`ng": val = "Cấu hình hệ thống"
        elif val == "Thit l-p cAc tham s` v-n hAnh toAn cu ca Pi Platform.": val = "Thiết lập các tham số vận hành toàn cầu của Pi Platform."
        elif val == "Thng hiu": val = "Thương hiệu"
        elif val == "TAn trang web": val = "Tên trang web"
        elif val == "??ng dn Logo": val = "Đường dẫn Logo"
        elif val == "MAu ch `o": val = "Màu chủ đạo"
        elif val == "Email h- tr": val = "Email hỗ trợ"
        elif val == "Lu cu hAnh": val = "Lưu cấu hình"
        elif val == "GA3i Token": val = "Gói Token"
        elif val == "TA-nh nng (Flags)": val = "Tính năng (Flags)"
        elif val == "Lu trng thAi": val = "Lưu trạng thái"
        elif val == "TAc v t `Tng (Cron)": val = "Tác vụ tự động (Cron)"
        elif val == "Qun lA cAc tin trAnh chy ngm theo l<ch trAnh.": val = "Quản lý các tiến trình chạy ngầm theo lịch trình."
        elif val == "Chy ngay": val = "Chạy ngay"
        elif val == "?ang chy...": val = "Đang chạy..."
        elif val == "TAc v": val = "Tác vụ"
        elif val == "L<ch trAnh": val = "Lịch trình"
        elif val == "Cha bao gi? chy": val = "Chưa bao giờ chạy"
        elif val == "Bo m-t (MA'i tr?ng)": val = "Bảo mật (Môi trường)"
        elif val == "CAc giA tr< `?c t bin mA'i tr?ng, khA'ng lu trong c sY d_ liu.": val = "Các giá trị đọc từ biến môi trường, không lưu trong cơ sở dữ liệu."
        elif val == "Cho phAcp `ng kA tAi khon m>i": val = "Cho phép đăng ký tài khoản mới"
        elif val == "B-t np ti?n (Stripe Checkout)": val = "Bật nạp tiền (Stripe Checkout)"
        elif val == "B-t ch cng dng (/catalog)": val = "Bật chợ ứng dụng (/catalog)"
        elif val == "Ch `T bo trA (Maintenance Mode)": val = "Chế độ bảo trì (Maintenance Mode)"

        return '"' + val + '"'

    new_vi_block = re.sub(r'"([^"]+)"', replace_in_string, vi_block)
    text = text.replace(vi_block, new_vi_block)

with open(r'C:\Users\Administrator\Local Sites\saigonhouse\app\public\wp-content\pi-store-webapp\src\lib\adminI18n.js', 'w', encoding='utf-8') as f:
    f.write(text)
