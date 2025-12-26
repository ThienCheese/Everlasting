-- 1. Xóa dữ liệu cũ (Xóa bảng con trước, bảng cha sau để tránh lỗi khóa ngoại)
DELETE FROM public."MONAN";
DELETE FROM public."LOAIMONAN";

-- 2. Reset lại ID của bảng Loại Món (để bắt đầu từ 1)
ALTER SEQUENCE "LOAIMONAN_MaLoaiMonAn_seq" RESTART WITH 1;

-- 3. Thêm dữ liệu Loại Món
INSERT INTO public."LOAIMONAN" ("MaLoaiMonAn", "TenLoaiMonAn") VALUES
(1, 'Khai vị'),
(2, 'Món chính'),
(3, 'Tráng miệng'),
(4, 'Nước uống'),
(5, 'Món chay');

-- Cập nhật lại Sequence cho Loại Món (để lần sau thêm mới sẽ bắt đầu từ 6)
SELECT setval('"LOAIMONAN_MaLoaiMonAn_seq"', 5, true);

-- 4. Thêm dữ liệu Món Ăn
-- Lưu ý: Dùng dấu nháy đơn ' cho chuỗi ký tự trong SQL
INSERT INTO public."MONAN" ("TenMonAn", "MaLoaiMonAn", "DonGia", "GhiChu", "AnhURL") VALUES
-- KHAI VỊ (MaLoaiMonAn: 1)
('Gỏi Ngó Sen Tôm Thịt', 1, 350000, 'Ngó sen giòn, tôm tươi và thịt ba chỉ hòa quyện cùng nước mắm chua ngọt.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494517/app_uploads/lojwfahlm96nsv2z8dfg.jpg'),
('Súp Cua Băng Tuyết', 1, 400000, 'Súp cua sánh mịn nấu cùng nấm đông cô, trứng cút và tóc tiên.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494658/app_uploads/tyldt3qhdrlucgnssm7v.jpg'),
('Chả Giò Hải Sản Mayonnaise', 1, 320000, 'Vỏ bánh giòn rụm, nhân hải sản tươi kết hợp sốt mayonnaise béo ngậy.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494982/app_uploads/kqgedo6orzcjmgalroaw.jpg'),
('Gỏi Bò Bóp Thấu', 1, 300000, 'Thịt bò tái chanh mềm ngọt trộn cùng khế chua, chuối chát và hành tây.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495702/app_uploads/adt9uv19287r9oqbes3n.webp'),
('Súp Hải Sản Tóc Tiên', 1, 380000, 'Súp ngọt thanh từ hải sản tươi (tôm, mực) nấu cùng tóc tiên và trứng gà.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495599/app_uploads/ryo8plypc37qnr3looi1.webp'),
('Chả Phượng Hoàng', 1, 350000, 'Chả giò được tạo hình chim phượng hoàng đẹp mắt, nhân thịt và rau củ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495738/app_uploads/tda51vy0ektp0mdkkfhd.jpg'),
('Nem Nướng Cây Sả', 1, 280000, 'Thịt heo xay quết dẻo, nướng trên cây sả thơm lừng, ăn kèm tương đậu.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495770/app_uploads/ptxc9m4nxjm0hsqoumoe.jpg'),
('Salad Nga', 1, 250000, 'Rau củ quả luộc chín trộn sốt mayonnaise béo ngậy.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495805/app_uploads/ftmfuc3e27gbgbjgttvy.webp'),
('Mực Chiên Xù Sốt Tartar', 1, 320000, 'Mực vòng tẩm bột chiên xù giòn tan, chấm sốt Tartar béo ngậy kiểu Âu.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496333/app_uploads/tjim1q5f7s9qfkauuwyj.png'),
('Bacon Cuộn Tôm Nướng', 1, 360000, 'Tôm sú tươi được cuộn trong thịt xông khói nướng vàng thơm phức.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495917/app_uploads/yrklkdlgxsv5pbhon6kb.png'),
('Gỏi Sứa Tôm Thịt', 1, 300000, 'Sứa biển giòn sần sật trộn với tôm, thịt ba chỉ và các loại rau thơm.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496493/app_uploads/dblesluxqmstcvlcbns9.png'),
('Chả Giò Trái Cây', 1, 250000, 'Biến tấu lạ miệng với nhân trái cây và sốt mayonnaise, vỏ giòn.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496555/app_uploads/xfqj1tiajhscrwb33xkr.jpg'),

-- MÓN CHÍNH (MaLoaiMonAn: 2)
('Gà Quay Sốt Cam', 2, 450000, 'Gà ta quay da giòn, thấm vị sốt cam chua ngọt đặc biệt.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498652/app_uploads/llwth6rdljw4f86odico.webp'),
('Bò Sốt Vang Bánh Mì', 2, 500000, 'Thịt bò nạm pha gân hầm mềm với rượu vang đỏ, khoai tây, cà rốt.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498759/app_uploads/alqgkdyt5glibjo2ebqp.jpg'),
('Cá Chẽm Hấp Hồng Kông', 2, 550000, 'Cá chẽm tươi sống hấp xì dầu, gừng, hành lá, giữ trọn vị ngọt tự nhiên.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498759/app_uploads/alqgkdyt5glibjo2ebqp.jpg'),
('Lẩu Thái Hải Sản', 2, 600000, 'Nước lẩu chua cay chuẩn vị Thái, nhúng kèm tôm, mực, nghêu, nấm.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499379/app_uploads/sxujzo3ia9qhdp23tafx.jpg'),
('Bò Lúc Lắc Khoai Tây', 2, 480000, 'Thịt bò thăn cắt vuông xào lửa lớn với ớt chuông, ăn kèm khoai tây chiên.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499092/app_uploads/p9elpwcmgqptffepf492.jpg'),
('Vịt Quay Bắc Kinh', 2, 650000, 'Vịt quay da giòn bóng bẩy, thịt mềm, kèm bánh bao và nước chấm hoisin.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499169/app_uploads/hmwsg5qyqtq27yftys7h.jpg'),
('Gà Hấp Lá Chanh', 2, 400000, 'Gà ta hấp nguyên con giữ độ ngọt, da vàng ươm, thơm nồng mùi lá chanh.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499224/app_uploads/mg5ufd80pzubcx82ksg4.jpg'),
('Tôm Hùm Baby Hấp Tỏi', 2, 950000, 'Tôm hùm size nhỏ hấp cách thủy với tỏi phi thơm lừng và bơ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499306/app_uploads/p4zwppmjectgkhvzil9g.jpg'),
('Cá Tầm Nướng Muối Ớt', 2, 700000, 'Cá tầm sapa thịt dai, nướng trên than hồng với muối ớt xiêm xanh cay nồng.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499336/app_uploads/x4zs7tbhnwvgrnkj0gbe.webp'),
('Lẩu Uyên Ương', 2, 650000, 'Lẩu 2 ngăn với một bên cay nồng Tứ Xuyên và một bên thanh ngọt hầm xương.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499044/app_uploads/d9i9bgpdg9junao3cdkq.png'),
('Heo Rừng Xào Lăn', 2, 420000, 'Thịt heo rừng giòn da xào với cốt dừa, cà ri, mộc nhĩ và miến dong.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499433/app_uploads/pc139xplxoguiiiv7cxk.jpg'),
('Sườn Cừu Nướng Mật Ong', 2, 850000, 'Sườn cừu nhập khẩu nướng cháy cạnh với sốt mật ong và lá hương thảo.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499485/app_uploads/yr8qjkwt4hgflzcuqffm.jpg'),

-- TRÁNG MIỆNG (MaLoaiMonAn: 3)
('Chè Hạt Sen Long Nhãn', 3, 150000, 'Hạt sen bùi bùi nấu cùng nhãn lồng hưng yên, vị ngọt thanh mát.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500810/app_uploads/dfjmebdflfc4now6fnqu.jpg'),
('Rau Câu Trái Cây', 3, 120000, 'Rau câu dẻo thơm mát lạnh với các loại trái cây nhiệt đới cắt hạt lựu.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500858/app_uploads/gpbzkxvibxnjyl0pshtm.webp'),
('Chè Thái Sầu Riêng', 3, 80000, 'Chè thái với các loại thạch, mít, nhãn và cơm sầu riêng thơm nức mũi.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500916/app_uploads/e6s25oavw2j1aiexknmg.jpg'),
('Sâm Bổ Lượng', 3, 70000, 'Món chè thanh mát với rong biển, bo bo, hạt sen, nhãn nhục, táo đỏ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500945/app_uploads/yfqnehoaqnruwrouxtc4.jpg'),
('Bánh Flan Caramel', 3, 60000, 'Bánh flan trứng sữa mềm mịn, béo ngậy phủ lớp caramel đắng nhẹ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500980/app_uploads/s0rwo1jzlukzizdmnpu3.jpg'),
('Tiramisu Ý', 3, 120000, 'Bánh tráng miệng vị cà phê, rượu rum và phô mai mascarpone béo ngậy.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501054/app_uploads/iyvdqor11n3qxq8s5ktt.jpg'),
('Trái Cây Thập Cẩm', 3, 150000, 'Đĩa trái cây mùa nào thức nấy (Dưa hấu, ổi, xoài, thanh long) cắt sẵn.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501108/app_uploads/myhrtyreh7lxvjs8aewh.jpg'),
('Chè Trôi Nước', 3, 60000, 'Viên trôi nước dẻo nhân đậu xanh, chan nước cốt dừa và mè rang.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501147/app_uploads/gwh7aokfl4zvhpfazkmt.jpg'),
('Kem Nhãn', 3, 80000, 'Kem tươi vị nhãn lồng, có cơm nhãn giòn ngọt bên trong.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501178/app_uploads/lmdyvi1vsaacu7yt5hob.jpg'),
('Bánh Su Kem', 3, 90000, 'Bánh vỏ mỏng nhân kem custard vani mát lạnh, ngọt dịu.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501221/app_uploads/a2olflbocaojxv9c14zy.jpg'),
('Chè Bưởi An Giang', 3, 70000, 'Cùi bưởi giòn sần sật nấu với đậu xanh cà vỏ và nước cốt dừa.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501258/app_uploads/fxt2ereel3d1xtrsoljv.jpg'),
('Bánh Tart Trứng', 3, 100000, 'Bánh nướng vỏ ngàn lớp giòn rụm, nhân trứng sữa nướng xém mặt.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501301/app_uploads/hedzv9cn4qtflks9xjkf.jpg'),

-- NƯỚC UỐNG (MaLoaiMonAn: 4)
('Bia Heineken (Thùng)', 4, 480000, 'Bia Heineken ướp lạnh, phục vụ theo thùng hoặc két cho bàn tiệc.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549028/app_uploads/f7fhhipcbtbkmaaunku9.png'),
('Nước Ngọt Coca-Cola', 4, 20000, 'Nước ngọt có gas chai lớn hoặc lon, phù hợp cho trẻ em và phụ nữ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549075/app_uploads/fiy4mktgdzzujedj0hfz.webp'),
('Bia Sài Gòn Special', 4, 450000, 'Bia Sài Gòn lùn, vị đậm đà truyền thống (24 lon/thùng).', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549178/app_uploads/sgn5uyuexifdjpki8cnv.png'),
('Bia 333 (Thùng)', 4, 420000, 'Bia lon 333 thương hiệu Việt quen thuộc (24 lon/thùng).', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549209/app_uploads/r6nhq5jjmsaeehwjhmes.png'),
('Rượu Vang Trắng', 4, 380000, 'Rượu vang trắng ướp lạnh, hương trái cây, hợp với hải sản.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549236/app_uploads/vkq9cgofadnwuihzkbmm.jpg'),
('Nước Ngọt 7Up', 4, 240000, 'Nước ngọt vị chanh có gas, giải khát tốt (24 lon/thùng).', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549273/app_uploads/ztkxqpj8ipxiumuco8pk.png'),
('Nước Cam Ép', 4, 30000, 'Nước cam ép có tép cam tự nhiên, chai 330ml.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549304/app_uploads/fipt4wvqrmha6rvm7rzy.png'),
('Trà Ô Long Plus', 4, 25000, 'Trà ô long đóng chai, giúp thanh nhiệt giải độc cơ thể.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549342/app_uploads/djhcgfytfezzeumhna3y.jpg'),
('Rượu Champagne Nổ', 4, 600000, 'Rượu vang nổ dùng để khai tiệc, tạo không khí sang trọng.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550450/app_uploads/f1cvwksjwfzbqyb3xyxn.webp'),
('Nước Ép Dưa Hấu', 4, 120000, 'Nước ép dưa hấu tươi nguyên chất, phục vụ theo bình 1.5 lít.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550480/app_uploads/htqja6tugphwsumcqtds.webp'),
('Sting Dâu', 4, 260000, 'Nước tăng lực hương dâu tây, được giới trẻ ưa chuộng.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550499/app_uploads/dii5o4xinncqi4zgqw74.png'),
('Rượu Vodka Hà Nội', 4, 180000, 'Rượu mạnh truyền thống, nồng độ cồn cao, chai 500ml.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550524/app_uploads/lc6khacpjk58evzl8kwm.jpg'),

-- MÓN CHAY (MaLoaiMonAn: 5)
('Súp Măng Tây Cua Chay', 5, 200000, 'Súp nấu từ măng tây xanh và thịt cua chay làm từ đậu hũ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551061/app_uploads/s3xhgtsfndxhrdqu9uzw.jpg'),
('Cơm Chiên Lá Sen Chay', 5, 220000, 'Cơm chiên hạt sen, cà rốt, đậu que được gói trong lá sen thơm ngát.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551106/app_uploads/mwzyld2ynuhjf9gmh5vz.jpg'),
('Nem Cua Bể Chay', 5, 180000, 'Nem gói hình vuông với nhân nấm, miến, tàu hũ ky giả thịt cua.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551200/app_uploads/vgsjz0qpfor66pvxzdjo.jpg'),
('Gỏi Cuốn Chay', 5, 120000, 'Bánh tráng cuốn bún, rau sống và tàu hũ chiên, chấm tương đen.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551231/app_uploads/yobtc9i6jpwakcrlghz6.jpg'),
('Lẩu Thái Chay', 5, 350000, 'Nước lẩu chua cay nấu từ thơm, cà chua, nhúng nấm và tàu hũ.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551267/app_uploads/yhouh5n9hyidy8myj3uo.jpg'),
('Cơm Chiên Dương Châu Chay', 5, 180000, 'Cơm chiên với đậu que, cà rốt, chả lụa chay cắt hạt lựu.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551297/app_uploads/azy5w2ygbyr64ctyweyz.jpg'),
('Mì Xào Mềm Chay', 5, 170000, 'Mì trứng xào với cải ngọt, bông cải xanh và nấm đông cô sốt dầu hào chay.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551330/app_uploads/rvuieebxrzcwjsqqgd0m.jpg'),
('Đậu Hũ Kho Nấm Rơm', 5, 140000, 'Đậu hũ chiên kho tộ với nấm rơm, tiêu xanh, vị đậm đà ăn với cơm trắng.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551364/app_uploads/v2fdyyo8tdumka53ceju.jpg'),
('Canh Rong Biển Đậu Hũ', 5, 130000, 'Canh thanh đạm nấu từ rong biển khô và đậu hũ non.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551364/app_uploads/v2fdyyo8tdumka53ceju.jpg'),
('Sườn Non Chay Rim Mặn', 5, 160000, 'Sườn non làm từ đạm đậu nành, chiên giòn rồi rim nước mắm chay.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551510/app_uploads/szlioe8hmtcctdgcyg04.webp'),
('Chả Giò Bắp Chay', 5, 150000, 'Chả giò nhân bắp Mỹ ngọt tự nhiên, vỏ giòn tan.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551534/app_uploads/stjwbulqrkhjmbrw2xfv.jpg'),
('Nấm Bào Ngư Xào Sả Ớt', 5, 160000, 'Nấm bào ngư xám xào lửa lớn với sả băm và ớt, vị cay thơm.', 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551560/app_uploads/wro2julrakwnezjqqb7o.png');