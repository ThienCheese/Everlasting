/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // --- PHẦN 1: XÓA DỮ LIỆU CŨ (QUAN TRỌNG: ĐÚNG THỨ TỰ) ---
  
  // // 1. Xóa các bảng con đang tham chiếu tới MONAN trước
  // // (Nếu không xóa dòng này sẽ bị lỗi foreign key constraint)
  // await knex('THUCDON_MONAN').del();
  
  // // Kiểm tra Schema của bạn, có thể còn bảng này cũng tham chiếu tới MONAN
  // // Nếu có lỗi tương tự với bảng CHITIET_THUCDONMAU, hãy bỏ comment dòng dưới:
  // await knex('CHITIET_THUCDONMAU').del(); 

  // // 2. Sau khi sạch bảng con, mới được xóa bảng MONAN
  // await knex('MONAN').del();

  // // 3. Cuối cùng mới xóa bảng LOAIMONAN (Vì MONAN tham chiếu tới nó)
  // await knex('LOAIMONAN').del(); 
  await knex('DATTIEC_DICHVU').del();
  await knex('CHITIET_THUCDONMAU').del();
  await knex('THUCDON_MAU').del();
  await knex('THUCDON_MONAN').del();
  await knex('DICHVU').del();
  await knex('MONAN').del();
  await knex('LOAIDICHVU').del();
  await knex('LOAIMONAN').del();


  // --- PHẦN 2: THÊM DỮ LIỆU LOẠI MÓN ---
  await knex('LOAIMONAN').insert([
    { MaLoaiMonAn: 1, TenLoaiMonAn: 'Khai vị' },
    { MaLoaiMonAn: 2, TenLoaiMonAn: 'Món chính' },
    { MaLoaiMonAn: 3, TenLoaiMonAn: 'Tráng miệng' },
    { MaLoaiMonAn: 4, TenLoaiMonAn: 'Nước uống' },
    { MaLoaiMonAn: 5, TenLoaiMonAn: 'Món chay' }
  ]);

  // Reset Sequence cho Loại Món (Để tránh lỗi trùng ID sau này)
  await knex.raw('SELECT setval(\'"LOAIMONAN_MaLoaiMonAn_seq"\', 5, true)');

  // --- PHẦN 3: THÊM DỮ LIỆU MÓN ĂN ---
  await knex('MONAN').insert([
    // ================== 1. KHAI VỊ (MaLoaiMonAn: 1) ==================
    {
      TenMonAn: 'Gỏi Ngó Sen Tôm Thịt',
      MaLoaiMonAn: 1,
      DonGia: 350000,
      GhiChu: 'Ngó sen giòn, tôm tươi và thịt ba chỉ hòa quyện cùng nước mắm chua ngọt.',
      AnhURL: 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494517/app_uploads/lojwfahlm96nsv2z8dfg.jpg'
    },
    {
      TenMonAn: 'Súp Cua Băng Tuyết',
      MaLoaiMonAn: 1,
      DonGia: 400000,
      GhiChu: 'Súp cua sánh mịn nấu cùng nấm đông cô, trứng cút và tóc tiên.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494658/app_uploads/tyldt3qhdrlucgnssm7v.jpg"
    },
    {
      TenMonAn: 'Chả Giò Hải Sản Mayonnaise',
      MaLoaiMonAn: 1,
      DonGia: 320000,
      GhiChu: 'Vỏ bánh giòn rụm, nhân hải sản tươi kết hợp sốt mayonnaise béo ngậy.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766494982/app_uploads/kqgedo6orzcjmgalroaw.jpg"
    },
    {
      TenMonAn: 'Gỏi Bò Bóp Thấu',
      MaLoaiMonAn: 1,
      DonGia: 300000,
      GhiChu: 'Thịt bò tái chanh mềm ngọt trộn cùng khế chua, chuối chát và hành tây.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495702/app_uploads/adt9uv19287r9oqbes3n.webp"
    },
    {
      TenMonAn: 'Súp Hải Sản Tóc Tiên',
      MaLoaiMonAn: 1,
      DonGia: 380000,
      GhiChu: 'Súp ngọt thanh từ hải sản tươi (tôm, mực) nấu cùng tóc tiên và trứng gà.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495599/app_uploads/ryo8plypc37qnr3looi1.webp"
    },
    {
      TenMonAn: 'Chả Phượng Hoàng',
      MaLoaiMonAn: 1,
      DonGia: 350000,
      GhiChu: 'Chả giò được tạo hình chim phượng hoàng đẹp mắt, nhân thịt và rau củ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495738/app_uploads/tda51vy0ektp0mdkkfhd.jpg"
    },
    {
      TenMonAn: 'Nem Nướng Cây Sả',
      MaLoaiMonAn: 1,
      DonGia: 280000,
      GhiChu: 'Thịt heo xay quết dẻo, nướng trên cây sả thơm lừng, ăn kèm tương đậu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495770/app_uploads/ptxc9m4nxjm0hsqoumoe.jpg"
    },
    {
      TenMonAn: 'Salad Nga',
      MaLoaiMonAn: 1,
      DonGia: 250000,
      GhiChu: 'Rau củ quả luộc chín trộn sốt mayonnaise béo ngậy.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495805/app_uploads/ftmfuc3e27gbgbjgttvy.webp"
    },
    {
      TenMonAn: 'Mực Chiên Xù Sốt Tartar',
      MaLoaiMonAn: 1,
      DonGia: 320000,
      GhiChu: 'Mực vòng tẩm bột chiên xù giòn tan, chấm sốt Tartar béo ngậy kiểu Âu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496333/app_uploads/tjim1q5f7s9qfkauuwyj.png"
    },
    {
      TenMonAn: 'Bacon Cuộn Tôm Nướng',
      MaLoaiMonAn: 1,
      DonGia: 360000,
      GhiChu: 'Tôm sú tươi được cuộn trong thịt xông khói nướng vàng thơm phức.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766495917/app_uploads/yrklkdlgxsv5pbhon6kb.png"
    },
    {
      TenMonAn: 'Gỏi Sứa Tôm Thịt',
      MaLoaiMonAn: 1,
      DonGia: 300000,
      GhiChu: 'Sứa biển giòn sần sật trộn với tôm, thịt ba chỉ và các loại rau thơm.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496493/app_uploads/dblesluxqmstcvlcbns9.png"
    },
    {
      TenMonAn: 'Chả Giò Trái Cây',
      MaLoaiMonAn: 1,
      DonGia: 250000,
      GhiChu: 'Biến tấu lạ miệng với nhân trái cây và sốt mayonnaise, vỏ giòn.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766496555/app_uploads/xfqj1tiajhscrwb33xkr.jpg"
    },

    // ================== 2. MÓN CHÍNH (MaLoaiMonAn: 2) ==================
    {
      TenMonAn: 'Gà Quay Sốt Cam',
      MaLoaiMonAn: 2,
      DonGia: 450000,
      GhiChu: 'Gà ta quay da giòn, thấm vị sốt cam chua ngọt đặc biệt.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498652/app_uploads/llwth6rdljw4f86odico.webp"
    },
    {
      TenMonAn: 'Bò Sốt Vang Bánh Mì',
      MaLoaiMonAn: 2,
      DonGia: 500000,
      GhiChu: 'Thịt bò nạm pha gân hầm mềm với rượu vang đỏ, khoai tây, cà rốt.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498759/app_uploads/alqgkdyt5glibjo2ebqp.jpg"
    },
    {
      TenMonAn: 'Cá Chẽm Hấp Hồng Kông',
      MaLoaiMonAn: 2,
      DonGia: 550000,
      GhiChu: 'Cá chẽm tươi sống hấp xì dầu, gừng, hành lá, giữ trọn vị ngọt tự nhiên.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766498759/app_uploads/alqgkdyt5glibjo2ebqp.jpg"
    },
    {
      TenMonAn: 'Lẩu Thái Hải Sản',
      MaLoaiMonAn: 2,
      DonGia: 600000,
      GhiChu: 'Nước lẩu chua cay chuẩn vị Thái, nhúng kèm tôm, mực, nghêu, nấm.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499379/app_uploads/sxujzo3ia9qhdp23tafx.jpg"
    },
    {
      TenMonAn: 'Bò Lúc Lắc Khoai Tây',
      MaLoaiMonAn: 2,
      DonGia: 480000,
      GhiChu: 'Thịt bò thăn cắt vuông xào lửa lớn với ớt chuông, ăn kèm khoai tây chiên.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499092/app_uploads/p9elpwcmgqptffepf492.jpg"
    },
    {
      TenMonAn: 'Vịt Quay Bắc Kinh',
      MaLoaiMonAn: 2,
      DonGia: 650000,
      GhiChu: 'Vịt quay da giòn bóng bẩy, thịt mềm, kèm bánh bao và nước chấm hoisin.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499169/app_uploads/hmwsg5qyqtq27yftys7h.jpg"
    },
    {
      TenMonAn: 'Gà Hấp Lá Chanh',
      MaLoaiMonAn: 2,
      DonGia: 400000,
      GhiChu: 'Gà ta hấp nguyên con giữ độ ngọt, da vàng ươm, thơm nồng mùi lá chanh.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499224/app_uploads/mg5ufd80pzubcx82ksg4.jpg"
    },
    {
      TenMonAn: 'Tôm Hùm Baby Hấp Tỏi',
      MaLoaiMonAn: 2,
      DonGia: 950000,
      GhiChu: 'Tôm hùm size nhỏ hấp cách thủy với tỏi phi thơm lừng và bơ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499306/app_uploads/p4zwppmjectgkhvzil9g.jpg"
    },
    {
      TenMonAn: 'Cá Tầm Nướng Muối Ớt',
      MaLoaiMonAn: 2,
      DonGia: 700000,
      GhiChu: 'Cá tầm sapa thịt dai, nướng trên than hồng với muối ớt xiêm xanh cay nồng.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499336/app_uploads/x4zs7tbhnwvgrnkj0gbe.webp"
    },
    {
      TenMonAn: 'Lẩu Uyên Ương',
      MaLoaiMonAn: 2,
      DonGia: 650000,
      GhiChu: 'Lẩu 2 ngăn với một bên cay nồng Tứ Xuyên và một bên thanh ngọt hầm xương.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499044/app_uploads/d9i9bgpdg9junao3cdkq.png"
    },
    {
      TenMonAn: 'Heo Rừng Xào Lăn',
      MaLoaiMonAn: 2,
      DonGia: 420000,
      GhiChu: 'Thịt heo rừng giòn da xào với cốt dừa, cà ri, mộc nhĩ và miến dong.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499433/app_uploads/pc139xplxoguiiiv7cxk.jpg"
    },
    {
      TenMonAn: 'Sườn Cừu Nướng Mật Ong',
      MaLoaiMonAn: 2,
      DonGia: 850000,
      GhiChu: 'Sườn cừu nhập khẩu nướng cháy cạnh với sốt mật ong và lá hương thảo.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766499485/app_uploads/yr8qjkwt4hgflzcuqffm.jpg"
    },

    // ================== 3. TRÁNG MIỆNG (MaLoaiMonAn: 3) ==================
    {
      TenMonAn: 'Chè Hạt Sen Long Nhãn',
      MaLoaiMonAn: 3,
      DonGia: 150000,
      GhiChu: 'Hạt sen bùi bùi nấu cùng nhãn lồng hưng yên, vị ngọt thanh mát.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500810/app_uploads/dfjmebdflfc4now6fnqu.jpg"
    },
    {
      TenMonAn: 'Rau Câu Trái Cây',
      MaLoaiMonAn: 3,
      DonGia: 120000,
      GhiChu: 'Rau câu dẻo thơm mát lạnh với các loại trái cây nhiệt đới cắt hạt lựu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500858/app_uploads/gpbzkxvibxnjyl0pshtm.webp"
    },
    {
      TenMonAn: 'Chè Thái Sầu Riêng',
      MaLoaiMonAn: 3,
      DonGia: 80000,
      GhiChu: 'Chè thái với các loại thạch, mít, nhãn và cơm sầu riêng thơm nức mũi.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500916/app_uploads/e6s25oavw2j1aiexknmg.jpg"
    },
    {
      TenMonAn: 'Sâm Bổ Lượng',
      MaLoaiMonAn: 3,
      DonGia: 70000,
      GhiChu: 'Món chè thanh mát với rong biển, bo bo, hạt sen, nhãn nhục, táo đỏ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500945/app_uploads/yfqnehoaqnruwrouxtc4.jpg"
    },
    {
      TenMonAn: 'Bánh Flan Caramel',
      MaLoaiMonAn: 3,
      DonGia: 60000,
      GhiChu: 'Bánh flan trứng sữa mềm mịn, béo ngậy phủ lớp caramel đắng nhẹ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766500980/app_uploads/s0rwo1jzlukzizdmnpu3.jpg"
    },
    {
      TenMonAn: 'Tiramisu Ý',
      MaLoaiMonAn: 3,
      DonGia: 120000,
      GhiChu: 'Bánh tráng miệng vị cà phê, rượu rum và phô mai mascarpone béo ngậy.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501054/app_uploads/iyvdqor11n3qxq8s5ktt.jpg"
    },
    {
      TenMonAn: 'Trái Cây Thập Cẩm',
      MaLoaiMonAn: 3,
      DonGia: 150000,
      GhiChu: 'Đĩa trái cây mùa nào thức nấy (Dưa hấu, ổi, xoài, thanh long) cắt sẵn.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501108/app_uploads/myhrtyreh7lxvjs8aewh.jpg"
    },
    {
      TenMonAn: 'Chè Trôi Nước',
      MaLoaiMonAn: 3,
      DonGia: 60000,
      GhiChu: 'Viên trôi nước dẻo nhân đậu xanh, chan nước cốt dừa và mè rang.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501147/app_uploads/gwh7aokfl4zvhpfazkmt.jpg"
    },
    {
      TenMonAn: 'Kem Nhãn',
      MaLoaiMonAn: 3,
      DonGia: 80000,
      GhiChu: 'Kem tươi vị nhãn lồng, có cơm nhãn giòn ngọt bên trong.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501178/app_uploads/lmdyvi1vsaacu7yt5hob.jpg"
    },
    {
      TenMonAn: 'Bánh Su Kem',
      MaLoaiMonAn: 3,
      DonGia: 90000,
      GhiChu: 'Bánh vỏ mỏng nhân kem custard vani mát lạnh, ngọt dịu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501221/app_uploads/a2olflbocaojxv9c14zy.jpg"
    },
    {
      TenMonAn: 'Chè Bưởi An Giang',
      MaLoaiMonAn: 3,
      DonGia: 70000,
      GhiChu: 'Cùi bưởi giòn sần sật nấu với đậu xanh cà vỏ và nước cốt dừa.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501258/app_uploads/fxt2ereel3d1xtrsoljv.jpg"
    },
    {
      TenMonAn: 'Bánh Tart Trứng',
      MaLoaiMonAn: 3,
      DonGia: 100000,
      GhiChu: 'Bánh nướng vỏ ngàn lớp giòn rụm, nhân trứng sữa nướng xém mặt.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766501301/app_uploads/hedzv9cn4qtflks9xjkf.jpg"
    },

    // ================== 4. NƯỚC UỐNG (MaLoaiMonAn: 4) ==================
    {
      TenMonAn: 'Bia Heineken (Thùng)',
      MaLoaiMonAn: 4,
      DonGia: 480000,
      GhiChu: 'Bia Heineken ướp lạnh, phục vụ theo thùng hoặc két cho bàn tiệc.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549028/app_uploads/f7fhhipcbtbkmaaunku9.png"
    },
    {
      TenMonAn: 'Nước Ngọt Coca-Cola',
      MaLoaiMonAn: 4,
      DonGia: 20000,
      GhiChu: 'Nước ngọt có gas chai lớn hoặc lon, phù hợp cho trẻ em và phụ nữ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549075/app_uploads/fiy4mktgdzzujedj0hfz.webp"
    },
    {
      TenMonAn: 'Bia Sài Gòn Special',
      MaLoaiMonAn: 4,
      DonGia: 450000,
      GhiChu: 'Bia Sài Gòn lùn, vị đậm đà truyền thống (24 lon/thùng).',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549178/app_uploads/sgn5uyuexifdjpki8cnv.png"
    },
    {
      TenMonAn: 'Bia 333 (Thùng)',
      MaLoaiMonAn: 4,
      DonGia: 420000,
      GhiChu: 'Bia lon 333 thương hiệu Việt quen thuộc (24 lon/thùng).',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549209/app_uploads/r6nhq5jjmsaeehwjhmes.png"
    },
    {
      TenMonAn: 'Rượu Vang Trắng',
      MaLoaiMonAn: 4,
      DonGia: 380000,
      GhiChu: 'Rượu vang trắng ướp lạnh, hương trái cây, hợp với hải sản.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549236/app_uploads/vkq9cgofadnwuihzkbmm.jpg"
    },
    {
      TenMonAn: 'Nước Ngọt 7Up',
      MaLoaiMonAn: 4,
      DonGia: 240000,
      GhiChu: 'Nước ngọt vị chanh có gas, giải khát tốt (24 lon/thùng).',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549273/app_uploads/ztkxqpj8ipxiumuco8pk.png"
    },
    {
      TenMonAn: 'Nước Cam Ép',
      MaLoaiMonAn: 4,
      DonGia: 30000,
      GhiChu: 'Nước cam ép có tép cam tự nhiên, chai 330ml.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549304/app_uploads/fipt4wvqrmha6rvm7rzy.png"
    },
    {
      TenMonAn: 'Trà Ô Long Plus',
      MaLoaiMonAn: 4,
      DonGia: 25000,
      GhiChu: 'Trà ô long đóng chai, giúp thanh nhiệt giải độc cơ thể.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766549342/app_uploads/djhcgfytfezzeumhna3y.jpg"
    },
    {
      TenMonAn: 'Rượu Champagne Nổ',
      MaLoaiMonAn: 4,
      DonGia: 600000,
      GhiChu: 'Rượu vang nổ dùng để khai tiệc, tạo không khí sang trọng.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550450/app_uploads/f1cvwksjwfzbqyb3xyxn.webp"
    },
    {
      TenMonAn: 'Nước Ép Dưa Hấu',
      MaLoaiMonAn: 4,
      DonGia: 120000,
      GhiChu: 'Nước ép dưa hấu tươi nguyên chất, phục vụ theo bình 1.5 lít.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550480/app_uploads/htqja6tugphwsumcqtds.webp"
    },
    {
      TenMonAn: 'Sting Dâu',
      MaLoaiMonAn: 4,
      DonGia: 260000,
      GhiChu: 'Nước tăng lực hương dâu tây, được giới trẻ ưa chuộng.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550499/app_uploads/dii5o4xinncqi4zgqw74.png"
    },
    {
      TenMonAn: 'Rượu Vodka Hà Nội',
      MaLoaiMonAn: 4,
      DonGia: 180000,
      GhiChu: 'Rượu mạnh truyền thống, nồng độ cồn cao, chai 500ml.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766550524/app_uploads/lc6khacpjk58evzl8kwm.jpg"
    },

    {
      TenMonAn: 'Súp Măng Tây Cua Chay',
      MaLoaiMonAn: 5,
      DonGia: 200000,
      GhiChu: 'Súp nấu từ măng tây xanh và thịt cua chay làm từ đậu hũ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551061/app_uploads/s3xhgtsfndxhrdqu9uzw.jpg"
    },
    {
      TenMonAn: 'Cơm Chiên Lá Sen Chay',
      MaLoaiMonAn: 5,
      DonGia: 220000,
      GhiChu: 'Cơm chiên hạt sen, cà rốt, đậu que được gói trong lá sen thơm ngát.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551106/app_uploads/mwzyld2ynuhjf9gmh5vz.jpg"
    },
    {
      TenMonAn: 'Nem Cua Bể Chay',
      MaLoaiMonAn: 5,
      DonGia: 180000,
      GhiChu: 'Nem gói hình vuông với nhân nấm, miến, tàu hũ ky giả thịt cua.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551200/app_uploads/vgsjz0qpfor66pvxzdjo.jpg"
    },
    {
      TenMonAn: 'Gỏi Cuốn Chay',
      MaLoaiMonAn: 5,
      DonGia: 120000,
      GhiChu: 'Bánh tráng cuốn bún, rau sống và tàu hũ chiên, chấm tương đen.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551231/app_uploads/yobtc9i6jpwakcrlghz6.jpg"
    },
    {
      TenMonAn: 'Lẩu Thái Chay',
      MaLoaiMonAn: 5,
      DonGia: 350000,
      GhiChu: 'Nước lẩu chua cay nấu từ thơm, cà chua, nhúng nấm và tàu hũ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551267/app_uploads/yhouh5n9hyidy8myj3uo.jpg"
    },
    {
      TenMonAn: 'Cơm Chiên Dương Châu Chay',
      MaLoaiMonAn: 5,
      DonGia: 180000,
      GhiChu: 'Cơm chiên với đậu que, cà rốt, chả lụa chay cắt hạt lựu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551297/app_uploads/azy5w2ygbyr64ctyweyz.jpg"
    },
    {
      TenMonAn: 'Mì Xào Mềm Chay',
      MaLoaiMonAn: 5,
      DonGia: 170000,
      GhiChu: 'Mì trứng xào với cải ngọt, bông cải xanh và nấm đông cô sốt dầu hào chay.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551330/app_uploads/rvuieebxrzcwjsqqgd0m.jpg"
    },
    {
      TenMonAn: 'Đậu Hũ Kho Nấm Rơm',
      MaLoaiMonAn: 5,
      DonGia: 140000,
      GhiChu: 'Đậu hũ chiên kho tộ với nấm rơm, tiêu xanh, vị đậm đà ăn với cơm trắng.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551364/app_uploads/v2fdyyo8tdumka53ceju.jpg"
    },
    {
      TenMonAn: 'Canh Rong Biển Đậu Hũ',
      MaLoaiMonAn: 5,
      DonGia: 130000,
      GhiChu: 'Canh thanh đạm nấu từ rong biển khô và đậu hũ non.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551364/app_uploads/v2fdyyo8tdumka53ceju.jpg"
    },
    {
      TenMonAn: 'Sườn Non Chay Rim Mặn',
      MaLoaiMonAn: 5,
      DonGia: 160000,
      GhiChu: 'Sườn non làm từ đạm đậu nành, chiên giòn rồi rim nước mắm chay.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551510/app_uploads/szlioe8hmtcctdgcyg04.webp"
    },
    {
      TenMonAn: 'Chả Giò Bắp Chay',
      MaLoaiMonAn: 5,
      DonGia: 150000,
      GhiChu: 'Chả giò nhân bắp Mỹ ngọt tự nhiên, vỏ giòn tan.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551534/app_uploads/stjwbulqrkhjmbrw2xfv.jpg"
    },
    {
      TenMonAn: 'Nấm Bào Ngư Xào Sả Ớt',
      MaLoaiMonAn: 5,
      DonGia: 160000,
      GhiChu: 'Nấm bào ngư xám xào lửa lớn với sả băm và ớt, vị cay thơm.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766551560/app_uploads/wro2julrakwnezjqqb7o.png"
    }
  ]);
  await knex('THUCDON_MAU').insert([
    { MaThucDon: 1, TenThucDon: 'Thực đơn Truyền Thống', DonGiaHienTai: 1450000, GhiChu: 'Phù hợp gia đình', DaXoa: false },
    { MaThucDon: 2, TenThucDon: 'Thực đơn Hải Sản Cao Cấp', DonGiaHienTai: 2280000, GhiChu: 'Sang trọng', DaXoa: false },
    { MaThucDon: 3, TenThucDon: 'Thực đơn Á - Âu Kết Hợp', DonGiaHienTai: 1870000, GhiChu: 'Độc đáo', DaXoa: false },
    { MaThucDon: 4, TenThucDon: 'Thực đơn Chay Thanh Tịnh', DonGiaHienTai: 1200000, GhiChu: 'Thanh đạm', DaXoa: false },
    { MaThucDon: 5, TenThucDon: 'Thực đơn Tiệc Cưới Phổ Thông', DonGiaHienTai: 1620000, GhiChu: 'Hợp lý', DaXoa: false }
  ]);

  // 2. Lấy ID để khớp dữ liệu
  const monAnMap = await knex('MONAN').select('MaMonAn', 'TenMonAn');
  const getID = (name) => {
    const item = monAnMap.find(m => m.TenMonAn === name);
    return item ? item.MaMonAn : null;
  };

  // 3. Chèn Chi Tiết Thực Đơn
  await knex('CHITIET_THUCDONMAU').insert([
    // SET 1
    { MaThucDon: 1, MaMonAn: getID('Gỏi Ngó Sen Tôm Thịt') },
    { MaThucDon: 1, MaMonAn: getID('Gà Hấp Lá Chanh') },
    { MaThucDon: 1, MaMonAn: getID('Heo Rừng Xào Lăn') },
    { MaThucDon: 1, MaMonAn: getID('Chè Bưởi An Giang') },
    { MaThucDon: 1, MaMonAn: getID('Nước Ngọt Coca-Cola') },

    // SET 2
    { MaThucDon: 2, MaMonAn: getID('Súp Hải Sản Tóc Tiên') },
    { MaThucDon: 2, MaMonAn: getID('Mực Chiên Xù Sốt Tartar') },
    { MaThucDon: 2, MaMonAn: getID('Tôm Hùm Baby Hấp Tỏi') },
    { MaThucDon: 2, MaMonAn: getID('Cá Tầm Nướng Muối Ớt') },
    { MaThucDon: 2, MaMonAn: getID('Rượu Champagne Nổ') },

    // SET 3
    { MaThucDon: 3, MaMonAn: getID('Salad Nga') },
    { MaThucDon: 3, MaMonAn: getID('Bacon Cuộn Tôm Nướng') },
    { MaThucDon: 3, MaMonAn: getID('Bò Lúc Lắc Khoai Tây') },
    { MaThucDon: 3, MaMonAn: getID('Tiramisu Ý') },
    { MaThucDon: 3, MaMonAn: getID('Rượu Vang Trắng') },

    // SET 4
    { MaThucDon: 4, MaMonAn: getID('Gỏi Cuốn Chay') },
    { MaThucDon: 4, MaMonAn: getID('Súp Măng Tây Cua Chay') },
    { MaThucDon: 4, MaMonAn: getID('Lẩu Thái Chay') },
    { MaThucDon: 4, MaMonAn: getID('Sườn Non Chay Rim Mặn') },
    { MaThucDon: 4, MaMonAn: getID('Nước Ép Dưa Hấu') },

    // SET 5
    { MaThucDon: 5, MaMonAn: getID('Chả Giò Hải Sản Mayonnaise') },
    { MaThucDon: 5, MaMonAn: getID('Súp Cua Băng Tuyết') },
    { MaThucDon: 5, MaMonAn: getID('Gà Quay Sốt Cam') },
    { MaThucDon: 5, MaMonAn: getID('Lẩu Thái Hải Sản') },
    { MaThucDon: 5, MaMonAn: getID('Rau Câu Trái Cây') },
    { MaThucDon: 5, MaMonAn: getID('Bia Heineken (Thùng)') }
  ].filter(item => item.MaMonAn !== null));
  await knex('LOAIDICHVU').insert([
    { MaLoaiDichVu: 1, TenLoaiDichVu: 'Trang trí & Không gian' },
    { MaLoaiDichVu: 2, TenLoaiDichVu: 'Âm thanh & Ánh sáng' },
    { MaLoaiDichVu: 3, TenLoaiDichVu: 'Nghệ thuật & Giải trí' },
    { MaLoaiDichVu: 4, TenLoaiDichVu: 'Nhân sự phục vụ' },
    { MaLoaiDichVu: 5, TenLoaiDichVu: 'Khác' }
  ]);
  
  // Reset Sequence cho Loại Dịch Vụ
  await knex.raw('SELECT setval(\'"LOAIDICHVU_MaLoaiDichVu_seq"\', 5, true)');

  // 4.2. Thêm Dịch Vụ Cụ Thể
  await knex('DICHVU').insert([
    // --- 1. Trang trí & Không gian (Decor) ---
    {
      TenDichVu: 'Trang trí trần tiệc thả pha lê & hoa tươi',
      MaLoaiDichVu: 1,
      DonGia: 25000000,
      GhiChu: 'Kết hợp đèn chùm pha lê và hoa tươi nhập khẩu thả trần tạo không gian lộng lẫy.',
      AnhURL: 'https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766735172/app_uploads/mi0nxtamfg9yr5bktf82.jpg'
    },
    {
      TenDichVu: 'Đường dẫn sân khấu gương vô cực',
      MaLoaiDichVu: 1,
      DonGia: 12000000,
      GhiChu: 'Sàn gương phản chiếu kết hợp đèn LED dưới sàn tạo hiệu ứng vô cực huyền ảo.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740152/app_uploads/ylywbldptcvfnx6hwhmk.jpg"
    },
    {
      TenDichVu: 'Cổng hoa 100% hoa tươi nhập khẩu',
      MaLoaiDichVu: 1,
      DonGia: 15000000,
      GhiChu: 'Sử dụng các loại hoa cao cấp: Mẫu đơn, Tulip, Cẩm tú cầu nhập khẩu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740192/app_uploads/jrwzv0b6wvgyxa5rrz41.jpg"
    },
    {
      TenDichVu: 'Khu vực Photobooth 3D Concept',
      MaLoaiDichVu: 1,
      DonGia: 10000000,
      GhiChu: 'Phông chụp hình thiết kế nổi khối 3D, kết hợp ánh sáng studio chuyên nghiệp.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740287/app_uploads/ys2iel7huvmhexfqndh7.jpg"
    },

    // --- 2. Âm thanh & Ánh sáng (High-end Tech) ---
    {
      TenDichVu: 'Hệ thống âm thanh ',
      MaLoaiDichVu: 2,
      DonGia: 15000000,
      GhiChu: 'Dàn âm thanh chuẩn biểu diễn chuyên nghiệp, đảm bảo chất lượng nhạc sống tốt nhất.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740348/app_uploads/b3rguf6vorjlhtcgzs6m.jpg"
    },
    {
      TenDichVu: 'Trình diễn ánh sáng Laser & Kinetic',
      MaLoaiDichVu: 2,
      DonGia: 20000000,
      GhiChu: 'Hệ thống đèn nâng hạ tự động (Kinetic) kết hợp Laser show theo nhạc.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740397/app_uploads/nvufsarzdccuflnyf0pk.webp"
    },
    {
      TenDichVu: 'Màn hình LED Cong P2 (Siêu nét)',
      MaLoaiDichVu: 2,
      DonGia: 12000000,
      GhiChu: 'Màn hình LED cong ôm trọn sân khấu, độ phân giải P2 hiển thị sắc nét từng chi tiết.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740446/app_uploads/rh6lpqkk5dxxrdsk4vet.jpg"
    },
    {
      TenDichVu: 'Hiệu ứng khói lạnh (Dry Ice) tạo mây',
      MaLoaiDichVu: 2,
      DonGia: 3000000,
      GhiChu: 'Tạo lớp mây bồng bềnh là là mặt đất khi cô dâu chú rể bước lên sân khấu.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740486/app_uploads/xapkoodamsgi6y4mwejm.jpg"
    },

    // --- 3. Nghệ thuật & Giải trí (Classy & Fun) ---
    {
      TenDichVu: 'Hòa tấu Violon & Cello đón khách',
      MaLoaiDichVu: 3,
      DonGia: 6000000,
      GhiChu: 'Nhóm nhạc thính phòng chơi nhạc cổ điển sang trọng trong 1 giờ đón khách.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740562/app_uploads/tzhcutw87cahwrpqqyrg.jpg"
    },
    {
      TenDichVu: 'Múa tương tác màn hình LED 3D',
      MaLoaiDichVu: 3,
      DonGia: 8000000,
      GhiChu: 'Vũ công múa tương tác khớp với hiệu ứng hình ảnh trên màn hình LED.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740599/app_uploads/wxoqjqwgr0csbpe6v22f.jpg"
    },
    {
      TenDichVu: 'Ban nhạc Jazz & Flamenco',
      MaLoaiDichVu: 3,
      DonGia: 12000000,
      GhiChu: 'Ban nhạc Âu Mỹ chơi nhạc sống suốt tiệc, tạo không khí lãng mạn, sôi động.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766741380/app_uploads/nzwgp5cj6n2mzfhov9sf.jpg"
    },

    // --- 4. Nhân sự phục vụ (Professional) ---
    {
      TenDichVu: 'MC Song ngữ (Anh - Việt)',
      MaLoaiDichVu: 4,
      DonGia: 5000000,
      GhiChu: 'MC chuyên nghiệp, dẫn dắt lưu loát hai ngôn ngữ, phù hợp tiệc có khách nước ngoài.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740881/app_uploads/yzuog68rpjqllynnasme.webp"
    },
    {
      TenDichVu: 'Trợ lý riêng cho Cô Dâu (Bridal Assistant)',
      MaLoaiDichVu: 4,
      DonGia: 2000000,
      GhiChu: 'Nhân sự hỗ trợ xách váy, dặm phấn, lấy nước, xử lý sự cố cho cô dâu suốt tiệc.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766740908/app_uploads/nhtdbboftuetv0kdpum2.jpg"
    },
    {
      TenDichVu: 'Đội ngũ khánh tiết Hoàng Gia',
      MaLoaiDichVu: 4,
      DonGia: 4000000,
      GhiChu: 'Đội hình 8 nam/nữ ngoại hình đẹp, mặc trang phục hoàng gia đón khách và rước lễ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766741057/app_uploads/idmessywhs6ddfmkytbj.jpg"
    },

    // --- 5. Khác (Unique Services) ---
    {
      TenDichVu: 'Quầy quay video 360 độ (Slow Motion)',
      MaLoaiDichVu: 5,
      DonGia: 6000000,
      GhiChu: 'Bục xoay camera 360 độ, quay video slow motion lấy ngay, rất hot hiện nay.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766741097/app_uploads/dxmsspohc1nil3lbtiqd.jpg"
    },
    {
      TenDichVu: 'Tiệc trà chiều (Tea Break) đón khách',
      MaLoaiDichVu: 5,
      DonGia: 5000000,
      GhiChu: 'Gồm bánh macaron, cupcake, trà anh, canapé phục vụ khách đến sớm.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766741183/app_uploads/xe5qjxuy4zwpvi0qwqxy.jpg"
    },
    {
      TenDichVu: 'Quầy Bar Cigar & Cocktail',
      MaLoaiDichVu: 5,
      DonGia: 8000000,
      GhiChu: 'Quầy pha chế Cocktail trực tiếp và phục vụ Cigar tại khu vực sảnh chờ.',
      AnhURL: "https://res.cloudinary.com/dvr4ujxsu/image/upload/v1766741284/app_uploads/iocp8w7qrdlgxszecyi2.jpg"
    }
  ]);
}
