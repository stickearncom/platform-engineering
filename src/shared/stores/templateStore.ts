import { create } from 'zustand';
import type { GoalCategory, Question, ScoreHint, ScoreHintExample, ReviewType } from '@/shared/types';
import { generateId } from '@/lib/utils';

// ── Goal Categories ────────────────────────────────────────────────────────────────────────
export const DEFAULT_GOAL_CATEGORIES: GoalCategory[] = [
  { id: 'gc-pa',  name: 'PERFORMANCE ASSESSMENT', slug: 'performance_assessment', reviewType: 'manager',     description: 'Assessment kinerja mencakup komunikasi, ownership, dan pencapaian target.' },
  { id: 'gc-la',  name: 'LEADERSHIP ASSESSMENT',  slug: 'leadership_assessment',  reviewType: 'subordinate', description: 'Assessment kepemimpinan oleh bawahan terhadap atasan langsung.' },
  { id: 'gc-sfe', name: 'Strive for Excellence',  slug: 'strive_for_excellence',  reviewType: 'peer',        description: 'Standar tinggi dalam pekerjaan, problem solving, akuntabilitas, dan inisiatif.' },
  { id: 'gc-tw',  name: 'Teamwork',               slug: 'teamwork',               reviewType: 'peer',        description: 'Kolaborasi, komunikasi konstruktif, dan kontribusi positif dalam tim.' },
  { id: 'gc-int', name: 'Integrity',              slug: 'integrity',              reviewType: 'peer',        description: 'Kejujuran, keterpercayaan, keadilan, dan tanggung jawab.' },
  { id: 'gc-cf',  name: 'Customer-Focused',        slug: 'customer_focused',       reviewType: 'peer',        description: 'Orientasi pada pelanggan, ketepatan waktu, dan keterlibatan ekstra.' },
  { id: 'gc-ki',  name: 'Keep Improving',          slug: 'keep_improving',         reviewType: 'peer',        description: 'Keterbukaan terhadap feedback, tantangan, dan pembelajaran aktif.' },
  { id: 'gc-sa',  name: 'SELF ASSESSMENT',         slug: 'self_assessment',        reviewType: 'self',        description: 'Refleksi diri terkait pencapaian, kontribusi teknis, dan pengembangan diri.' },
];

// ── Questions ─────────────────────────────────────────────────────────────────────────────
const mockQuestions: Question[] = [
  // ── PERFORMANCE ASSESSMENT (manager) ──────────────────────────────────────────────────
  { id: 'qpa1', reviewType: 'manager',     categoryId: 'gc-pa',  type: 'score', order: 1, text: 'Communication' },
  { id: 'qpa2', reviewType: 'manager',     categoryId: 'gc-pa',  type: 'score', order: 2, text: 'Ownership & Responsibility' },
  { id: 'qpa3', reviewType: 'manager',     categoryId: 'gc-pa',  type: 'score', order: 3, text: 'Accomplishment' },

  // ── LEADERSHIP ASSESSMENT (subordinate) ───────────────────────────────────────────────
  { id: 'qla1', reviewType: 'subordinate', categoryId: 'gc-la',  type: 'score', order: 1, text: 'Business Acumen' },
  { id: 'qla2', reviewType: 'subordinate', categoryId: 'gc-la',  type: 'score', order: 2, text: 'Problem Solving & Innovation' },
  { id: 'qla3', reviewType: 'subordinate', categoryId: 'gc-la',  type: 'score', order: 3, text: 'Managing People' },
  { id: 'qla4', reviewType: 'subordinate', categoryId: 'gc-la',  type: 'score', order: 4, text: 'Managerial Courage' },

  // ── Strive for Excellence (peer) ──────────────────────────────────────────────────────
  { id: 'qsfe1', reviewType: 'peer', categoryId: 'gc-sfe', type: 'score', order: 1, text: 'Active Problem Solver' },
  { id: 'qsfe2', reviewType: 'peer', categoryId: 'gc-sfe', type: 'score', order: 2, text: 'Accountable & Ambitious' },
  { id: 'qsfe3', reviewType: 'peer', categoryId: 'gc-sfe', type: 'score', order: 3, text: 'Aim for Extra-Miles' },
  { id: 'qsfe4', reviewType: 'peer', categoryId: 'gc-sfe', type: 'score', order: 4, text: 'Acts as a Leader' },

  // ── Teamwork (peer) ───────────────────────────────────────────────────────────────────
  { id: 'qtw1', reviewType: 'peer', categoryId: 'gc-tw', type: 'score', order: 1, text: 'Respectful' },
  { id: 'qtw2', reviewType: 'peer', categoryId: 'gc-tw', type: 'score', order: 2, text: 'Supportive & Considerate' },
  { id: 'qtw3', reviewType: 'peer', categoryId: 'gc-tw', type: 'score', order: 3, text: 'Be a Constructive Influencer' },
  { id: 'qtw4', reviewType: 'peer', categoryId: 'gc-tw', type: 'score', order: 4, text: 'Effectively Communicate/Collaborate' },
  { id: 'qtw5', reviewType: 'peer', categoryId: 'gc-tw', type: 'score', order: 5, text: 'Team-Oriented' },

  // ── Integrity (peer) ──────────────────────────────────────────────────────────────────
  { id: 'qint1', reviewType: 'peer', categoryId: 'gc-int', type: 'score', order: 1, text: 'Honesty' },
  { id: 'qint2', reviewType: 'peer', categoryId: 'gc-int', type: 'score', order: 2, text: 'Reliable/Trustworthy' },
  { id: 'qint3', reviewType: 'peer', categoryId: 'gc-int', type: 'score', order: 3, text: 'Fairness' },
  { id: 'qint4', reviewType: 'peer', categoryId: 'gc-int', type: 'score', order: 4, text: 'Transparency & Objectivity' },
  { id: 'qint5', reviewType: 'peer', categoryId: 'gc-int', type: 'score', order: 5, text: 'Responsible' },

  // ── Customer-Focused (peer) ───────────────────────────────────────────────────────────
  { id: 'qcf1', reviewType: 'peer', categoryId: 'gc-cf', type: 'score', order: 1, text: 'Spirit of Customer-Best' },
  { id: 'qcf2', reviewType: 'peer', categoryId: 'gc-cf', type: 'score', order: 2, text: 'Customer Perspective-Taking' },
  { id: 'qcf3', reviewType: 'peer', categoryId: 'gc-cf', type: 'score', order: 3, text: 'Punctuality' },
  { id: 'qcf4', reviewType: 'peer', categoryId: 'gc-cf', type: 'score', order: 4, text: 'Citizenship/Company-Focused' },
  { id: 'qcf5', reviewType: 'peer', categoryId: 'gc-cf', type: 'score', order: 5, text: 'Openness for Extra-Role' },

  // ── Keep Improving (peer) ─────────────────────────────────────────────────────────────
  { id: 'qki1', reviewType: 'peer', categoryId: 'gc-ki', type: 'score', order: 1, text: 'Openness for Feedbacks' },
  { id: 'qki2', reviewType: 'peer', categoryId: 'gc-ki', type: 'score', order: 2, text: 'Openness for Challenges' },
  { id: 'qki3', reviewType: 'peer', categoryId: 'gc-ki', type: 'score', order: 3, text: 'Growth-Mindset' },
  { id: 'qki4', reviewType: 'peer', categoryId: 'gc-ki', type: 'score', order: 4, text: 'Adaptable/Agility' },
  { id: 'qki5', reviewType: 'peer', categoryId: 'gc-ki', type: 'score', order: 5, text: 'Proactive Learner' },

  // ── SELF ASSESSMENT (self) ────────────────────────────────────────────────────────────
  { id: 'qsa1', reviewType: 'self', categoryId: 'gc-sa', type: 'score', order: 1, text: 'Goal Achievement' },
  { id: 'qsa2', reviewType: 'self', categoryId: 'gc-sa', type: 'score', order: 2, text: 'Technical & Functional Contribution' },
  { id: 'qsa3', reviewType: 'self', categoryId: 'gc-sa', type: 'score', order: 3, text: 'Self Development & Learning' },
  { id: 'qsa4', reviewType: 'self', categoryId: 'gc-sa', type: 'score', order: 4, text: 'Collaboration & Communication' },
  { id: 'qsa5', reviewType: 'self', categoryId: 'gc-sa', type: 'score', order: 5, text: 'Self-Awareness & Impact' },
];

// ── Score Hints (normalized — ERD v6: score_hints table) ──────────────────────────────────
const mockScoreHints: ScoreHint[] = [
  // qpa1 — Communication (manager)
  { id: 'sh-qpa1-1', questionId: 'qpa1', scoreValue: 1, anchorText: 'Banyak kekurangan komunikasi yang berdampak signifikan pada hasil kerja tim. Sering tidak mampu menyesuaikan cara komunikasi—terlalu banyak detail teknis yang tidak relevan atau justru terlalu sedikit info penting. Laporan dan dokumentasi seperti sprint report atau status update sering tidak jelas atau tidak lengkap. Jarang berbagi informasi tepat waktu sehingga menghambat progress engineer, PM, atau data analyst.' },
  { id: 'sh-qpa1-2', questionId: 'qpa1', scoreValue: 2, anchorText: 'Komunikasi kadang tidak mencukupi kebutuhan kerja. Penyampaian secara lisan maupun tulisan kurang terstruktur dan sering tidak sesuai audiens—misalnya penjelasan teknis yang terlalu dalam untuk stakeholder non-teknis, atau sebaliknya. Cenderung menahan informasi atau kesulitan membedakan mana yang perlu disampaikan segera versus yang bisa menunggu.' },
  { id: 'sh-qpa1-3', questionId: 'qpa1', scoreValue: 3, anchorText: 'Komunikasi cukup memadai untuk kebutuhan kerja sehari-hari, namun belum konsisten dalam kejelasan atau ketepatan waktu. Mampu menyampaikan informasi dengan baik dalam situasi rutin seperti daily standup atau sprint review, tapi kadang kurang efektif saat menghadapi diskusi teknis yang kompleks atau ketika berkoordinasi lintas tim engineering, product, dan data.' },
  { id: 'sh-qpa1-4', questionId: 'qpa1', scoreValue: 4, anchorText: 'Komunikasi lebih dari cukup untuk mendukung kinerja yang efektif. Mampu menyampaikan informasi teknis maupun non-teknis dengan jelas dan tepat sasaran—baik dalam forum sprint planning, backlog grooming, maupun diskusi lintas divisi. Aktif mendengarkan kebutuhan engineer, PM, QA, atau data analyst dan menyesuaikan cara penyampaian sesuai audiens.' },
  { id: 'sh-qpa1-5', questionId: 'qpa1', scoreValue: 5, anchorText: 'Selalu berkomunikasi dengan kualitas tinggi yang mendukung efektivitas tim secara keseluruhan. Mampu mensintesis informasi teknis yang kompleks menjadi insight yang dapat langsung ditindaklanjuti—baik untuk keperluan engineering, product roadmap, maupun analisis data. Secara transparan berbagi informasi yang relevan ke semua pihak dan dengan tepat membedakan informasi yang kritis versus yang sekadar berguna untuk diketahui.' },
  { id: 'sh-qpa1-6', questionId: 'qpa1', scoreValue: 6, anchorText: 'Komunikasinya menjadi standar acuan di tim dan organisasi. Secara proaktif menyesuaikan gaya dan pendekatan untuk berbagai audiens—dari engineer yang butuh detail teknis hingga stakeholder bisnis yang butuh ringkasan eksekutif. Mampu mengubah diskusi teknis yang rumit menjadi keputusan yang actionable dan mendorong budaya komunikasi yang terbuka di seluruh divisi IT, product, maupun data.' },

  // qpa2 — Ownership & Responsibility (manager)
  { id: 'sh-qpa2-1', questionId: 'qpa2', scoreValue: 1, anchorText: 'Menghindari tanggung jawab atas tugas atau issue yang muncul dan sering menyalahkan faktor eksternal atau anggota tim lain. Jarang memberikan update progress yang jelas—misalnya tidak mengupdate status tiket di Jira atau tidak memberi tahu tim saat ada blocker. Masalah teknis atau operasional dibiarkan berlarut tanpa ada upaya penyelesaian.' },
  { id: 'sh-qpa2-2', questionId: 'qpa2', scoreValue: 2, anchorText: 'Kadang mau bertanggung jawab tapi sering butuh diingatkan. Pekerjaan perlu sering dicek ulang untuk memastikan ketepatan dan kelengkapannya. Jarang bersikap proaktif—biasanya baru angkat bicara soal masalah atau risiko kalau sudah ditanya lebih dulu oleh lead atau PM.' },
  { id: 'sh-qpa2-3', questionId: 'qpa2', scoreValue: 3, anchorText: 'Menerima tanggung jawab atas tugas yang diberikan tapi masih butuh arahan untuk menetapkan prioritas atau membuat keputusan. Memahami dampak pekerjaannya terhadap tim atau hasil produk, tapi follow-through-nya belum konsisten. Sesekali menangani masalah tapi belum proaktif dalam mengantisipasinya.' },
  { id: 'sh-qpa2-4', questionId: 'qpa2', scoreValue: 4, anchorText: 'Bertanggung jawab penuh atas tugas yang diberikan dan menyelesaikannya dengan minim pengawasan. Bisa merencanakan pekerjaan dengan baik—misalnya memecah task di sprint, memprioritaskan bug fix, atau mengkoordinasikan dependency antar tim. Mampu mengenali dan memperbaiki kesalahannya sendiri, dan sesekali membantu anggota tim belajar dari situasi yang sama.' },
  { id: 'sh-qpa2-5', questionId: 'qpa2', scoreValue: 5, anchorText: 'Menunjukkan ownership yang kuat terhadap tugas dan hasil kerjanya. Secara konsisten merencanakan dengan proaktif dan memanfaatkan sumber daya yang tersedia—baik tools, dokumentasi, maupun kolaborasi dengan QA, PM, atau data team. Terbuka mengakui kesalahan dan langsung mengambil langkah perbaikan serta membantu tim belajar dari situasi tersebut.' },
  { id: 'sh-qpa2-6', questionId: 'qpa2', scoreValue: 6, anchorText: 'Menjadi contoh ownership yang nyata—aktif mengambil tanggung jawab bahkan di luar scope tugasnya. Selalu menghasilkan output berkualitas tinggi melalui perencanaan yang matang dan inisiatif yang kuat. Berperan sebagai role model dalam mengakui kesalahan dan mendorong budaya saling belajar di tim. Mengantisipasi potensi masalah teknis atau operasional sebelum berdampak ke tim atau produk.' },

  // qpa3 — Accomplishment (manager)
  { id: 'sh-qpa3-1', questionId: 'qpa3', scoreValue: 1, anchorText: 'Belum memenuhi ekspektasi dalam menyelesaikan tugas atau mencapai target. Sering melewatkan deadline—misalnya story yang seharusnya selesai dalam satu sprint terus tertunda atau deliverable product dan data pipeline tidak kunjung dirilis. Butuh perbaikan signifikan bahkan untuk mencapai target dasar perannya.' },
  { id: 'sh-qpa3-2', questionId: 'qpa3', scoreValue: 2, anchorText: 'Kadang memenuhi ekspektasi tapi tidak konsisten. Dibutuhkan peningkatan signifikan di satu atau dua area kritis. Masih butuh pengawasan dan bantuan yang cukup sering untuk menyelesaikan target utama atau memenuhi deadline sprint maupun project milestone.' },
  { id: 'sh-qpa3-3', questionId: 'qpa3', scoreValue: 3, anchorText: 'Memenuhi ekspektasi dalam menyelesaikan tugas dan target di sebagian besar situasi. Mampu mencapai objective utama perannya—misalnya menyelesaikan fitur sesuai sprint commitment, menghasilkan analisis data yang diminta, atau memenuhi acceptance criteria yang disepakati dengan PM. Hasilnya memuaskan meski belum konsisten melampaui ekspektasi.' },
  { id: 'sh-qpa3-4', questionId: 'qpa3', scoreValue: 4, anchorText: 'Secara konsisten memenuhi ekspektasi dalam pencapaian tugas dan target. Selalu menyelesaikan sprint commitment dengan sedikit atau tanpa arahan tambahan. Sesekali melampaui ekspektasi—misalnya menyelesaikan fitur lebih awal dan langsung membantu task lain, atau menghasilkan insight data di luar yang diminta yang berguna untuk pengambilan keputusan produk.' },
  { id: 'sh-qpa3-5', questionId: 'qpa3', scoreValue: 5, anchorText: 'Secara konsisten melampaui ekspektasi dalam pencapaian tugas dan target. Menghasilkan output yang melebihi target peran—misalnya merampungkan beberapa fitur kompleks dalam satu cycle, membangun data pipeline yang jauh lebih efisien dari yang direncanakan, atau menginisiasi improvement pada proses QA yang berdampak pada keseluruhan kualitas produk.' },
  { id: 'sh-qpa3-6', questionId: 'qpa3', scoreValue: 6, anchorText: 'Secara konsisten menghasilkan pencapaian luar biasa yang jauh melampaui ekspektasi. Menghadirkan hasil yang extraordinary—misalnya merancang solusi arsitektur yang memangkas technical debt secara signifikan, membangun framework analisis data yang digunakan lintas tim, atau menginisiasi improvement produk yang berdampak langsung pada key metric bisnis. Menjadi tolok ukur pencapaian dan menginspirasi tim melalui kualitas kerjanya.' },

  // qla1 — Business Acumen (subordinate)
  { id: 'sh-qla1-1', questionId: 'qla1', scoreValue: 1, anchorText: 'Kesulitan memahami bagaimana proses di tim atau divisinya berjalan dan bagaimana kaitannya dengan tujuan bisnis yang lebih besar. Tidak mampu mengidentifikasi inefisiensi di area kerjanya sendiri. Butuh bimbingan intensif bahkan untuk memahami alur kerja dasar antara engineering, product, dan data.' },
  { id: 'sh-qla1-2', questionId: 'qla1', scoreValue: 2, anchorText: 'Pemahaman tentang proses di areanya masih terbatas dan hampir tidak memiliki kesadaran tentang keterkaitannya dengan tim lain. Jarang mengidentifikasi proses yang bermasalah dan kesulitan mengusulkan solusi. Butuh coaching untuk bisa menerapkan pemahaman bisnis secara efektif dalam konteks pengembangan produk atau pengelolaan data.' },
  { id: 'sh-qla1-3', questionId: 'qla1', scoreValue: 3, anchorText: 'Memahami proses inti di timnya dan sesekali mengidentifikasi inefisiensi. Mulai menyadari bagaimana areanya—misalnya engineering atau data—terhubung ke tim product dan bisnis, namun masih perlu pengembangan lebih lanjut untuk bisa bertindak berdasarkan pemahaman tersebut. Usulan perbaikannya sudah ada tapi dampaknya masih terbatas.' },
  { id: 'sh-qla1-4', questionId: 'qla1', scoreValue: 4, anchorText: 'Memiliki pemahaman yang solid tentang bagaimana timnya berinteraksi dengan divisi lain—misalnya bagaimana keputusan teknis engineering berdampak pada roadmap product, atau bagaimana output data analyst memengaruhi strategi bisnis. Secara rutin mengidentifikasi proses yang kurang efisien dan mengusulkan solusi praktis dengan berkolaborasi lintas fungsi.' },
  { id: 'sh-qla1-5', questionId: 'qla1', scoreValue: 5, anchorText: 'Memiliki pemahaman mendalam tentang keterkaitan antar divisi—engineering, product, dan data—serta bagaimana semuanya berkontribusi pada tujuan organisasi. Secara proaktif mengidentifikasi masalah sistemik dan mendorong perbaikan yang berdampak luas. Konsisten berkolaborasi lintas tim untuk mengoptimalkan proses dan meningkatkan outcome bisnis.' },
  { id: 'sh-qla1-6', questionId: 'qla1', scoreValue: 6, anchorText: 'Menjadi contoh business acumen yang luar biasa dengan menghubungkan tujuan tim secara langsung ke strategi organisasi. Secara rutin membawa perspektif dari luar—benchmarking praktik terbaik industri tech—dan mengintegrasikannya ke dalam cara kerja tim. Bertindak sebagai advisor strategis yang mempengaruhi kolaborasi lintas fungsi antara IT, product, dan data.' },

  // qla2 — Problem Solving & Innovation (subordinate)
  { id: 'sh-qla2-1', questionId: 'qla2', scoreValue: 1, anchorText: 'Menghindari masalah atau sangat bergantung pada orang lain untuk menemukan solusi. Jarang berkontribusi ide baru—misalnya tidak pernah mengusulkan pendekatan teknis alternatif, improvement pada proses delivery, atau cara baru mengolah data.' },
  { id: 'sh-qla2-2', questionId: 'qla2', scoreValue: 2, anchorText: 'Berusaha menyelesaikan masalah tapi hasilnya tidak konsisten dan kurang kreatif. Sesekali memberikan ide dasar—seperti menyarankan library baru atau perubahan kecil pada alur kerja—tapi kesulitan mengeksekusinya sampai tuntas.' },
  { id: 'sh-qla2-3', questionId: 'qla2', scoreValue: 3, anchorText: 'Cukup mampu menangani masalah rutin dan sesekali mengusulkan solusi. Menunjukkan kreativitas awal—misalnya menemukan workaround untuk bug atau menyederhanakan query data—namun masih kesulitan menghadapi tantangan yang lebih kompleks atau ambigu.' },
  { id: 'sh-qla2-4', questionId: 'qla2', scoreValue: 4, anchorText: 'Secara konsisten menyelesaikan masalah dengan efektif dan memperkenalkan inovasi yang praktis. Mampu menyeimbangkan kreativitas dengan eksekusi yang realistis—misalnya mengusulkan refactoring yang meningkatkan performa, memperbaiki alur discovery product, atau membangun pipeline data yang lebih andal.' },
  { id: 'sh-qla2-5', questionId: 'qla2', scoreValue: 5, anchorText: 'Secara proaktif mengidentifikasi tantangan sebelum menjadi masalah besar dan konsisten mengusulkan solusi inovatif yang berdampak nyata. Mendorong perbaikan yang dirasakan langsung oleh tim—baik dari sisi kualitas kode, efisiensi proses product, maupun akurasi dan kecepatan analisis data.' },
  { id: 'sh-qla2-6', questionId: 'qla2', scoreValue: 6, anchorText: 'Menunjukkan kemampuan problem solving dan inovasi yang luar biasa, mendorong perubahan transformatif di tim atau organisasi. Menginspirasi orang lain untuk berpikir lebih kreatif—misalnya memimpin inisiatif adopsi teknologi baru, merancang ulang arsitektur sistem yang sudah tidak efisien, atau membangun pendekatan data-driven yang mengubah cara tim mengambil keputusan.' },

  // qla3 — Managing People (subordinate)
  { id: 'sh-qla3-1', questionId: 'qla3', scoreValue: 1, anchorText: 'Secara konsisten gagal menangani performa yang bermasalah atau mengapresiasi kontributor terbaik. Tidak memberikan coaching atau mentoring kepada tim—baik itu ke engineer, designer, maupun data analyst yang membutuhkan bimbingan. Pembagian tugas dan prioritas di dalam tim tidak jelas, menimbulkan kebingungan dan inefisiensi yang berdampak pada morale dan produktivitas secara keseluruhan.' },
  { id: 'sh-qla3-2', questionId: 'qla3', scoreValue: 2, anchorText: 'Kadang menangani masalah performa di tim tapi tidak konsisten atau tidak efektif. Kesulitan melakukan coaching atau mentoring—misalnya jarang memberikan feedback yang spesifik dan actionable kepada engineer atau PM di timnya. Ekspektasi kerja sering tidak jelas, dan prioritas sprint atau project kerap butuh klarifikasi berulang.' },
  { id: 'sh-qla3-3', questionId: 'qla3', scoreValue: 3, anchorText: 'Cukup mampu menangani isu performa dan sesekali melakukan coaching. Menyampaikan ekspektasi dan memberikan feedback tepat waktu meski masih ada ruang untuk meningkatkan kualitas dan kedalamannya. Mendorong beberapa peluang pengembangan untuk anggota tim—misalnya mendorong engineer ikut knowledge sharing atau PM mengikuti pelatihan—namun belum konsisten.' },
  { id: 'sh-qla3-4', questionId: 'qla3', scoreValue: 4, anchorText: 'Efektif menangani isu performa dan aktif melakukan coaching agar tim bisa berkembang. Menyampaikan ekspektasi yang jelas dan memberikan feedback yang rutin, tepat waktu, dan konstruktif—baik untuk engineer, designer, maupun data analyst. Secara aktif mendorong pertumbuhan profesional anggota tim dan mengelola prioritas dengan baik agar selaras dengan tujuan produk dan bisnis.' },
  { id: 'sh-qla3-5', questionId: 'qla3', scoreValue: 5, anchorText: 'Secara proaktif menangani isu performa yang sulit, mampu mengubah anggota tim yang underperform menjadi kontributor produktif. Secara konsisten melakukan coaching untuk memaksimalkan performa—termasuk membantu engineer meningkatkan technical skill, mendampingi PM dalam prioritisasi, atau mengembangkan kapabilitas data analyst. Mengakui dan mengapresiasi kontribusi terbaik sambil memberikan feedback yang jujur dan konstruktif.' },
  { id: 'sh-qla3-6', questionId: 'qla3', scoreValue: 6, anchorText: 'Menjadi teladan dalam pengelolaan tim—selalu menjadi tempat pertama yang dituju saat ada isu sulit. Menginspirasi dan memberdayakan setiap anggota tim—dari frontend developer hingga data engineer—untuk mencapai potensi terbaik mereka. Aktif melahirkan pemimpin berikutnya dan membangun budaya tim yang high-performing dan adaptif. Mengelola prioritas dan penugasan dengan presisi tinggi selaras dengan tujuan jangka panjang organisasi.' },

  // qla4 — Managerial Courage (subordinate)
  { id: 'sh-qla4-1', questionId: 'qla4', scoreValue: 1, anchorText: 'Kesulitan berkomunikasi secara langsung dalam situasi sulit—misalnya saat harus memberi tahu engineer bahwa kodenya perlu dirework besar, atau ketika standar kualitas tidak terpenuhi. Menghindari konflik sampai masalah berlarut. Jarang memberikan feedback sehingga anggota tim tidak tahu di mana posisi mereka.' },
  { id: 'sh-qla4-2', questionId: 'qla4', scoreValue: 2, anchorText: 'Ragu mengambil tanggung jawab atas keputusan yang tidak populer—misalnya menolak feature request yang tidak realistis atau menegakkan standar technical debt. Feedback diberikan tidak konsisten, sering hanya saat performance review formal bukan saat masalah muncul. Sesekali menangani situasi sulit tapi kurang percaya diri atau tidak tuntas.' },
  { id: 'sh-qla4-3', questionId: 'qla4', scoreValue: 3, anchorText: 'Berkomunikasi secara langsung tapi perlu meningkatkan konsistensi dalam menangani situasi yang lebih berat. Memberikan koreksi dan feedback pada kondisi rutin—seperti saat daily standup atau code review—tapi masih kesulitan dalam situasi yang lebih berisiko tinggi. Menunjukkan kemampuan dasar dalam memberikan dan menerima feedback yang konstruktif.' },
  { id: 'sh-qla4-4', questionId: 'qla4', scoreValue: 4, anchorText: 'Secara konsisten menangani percakapan sulit dengan adil dan profesional. Proaktif menyelesaikan tantangan di tim sebelum berkembang menjadi konflik besar—misalnya langsung membahas friction antara engineer dan PM, atau merespons kualitas sprint yang menurun sebelum jadi pola. Memberikan feedback yang rutin, tepat waktu, dan actionable serta berani mengambil keputusan sulit meski tidak populer.' },
  { id: 'sh-qla4-5', questionId: 'qla4', scoreValue: 5, anchorText: 'Menjadi role model dalam menghadapi situasi sulit dengan percaya diri dan integritas. Aktif mendorong perbedaan pendapat yang konstruktif—misalnya membuka ruang debat teknis yang sehat atau menantang asumsi dalam product planning—untuk menghasilkan keputusan yang lebih baik. Secara konsisten menegakkan standar untuk diri sendiri dan tim tanpa memandang hierarki atau popularitas.' },
  { id: 'sh-qla4-6', questionId: 'qla4', scoreValue: 6, anchorText: 'Menjadi contoh keberanian manajerial yang luar biasa, secara konsisten mendorong hasil positif melalui kepemimpinan yang transparan dan berprinsip. Menangani situasi paling kompleks dengan elegan—misalnya menavigasi konflik besar lintas tim engineering dan product, atau mengambil keputusan strategis yang berdampak jangka panjang pada arah teknologi. Menginspirasi seluruh tim untuk merangkul budaya akuntabilitas dan feedback yang terbuka.' },

  // qsfe1 — Active Problem Solver (peer)
  { id: 'sh-qsfe1-1', questionId: 'qsfe1', scoreValue: 1, anchorText: 'Kesulitan mengidentifikasi atau menangani masalah di lingkungan kerja. Menghindari inisiatif—misalnya saat ada bug yang ditemukan, memilih diam daripada mengangkatnya ke tim.' },
  { id: 'sh-qsfe1-2', questionId: 'qsfe1', scoreValue: 2, anchorText: 'Sesekali mengidentifikasi dan menangani masalah tapi sering butuh arahan untuk mengeksekusi solusi yang efektif—misalnya melaporkan isu tapi tidak ikut aktif mencari penyelesaiannya.' },
  { id: 'sh-qsfe1-3', questionId: 'qsfe1', scoreValue: 3, anchorText: 'Mampu menangani masalah rutin dengan efektif—seperti mendebugging issue di kode, mengidentifikasi gap di user story, atau menemukan anomali di data—tapi kadang butuh bantuan untuk tantangan yang lebih kompleks.' },
  { id: 'sh-qsfe1-4', questionId: 'qsfe1', scoreValue: 4, anchorText: 'Secara rutin mengidentifikasi masalah dan mengeksekusi solusi dengan minim arahan—misalnya proaktif menginvestigasi root cause dari bug, mengusulkan perbaikan di product flow, atau menemukan inkonsistensi pada pipeline data sebelum berdampak ke user.' },
  { id: 'sh-qsfe1-5', questionId: 'qsfe1', scoreValue: 5, anchorText: 'Mengantisipasi masalah sebelum muncul dan secara proaktif menanganinya dengan solusi yang inovatif dan efektif—misalnya membangun tooling untuk mendeteksi regresi lebih awal, menyederhanakan alur di product sebelum jadi friction, atau mengotomasi validasi data.' },
  { id: 'sh-qsfe1-6', questionId: 'qsfe1', scoreValue: 6, anchorText: 'Unggul dalam menyelesaikan tantangan yang kompleks dan merancang solusi jangka panjang yang berdampak positif bagi organisasi—misalnya menginisiasi perombakan arsitektur sistem, membangun framework testing yang diadopsi lintas tim, atau merancang strategi data yang mendukung keputusan bisnis jangka panjang.' },

  // qsfe2 — Accountable & Ambitious (peer)
  { id: 'sh-qsfe2-1', questionId: 'qsfe2', scoreValue: 1, anchorText: 'Tidak menunjukkan akuntabilitas terhadap tanggung jawab hariannya maupun proyek yang sedang berjalan. Tidak ada inisiatif untuk menetapkan atau mengejar target yang bermakna—misalnya tidak peduli apakah fitur selesai tepat waktu atau tidak.' },
  { id: 'sh-qsfe2-2', questionId: 'qsfe2', scoreValue: 2, anchorText: 'Kadang bisa diandalkan untuk beberapa tugas tapi tidak konsisten. Kurang proaktif dalam manajemen waktu dan tidak menunjukkan ambisi untuk mencapai target yang lebih besar dari yang sudah ditetapkan.' },
  { id: 'sh-qsfe2-3', questionId: 'qsfe2', scoreValue: 3, anchorText: 'Menunjukkan konsistensi dalam pekerjaan sehari-hari dan memenuhi ekspektasi—menyelesaikan tugas di sprint tepat waktu, memenuhi acceptance criteria, atau menyerahkan laporan analisis sesuai jadwal—namun dorongan untuk target yang lebih ambisius masih kurang.' },
  { id: 'sh-qsfe2-4', questionId: 'qsfe2', scoreValue: 4, anchorText: 'Dapat diandalkan secara konsisten dan menunjukkan ambisi dengan menetapkan target yang menantang. Mengelola waktu dengan efektif untuk memenuhi deadline sprint, project milestone, maupun SLA analisis data.' },
  { id: 'sh-qsfe2-5', questionId: 'qsfe2', scoreValue: 5, anchorText: 'Menunjukkan keandalan dan ambisi yang luar biasa dengan secara konsisten melampaui ekspektasi serta mengelola proyek-proyek kompleks dengan efisien—misalnya memimpin pengembangan fitur besar, mengelola multiple workstream product, atau menyelesaikan analisis data critical dalam tenggat yang ketat.' },
  { id: 'sh-qsfe2-6', questionId: 'qsfe2', scoreValue: 6, anchorText: 'Mewujudkan akuntabilitas dan ambisi di level tertinggi—mengambil tantangan besar, memberikan hasil yang luar biasa dengan minim pengawasan, dan menjadi standar acuan produktivitas bagi tim.' },

  // qsfe3 — Aim for Extra-Miles (peer)
  { id: 'sh-qsfe3-1', questionId: 'qsfe3', scoreValue: 1, anchorText: 'Menyelesaikan tugas sesuai standar minimum tanpa ada upaya untuk melampaui ekspektasi—misalnya hanya mengerjakan apa yang ada di tiket tanpa memikirkan kualitas lebih lanjut.' },
  { id: 'sh-qsfe3-2', questionId: 'qsfe3', scoreValue: 2, anchorText: 'Menunjukkan sedikit usaha untuk melampaui ekspektasi. Puas dengan hasil yang cukup—menyelesaikan feature tepat waktu tapi tidak memikirkan edge case, atau menyerahkan analisis yang menjawab pertanyaan tapi tidak memberikan insight tambahan.' },
  { id: 'sh-qsfe3-3', questionId: 'qsfe3', scoreValue: 3, anchorText: 'Menghasilkan pekerjaan yang memenuhi standar tapi jarang lebih dari yang diminta—misalnya kode berjalan dengan benar tapi tidak dioptimasi, atau desain memenuhi requirement tapi tidak mempertimbangkan pengalaman pengguna yang lebih baik.' },
  { id: 'sh-qsfe3-4', questionId: 'qsfe3', scoreValue: 4, anchorText: 'Sesekali melampaui ekspektasi dengan menghasilkan pekerjaan berkualitas lebih tinggi atau berkontribusi di luar tugas yang diberikan—misalnya menambahkan unit test di luar yang diminta, mengusulkan improvement UI yang tidak ada di brief, atau menambahkan visualisasi data yang memperkaya laporan analisis.' },
  { id: 'sh-qsfe3-5', questionId: 'qsfe3', scoreValue: 5, anchorText: 'Secara rutin menghasilkan output yang melampaui ekspektasi. Menunjukkan mindset continuous improvement—misalnya tidak pernah puas hanya dengan code yang functional, selalu mencari cara untuk meningkatkan performa, usability, atau maintainability.' },
  { id: 'sh-qsfe3-6', questionId: 'qsfe3', scoreValue: 6, anchorText: 'Secara konsisten mendorong batas untuk menghasilkan outcome yang luar biasa. Menjadi contoh nyata bahwa acceptable is never enough—selalu menemukan cara untuk meningkatkan kualitas produk, keandalan sistem, atau kedalaman insight data.' },

  // qsfe4 — Acts as a Leader (peer)
  { id: 'sh-qsfe4-1', questionId: 'qsfe4', scoreValue: 1, anchorText: 'Menghindari tanggung jawab atau kepemilikan. Menunggu diarahkan dan mengabaikan peluang untuk berkontribusi lebih—misalnya diam saat ada keputusan teknis yang perlu diambil atau tidak angkat tangan saat tim membutuhkan bantuan.' },
  { id: 'sh-qsfe4-2', questionId: 'qsfe4', scoreValue: 2, anchorText: 'Ragu mengambil inisiatif atau memberikan feedback. Berkontribusi secara minimal tanpa aktif mencari cara untuk memberikan nilai tambah—misalnya tidak menawarkan diri untuk memimpin bagian kecil dari project atau tidak memberikan masukan saat ada diskusi desain.' },
  { id: 'sh-qsfe4-3', questionId: 'qsfe4', scoreValue: 3, anchorText: 'Sesekali mengambil inisiatif untuk memperbaiki situasi atau berkontribusi ke tim tapi membutuhkan dorongan untuk bertindak mandiri—misalnya baru mau memimpin sesi knowledge sharing atau code review setelah diminta.' },
  { id: 'sh-qsfe4-4', questionId: 'qsfe4', scoreValue: 4, anchorText: 'Secara proaktif berkontribusi ke tim dan menangani masalah. Sesekali memberikan feedback yang konstruktif atau mengambil peran kepemimpinan informal—misalnya memandu diskusi teknis, memfasilitasi sesi grooming, atau membantu data analyst junior memahami konteks bisnis.' },
  { id: 'sh-qsfe4-5', questionId: 'qsfe4', scoreValue: 5, anchorText: 'Aktif mencari cara untuk berkontribusi lebih ke tim atau organisasi. Memberikan feedback yang konstruktif dan menginspirasi orang lain melalui inisiatif nyata—misalnya mengusulkan standar kode yang diadopsi tim, memimpin inisiatif peningkatan proses, atau menjadi jembatan komunikasi antara engineering dan product.' },
  { id: 'sh-qsfe4-6', questionId: 'qsfe4', scoreValue: 6, anchorText: 'Menjadi tolok ukur kepemimpinan—mengambil kepemilikan penuh atas situasi, mendorong perubahan positif, dan memberdayakan orang lain melalui feedback yang berani dan kontribusi yang proaktif di seluruh tim IT, product, maupun data.' },

  // qtw1 — Respectful (peer)
  { id: 'sh-qtw1-1', questionId: 'qtw1', scoreValue: 1, anchorText: 'Sering tidak menghargai pendapat, ide, atau peran orang lain. Bersikap dismissif terhadap keputusan yang sudah disepakati bersama—misalnya mengabaikan hasil diskusi desain atau meremehkan estimasi yang diberikan engineer lain.' },
  { id: 'sh-qtw1-2', questionId: 'qtw1', scoreValue: 2, anchorText: 'Sesekali mau mendengarkan atau menunjukkan rasa hormat tapi kesulitan menerima keputusan kelompok atau menghargai peran orang lain di luar spesialisasinya sendiri.' },
  { id: 'sh-qtw1-3', questionId: 'qtw1', scoreValue: 3, anchorText: 'Secara konsisten mendengarkan dan menghargai peran serta pendapat orang lain dalam situasi sehari-hari—misalnya menghormati masukan dari QA, UI/UX designer, atau data analyst meski berbeda dengan pandangannya sendiri.' },
  { id: 'sh-qtw1-4', questionId: 'qtw1', scoreValue: 4, anchorText: 'Secara rutin aktif mendengarkan, menghargai pendapat semua pihak, dan mendukung keputusan yang sudah disepakati bersama—termasuk saat keputusan tersebut bukan pilihannya.' },
  { id: 'sh-qtw1-5', questionId: 'qtw1', scoreValue: 5, anchorText: 'Secara konsisten menunjukkan penghargaan mendalam terhadap peran dan ide semua orang—bahkan dalam situasi tekanan tinggi seperti menjelang deadline sprint atau saat ada perbedaan pendapat sengit soal arah teknis atau product. Secara aktif mendukung keputusan akhir.' },
  { id: 'sh-qtw1-6', questionId: 'qtw1', scoreValue: 6, anchorText: 'Menjadi standar acuan dalam menghormati orang lain. Aktif memediasi ketidaksepakatan dan membangun budaya saling menghargai di seluruh tim—baik antara engineering, product, maupun data.' },

  // qtw2 — Supportive & Considerate (peer)
  { id: 'sh-qtw2-1', questionId: 'qtw2', scoreValue: 1, anchorText: 'Jarang menawarkan bantuan kepada anggota tim atau mempertimbangkan beban kerja dan tujuan orang lain—misalnya tidak peduli ketika rekan sedang struggle dengan task yang berat menjelang deadline.' },
  { id: 'sh-qtw2-2', questionId: 'qtw2', scoreValue: 2, anchorText: 'Jarang membantu orang lain atau mempertimbangkan kondisi rekan kerja. Biasanya baru mau membantu kalau diminta secara langsung.' },
  { id: 'sh-qtw2-3', questionId: 'qtw2', scoreValue: 3, anchorText: 'Sesekali membantu anggota tim yang kesulitan tapi biasanya perlu diminta lebih dulu—misalnya bersedia membantu code review atau menjelaskan flow ketika diminta tapi tidak menawarkan diri secara proaktif.' },
  { id: 'sh-qtw2-4', questionId: 'qtw2', scoreValue: 4, anchorText: 'Secara proaktif menawarkan bantuan kepada rekan yang membutuhkan dan menunjukkan kepedulian nyata terhadap tantangan mereka—misalnya menawarkan diri untuk pair programming, membantu QA memahami alur fitur baru, atau membantu data analyst memahami model data.' },
  { id: 'sh-qtw2-5', questionId: 'qtw2', scoreValue: 5, anchorText: 'Sering turun tangan membantu rekan tanpa perlu diminta dan menunjukkan empati yang tulus terhadap tantangan yang sedang dihadapi tim—misalnya meluangkan waktu ekstra untuk membimbing engineer junior atau membantu PM menyusun prioritas ketika workload sedang overwhelm.' },
  { id: 'sh-qtw2-6', questionId: 'qtw2', scoreValue: 6, anchorText: 'Menunjukkan kepedulian dan dukungan luar biasa terhadap rekan kerja. Secara konsisten meredakan ketegangan di tim dan menyelesaikan tantangan kolaboratif—menjadi orang yang selalu hadir dengan positivity, keberanian memimpin diskusi, dan memberdayakan rekan satu tim.' },

  // qtw3 — Be a Constructive Influencer (peer)
  { id: 'sh-qtw3-1', questionId: 'qtw3', scoreValue: 1, anchorText: 'Menunjukkan negativitas atau pasivitas yang menghambat semangat tim. Jarang atau tidak pernah mengakui kontribusi rekan—misalnya tidak pernah memberikan apresiasi ketika engineer menyelesaikan task yang sulit atau designer menghasilkan solusi yang bagus.' },
  { id: 'sh-qtw3-2', questionId: 'qtw3', scoreValue: 2, anchorText: 'Jarang memberikan semangat atau apresiasi kepada rekan kerja. Sesekali mengakui kontribusi tim tapi tidak aktif memberikan saran yang konstruktif atau memotivasi orang lain untuk berkembang.' },
  { id: 'sh-qtw3-3', questionId: 'qtw3', scoreValue: 3, anchorText: 'Mengakui kontribusi dan sesekali memberikan saran yang membantu tapi belum konsisten dalam membangkitkan semangat rekan—misalnya kadang memberikan feedback positif di code review tapi tidak secara teratur mendorong kolaborasi yang lebih aktif.' },
  { id: 'sh-qtw3-4', questionId: 'qtw3', scoreValue: 4, anchorText: 'Secara rutin mengakui kontribusi rekan dan memberikan feedback positif atau saran untuk meningkatkan hasil kerja tim—misalnya aktif memberikan apresiasi di standup, memberikan feedback konstruktif di pull request, atau mendorong diskusi yang produktif dalam sprint retrospective.' },
  { id: 'sh-qtw3-5', questionId: 'qtw3', scoreValue: 5, anchorText: 'Menginspirasi tim dengan sikap positif, mendorong rekan untuk mencapai potensi terbaik mereka, dan secara rutin mengakui kontribusi—baik kontribusi teknis engineer, kreativitas designer, maupun insight dari data analyst.' },
  { id: 'sh-qtw3-6', questionId: 'qtw3', scoreValue: 6, anchorText: 'Secara konsisten mengangkat dan menginspirasi tim melalui sikap positif, dengan berani memimpin diskusi yang sulit, dan memberdayakan rekan di seluruh divisi—IT, product, maupun data—untuk memberikan yang terbaik.' },

  // qtw4 — Effectively Communicate/Collaborate (peer)
  { id: 'sh-qtw4-1', questionId: 'qtw4', scoreValue: 1, anchorText: 'Menghindari komunikasi atau justru menciptakan konflik yang tidak perlu, sehingga menghambat kolaborasi tim—misalnya tidak merespons pesan di channel project atau menyampaikan kritik teknis dengan cara yang menyerang.' },
  { id: 'sh-qtw4-2', questionId: 'qtw4', scoreValue: 2, anchorText: 'Mau berkomunikasi tapi kesulitan menyelesaikan konflik secara efektif—misalnya sering terlibat dalam diskusi yang berputar-putar tanpa resolusi, atau menghindari clarification yang diperlukan dalam diskusi requirement.' },
  { id: 'sh-qtw4-3', questionId: 'qtw4', scoreValue: 3, anchorText: 'Berkomunikasi dengan cukup baik dalam situasi yang straightforward—seperti daily standup atau update progress—tapi kesulitan saat menghadapi konflik yang lebih kompleks atau berkolaborasi dengan stakeholder dari berbagai latar belakang.' },
  { id: 'sh-qtw4-4', questionId: 'qtw4', scoreValue: 4, anchorText: 'Berkomunikasi dengan efektif, mampu menyelesaikan konflik kecil, dan berkolaborasi dengan baik bersama berbagai stakeholder—misalnya mampu menjembatani perbedaan pendapat antara engineering dan product, atau mengklarifikasi kebutuhan data dengan business user.' },
  { id: 'sh-qtw4-5', questionId: 'qtw4', scoreValue: 5, anchorText: 'Berkomunikasi dengan jelas dan percaya diri, menyelesaikan konflik secara konstruktif, dan mengelola hubungan yang kompleks—misalnya menengahi diskusi teknis yang alot antara backend dan frontend, memfasilitasi alignment antara PM dan engineering mengenai scope, atau menjembatani kebutuhan analisis antara data team dan bisnis.' },
  { id: 'sh-qtw4-6', questionId: 'qtw4', scoreValue: 6, anchorText: 'Unggul dalam mengelola kolaborasi yang kompleks, menyelesaikan konflik dengan mulus, dan membangun hubungan yang kuat lintas stakeholder—menjadi jembatan komunikasi yang andal antara engineering, product, dan data di seluruh organisasi.' },

  // qtw5 — Team-Oriented (peer)
  { id: 'sh-qtw5-1', questionId: 'qtw5', scoreValue: 1, anchorText: 'Menunjukkan minim keterlibatan dalam upaya kelompok. Terkadang menunjukkan perilaku yang memecah belah atau berkompetisi secara tidak sehat—misalnya lebih fokus pada credit pribadi daripada keberhasilan produk bersama.' },
  { id: 'sh-qtw5-2', questionId: 'qtw5', scoreValue: 2, anchorText: 'Berpartisipasi dasar dalam aktivitas kelompok tapi sesekali menunjukkan sifat kompetitif atau territorial—misalnya enggan berbagi konteks penting dengan anggota tim lain atau menutup diri terhadap kontribusi orang lain.' },
  { id: 'sh-qtw5-3', questionId: 'qtw5', scoreValue: 3, anchorText: 'Berpartisipasi dalam upaya tim dan selaras dengan tujuan bersama tapi belum aktif mendorong kolaborasi yang lebih dalam—misalnya mengerjakan bagiannya dengan baik tapi jarang berinisiatif untuk sinergi lintas fungsi.' },
  { id: 'sh-qtw5-4', questionId: 'qtw5', scoreValue: 4, anchorText: 'Senang menjadi bagian dari tim, menghindari kompetisi yang tidak sehat, dan mendorong mindset bekerja menuju tujuan bersama—misalnya aktif berbagi konteks teknis ke PM, membantu data analyst memahami alur sistem, atau mendukung QA dengan dokumentasi yang lengkap.' },
  { id: 'sh-qtw5-5', questionId: 'qtw5', scoreValue: 5, anchorText: 'Secara aktif mendorong kolaborasi, membangun budaya kerja sama, dan bekerja menuju tujuan bersama dengan antusias—misalnya menginisiasi forum lintas fungsi antara engineering, product, dan data untuk meningkatkan keselarasan.' },
  { id: 'sh-qtw5-6', questionId: 'qtw5', scoreValue: 6, anchorText: 'Mewujudkan jiwa tim sejati—menyatukan kelompok dengan visi bersama dan secara konsisten mendorong keberhasilan kolektif. Menjadi perekat utama yang membuat engineering, product, dan data bergerak dalam satu arah.' },

  // qint1 — Honesty (peer)
  { id: 'sh-qint1-1', questionId: 'qint1', scoreValue: 1, anchorText: 'Jarang menunjukkan kejujuran. Menghindari berbicara jujur saat ada kesalahan atau hal yang tidak beres—misalnya diam saat tahu ada bug yang disembunyikan atau melihat data yang dimanipulasi tapi tidak melaporkannya.' },
  { id: 'sh-qint1-2', questionId: 'qint1', scoreValue: 2, anchorText: 'Sesekali jujur tapi ragu-ragu untuk berbicara saat situasi kritis—misalnya mengetahui ada asumsi yang salah dalam requirement tapi memilih diam daripada mengangkatnya ke tim.' },
  { id: 'sh-qint1-3', questionId: 'qint1', scoreValue: 3, anchorText: 'Umumnya jujur dalam situasi sehari-hari tapi menghindari menghadapi isu yang lebih sensitif—misalnya akan melapor kalau ada bug di kodenya sendiri tapi menghindari mengangkat masalah pada proses atau keputusan yang melibatkan orang lain.' },
  { id: 'sh-qint1-4', questionId: 'qint1', scoreValue: 4, anchorText: 'Secara konsisten jujur dan bersedia menangani kesalahan atau perilaku yang tidak etis saat ditemukan—misalnya mengangkat ketidaksesuaian antara hasil analisis data dengan yang dilaporkan, atau mengingatkan tim ketika standar keamanan tidak diikuti.' },
  { id: 'sh-qint1-5', questionId: 'qint1', scoreValue: 5, anchorText: 'Secara proaktif mengidentifikasi dan menangani persoalan etika, mendorong budaya kejujuran di tim—misalnya terbuka membahas technical debt yang selama ini disembunyikan, atau mengajak tim mendiskusikan masalah kualitas produk yang belum pernah diakui.' },
  { id: 'sh-qint1-6', questionId: 'qint1', scoreValue: 6, anchorText: 'Menjadi contoh kejujuran dengan menciptakan lingkungan di mana perilaku yang benar adalah norma dan didorong di semua level—baik dalam diskusi teknis, review produk, maupun saat menyajikan hasil analisis data.' },

  // qint2 — Reliable/Trustworthy (peer)
  { id: 'sh-qint2-1', questionId: 'qint2', scoreValue: 1, anchorText: 'Tidak mengikuti aturan atau nilai-nilai yang berlaku. Perilakunya berbeda saat tidak ada pengawasan—misalnya tidak mengikuti standar coding atau prosedur review saat lead tidak memperhatikan.' },
  { id: 'sh-qint2-2', questionId: 'qint2', scoreValue: 2, anchorText: 'Mengikuti aturan secara tidak konsisten. Kadang sulit mempertahankan prinsip dalam situasi yang menekan—misalnya mengabaikan code review yang seharusnya dilakukan saat deadline mendekat.' },
  { id: 'sh-qint2-3', questionId: 'qint2', scoreValue: 3, anchorText: 'Mengikuti aturan dan prinsip dalam sebagian besar situasi tapi bisa goyah di bawah tekanan—misalnya biasanya menjaga standar kualitas tapi sesekali mengambil shortcut saat workload sedang berat.' },
  { id: 'sh-qint2-4', questionId: 'qint2', scoreValue: 4, anchorText: 'Secara konsisten mengikuti aturan dan nilai-nilai yang berlaku, bahkan saat tidak ada pengawasan atau saat tekanan sedang tinggi—misalnya selalu mengikuti proses pull request review, menjaga standar dokumentasi, dan melaporkan blocker secara jujur.' },
  { id: 'sh-qint2-5', questionId: 'qint2', scoreValue: 5, anchorText: 'Menunjukkan komitmen yang teguh terhadap aturan dan nilai-nilai. Menjadi role model keandalan dan integritas bagi tim—orang yang bisa selalu dipegang komitmennya, baik soal deadline, kualitas kode, maupun akurasi data.' },
  { id: 'sh-qint2-6', questionId: 'qint2', scoreValue: 6, anchorText: 'Mewujudkan keandalan yang menginspirasi kepercayaan di seluruh tim dan organisasi melalui kepatuhan yang konsisten terhadap nilai-nilai—baik dalam engineering, product, maupun data.' },

  // qint3 — Fairness (peer)
  { id: 'sh-qint3-1', questionId: 'qint3', scoreValue: 1, anchorText: 'Menunjukkan bias atau favoritisme, memperlakukan orang lain secara tidak adil berdasarkan preferensi pribadi—misalnya memberikan credit hanya kepada orang tertentu meski kontribusi datang dari seluruh tim, atau lebih kritis terhadap pekerjaan orang yang tidak disukainya.' },
  { id: 'sh-qint3-2', questionId: 'qint3', scoreValue: 2, anchorText: 'Berusaha bersikap adil tapi sesekali membiarkan bias pribadi memengaruhi keputusan atau interaksi—misalnya kurang objektif saat menilai solusi teknis yang diusulkan oleh orang lain.' },
  { id: 'sh-qint3-3', questionId: 'qint3', scoreValue: 3, anchorText: 'Memperlakukan orang lain dengan adil dalam situasi rutin tapi bisa goyah dalam skenario yang kompleks atau stakes yang tinggi—misalnya adil dalam code review biasa tapi menjadi kurang objektif saat ada perbedaan pendapat yang signifikan.' },
  { id: 'sh-qint3-4', questionId: 'qint3', scoreValue: 4, anchorText: 'Memperlakukan semua orang dengan adil dan tidak memihak, aktif berupaya memahami perspektif yang berbeda—misalnya mempertimbangkan masukan dari semua anggota tim secara setara, baik dari frontend developer, QA, data analyst, maupun designer.' },
  { id: 'sh-qint3-5', questionId: 'qint3', scoreValue: 5, anchorText: 'Secara konsisten memastikan keadilan dalam semua interaksi, bahkan dalam situasi yang sulit atau sensitif—misalnya memastikan semua suara didengar dalam diskusi product direction atau teknis, tanpa memandang seniority.' },
  { id: 'sh-qint3-6', questionId: 'qint3', scoreValue: 6, anchorText: 'Menjadi standar acuan keadilan, secara konsisten mendorong inklusivitas dan penghargaan dalam semua keputusan dan interaksi di seluruh tim—baik dalam engineering, product, maupun data.' },

  // qint4 — Transparency & Objectivity (peer)
  { id: 'sh-qint4-1', questionId: 'qint4', scoreValue: 1, anchorText: 'Terlibat dalam gosip atau menyebarkan informasi yang belum terverifikasi. Pengambilan keputusan dipengaruhi oleh bias pribadi—misalnya menyebarkan asumsi yang belum dikonfirmasi tentang suatu bug atau menilai performa seseorang berdasarkan opini subjektif.' },
  { id: 'sh-qint4-2', questionId: 'qint4', scoreValue: 2, anchorText: 'Berbagi informasi secara selektif atau tanpa verifikasi yang cukup. Keputusan kadang bersifat subjektif—misalnya mengutip data analisis yang belum divalidasi untuk mendukung pendapatnya sendiri.' },
  { id: 'sh-qint4-3', questionId: 'qint4', scoreValue: 3, anchorText: 'Menghindari gosip dan informasi yang tidak terverifikasi tapi kadang kurang transparan dalam pengambilan keputusan—misalnya tidak selalu menjelaskan alasan di balik keputusan teknis yang diambil.' },
  { id: 'sh-qint4-4', questionId: 'qint4', scoreValue: 4, anchorText: 'Membuat keputusan berdasarkan fakta dan menghindari penyebaran informasi yang tidak terverifikasi—misalnya selalu merujuk pada data atau hasil pengujian saat mengambil keputusan teknis, bukan berdasarkan asumsi.' },
  { id: 'sh-qint4-5', questionId: 'qint4', scoreValue: 5, anchorText: 'Menunjukkan transparansi yang luar biasa dalam pengambilan keputusan dan secara konsisten mendasarkan tindakan pada kriteria yang objektif—misalnya terbuka memaparkan trade-off teknis secara jujur, meskipun ada opsi yang lebih populer secara politik.' },
  { id: 'sh-qint4-6', questionId: 'qint4', scoreValue: 6, anchorText: 'Menunjukkan transparansi dan objektivitas yang lengkap, memastikan keputusan dan tindakan memberikan manfaat bagi tim dan organisasi—menjadi standar acuan integritas dalam engineering, product, maupun data.' },

  // qint5 — Responsible (peer)
  { id: 'sh-qint5-1', questionId: 'qint5', scoreValue: 1, anchorText: 'Menghindari tanggung jawab atas kesalahan dan jarang berupaya untuk memperbaikinya—misalnya ketika bug yang dilaporkan ternyata dari kodenya sendiri, malah mencari alasan atau menyalahkan hal lain.' },
  { id: 'sh-qint5-2', questionId: 'qint5', scoreValue: 2, anchorText: 'Mau mengakui sebagian tanggung jawab atas kesalahan tapi menghindari menanganinya secara tuntas—misalnya mengakui ada bug tapi tidak proaktif untuk memfix atau menginformasikan dampaknya ke tim.' },
  { id: 'sh-qint5-3', questionId: 'qint5', scoreValue: 3, anchorText: 'Mengakui kesalahan saat diminta dan membuat upaya dasar untuk memperbaikinya—misalnya mengakui estimasi yang meleset dan menyesuaikan sprint plan, tapi baru bereaksi setelah ada yang bertanya.' },
  { id: 'sh-qint5-4', questionId: 'qint5', scoreValue: 4, anchorText: 'Mengambil tanggung jawab atas kesalahan, mengakuinya secara proaktif, dan mengambil langkah untuk memperbaiki dampaknya—misalnya segera menginformasikan tim ketika ada regresi yang tidak terdeteksi di code review atau saat laporan analisis mengandung kesalahan kalkulasi.' },
  { id: 'sh-qint5-5', questionId: 'qint5', scoreValue: 5, anchorText: 'Mengambil tanggung jawab penuh atas kesalahan dan secara aktif bekerja untuk mencegah hal serupa terulang—misalnya menginisiasi review proses setelah insiden, membangun checklist QA yang lebih ketat, atau memperbaiki pipeline data agar kesalahan serupa bisa terdeteksi lebih awal.' },
  { id: 'sh-qint5-6', questionId: 'qint5', scoreValue: 6, anchorText: 'Mengambil kepemilikan atas kesalahan dengan cara yang menginspirasi orang lain, mendorong perbaikan sistemik, dan membangun budaya akuntabilitas di tim—menjadi contoh nyata bahwa kesalahan adalah kesempatan untuk tumbuh.' },

  // qcf1 — Spirit of Customer-Best (peer)
  { id: 'sh-qcf1-1', questionId: 'qcf1', scoreValue: 1, anchorText: 'Gagal mempertimbangkan kebutuhan atau pengalaman pelanggan—baik itu user akhir, internal stakeholder, maupun tim lain. Tidak ada dorongan untuk memperbaiki hasil yang dirasakan pelanggan—misalnya tidak peduli dengan feedback dari QA atau tidak merespons request dari PM yang mewakili kebutuhan user.' },
  { id: 'sh-qcf1-2', questionId: 'qcf1', scoreValue: 2, anchorText: 'Sesekali mempertimbangkan kebutuhan pelanggan tapi kesulitan mempertahankan customer-first mindset secara konsisten—misalnya kadang mengutamakan solusi teknis yang elegan dibanding apa yang benar-benar dibutuhkan user.' },
  { id: 'sh-qcf1-3', questionId: 'qcf1', scoreValue: 3, anchorText: 'Menunjukkan pemahaman yang cukup tentang kebutuhan pelanggan dalam situasi rutin tapi kurang proaktif—misalnya merespons feedback dari PM atau user testing tapi jarang berinisiatif untuk mengantisipasi kebutuhan sebelum diminta.' },
  { id: 'sh-qcf1-4', questionId: 'qcf1', scoreValue: 4, anchorText: 'Secara konsisten mempertimbangkan kebutuhan pelanggan dan menjaga pengalaman positif di sebagian besar situasi—misalnya selalu menimbang user impact sebelum mengambil keputusan teknis atau perubahan product, dan memastikan output data yang dihasilkan relevan dan dapat dipahami oleh stakeholder.' },
  { id: 'sh-qcf1-5', questionId: 'qcf1', scoreValue: 5, anchorText: 'Secara proaktif mengantisipasi kebutuhan pelanggan dan konsisten memberikan pengalaman yang melebihi ekspektasi—misalnya menginisiasi user testing sebelum fitur selesai, membangun alerting data untuk memantau kepuasan pelanggan secara real-time, atau mengusulkan improvement produk berdasarkan pola feedback yang ditemukan.' },
  { id: 'sh-qcf1-6', questionId: 'qcf1', scoreValue: 6, anchorText: 'Menjadi standar acuan perilaku customer-first—secara konsisten melampaui ekspektasi dan menghadirkan pengalaman transformatif bagi pelanggan. Setiap keputusan teknis, product, maupun data dilandasi oleh dampaknya terhadap pengguna akhir.' },

  // qcf2 — Customer Perspective-Taking (peer)
  { id: 'sh-qcf2-1', questionId: 'qcf2', scoreValue: 1, anchorText: 'Jarang mempertimbangkan perspektif pelanggan. Bersikap dismissif atau tidak peka terhadap kebutuhan user—misalnya mengabaikan laporan bug dari QA karena dianggap tidak penting, atau tidak mempertimbangkan experience user saat membuat keputusan teknis.' },
  { id: 'sh-qcf2-2', questionId: 'qcf2', scoreValue: 2, anchorText: 'Menunjukkan sedikit kepedulian terhadap kebutuhan pelanggan tapi ragu-ragu dalam menangani situasi yang tidak menyenangkan—misalnya mengetahui ada friction di product tapi enggan mengangkatnya ke PM karena takut menambah scope pekerjaan.' },
  { id: 'sh-qcf2-3', questionId: 'qcf2', scoreValue: 3, anchorText: 'Mempertimbangkan perspektif pelanggan dalam tugas yang straightforward tapi kesulitan saat berada dalam situasi yang bertekanan tinggi atau kompleks—misalnya baik dalam mempertimbangkan UX dalam development normal tapi sering mengabaikannya saat sprint sedang padat.' },
  { id: 'sh-qcf2-4', questionId: 'qcf2', scoreValue: 4, anchorText: 'Menunjukkan kepedulian dan penghargaan terhadap kebutuhan pelanggan bahkan dalam situasi yang menantang—misalnya tetap mempertimbangkan dampak ke user saat harus membuat trade-off teknis, atau memastikan laporan data mudah dipahami oleh stakeholder non-teknis.' },
  { id: 'sh-qcf2-5', questionId: 'qcf2', scoreValue: 5, anchorText: 'Menunjukkan empati yang nyata dan secara efektif menangani kekhawatiran pelanggan dalam situasi yang sulit—misalnya proaktif membawa feedback user ke dalam diskusi sprint, atau memastikan visualisasi data yang dibuat bisa langsung digunakan untuk keputusan bisnis.' },
  { id: 'sh-qcf2-6', questionId: 'qcf2', scoreValue: 6, anchorText: 'Mengantisipasi kebutuhan pelanggan dengan akurasi yang luar biasa—bahkan dalam situasi yang sangat kompleks atau tidak menyenangkan. Menjadi suara pelanggan di dalam tim engineering, product, maupun data.' },

  // qcf3 — Punctuality (peer)
  { id: 'sh-qcf3-1', questionId: 'qcf3', scoreValue: 1, anchorText: 'Secara rutin menunda respons atau pengiriman layanan. Tidak melakukan follow-up terhadap isu yang sudah dilaporkan—misalnya tidak merespons request dari PM berhari-hari atau membiarkan bug report tanpa tindak lanjut.' },
  { id: 'sh-qcf3-2', questionId: 'qcf3', scoreValue: 2, anchorText: 'Sesekali menunda layanan atau follow-up, yang berdampak negatif pada pengalaman pelanggan internal—misalnya menyelesaikan task sprint terlambat tanpa memberikan update lebih awal, atau lupa menindaklanjuti data request dari tim bisnis.' },
  { id: 'sh-qcf3-3', questionId: 'qcf3', scoreValue: 3, anchorText: 'Memenuhi deadline untuk layanannya tapi sesekali butuh diingatkan untuk follow-up—misalnya menyelesaikan fitur tepat waktu tapi tidak proaktif mengkomunikasikan progress kepada stakeholder.' },
  { id: 'sh-qcf3-4', questionId: 'qcf3', scoreValue: 4, anchorText: 'Secara rutin menyelesaikan pekerjaan tepat waktu dan memastikan follow-up dilakukan secara proaktif—misalnya mengupdate tiket sebelum ditanya, menginformasikan stakeholder saat ada perubahan jadwal rilis, atau menyerahkan laporan data sesuai SLA yang disepakati.' },
  { id: 'sh-qcf3-5', questionId: 'qcf3', scoreValue: 5, anchorText: 'Selalu memastikan pengiriman tepat waktu, melakukan follow-up tanpa perlu diprompt—misalnya menginformasikan blocker lebih awal agar PM bisa menyesuaikan roadmap, atau proaktif menyerahkan hasil analisis sebelum meeting dengan stakeholder bisnis.' },
  { id: 'sh-qcf3-6', questionId: 'qcf3', scoreValue: 6, anchorText: 'Secara konsisten menyelesaikan pekerjaan dan follow-up lebih awal dari jadwal, memastikan pengalaman yang seamless bagi semua stakeholder—baik untuk user yang menunggu fitur, tim bisnis yang menunggu insight, maupun QA yang menunggu build.' },

  // qcf4 — Citizenship/Company-Focused (peer)
  { id: 'sh-qcf4-1', questionId: 'qcf4', scoreValue: 1, anchorText: 'Menunjukkan sedikit pemahaman tentang bagaimana keputusannya berdampak pada tujuan perusahaan yang berkaitan dengan kepuasan pelanggan—misalnya tidak memikirkan dampak bisnis saat memilih solusi teknis atau mengabaikan bagaimana output datanya digunakan untuk keputusan strategis.' },
  { id: 'sh-qcf4-2', questionId: 'qcf4', scoreValue: 2, anchorText: 'Pemahaman terbatas tentang bagaimana perannya terhubung ke tujuan bisnis yang lebih besar. Keputusan teknisnya jarang mempertimbangkan dampak jangka panjang pada kepuasan pelanggan atau key metric perusahaan.' },
  { id: 'sh-qcf4-3', questionId: 'qcf4', scoreValue: 3, anchorText: 'Menunjukkan keselarasan dasar dengan tujuan perusahaan dalam keputusan yang berkaitan dengan pelanggan tapi kurang inisiatif untuk menciptakan dampak yang bermakna—misalnya mengikuti standar yang ada tapi tidak proaktif mencari cara untuk meningkatkan customer outcome.' },
  { id: 'sh-qcf4-4', questionId: 'qcf4', scoreValue: 4, anchorText: 'Menyelaraskan keputusan dengan tujuan perusahaan dan berkontribusi pada hasil yang menguntungkan bisnis—misalnya selalu mempertimbangkan dampak ke metrik bisnis saat mengusulkan fitur baru, atau memastikan analisis data yang dihasilkan relevan untuk keputusan strategis.' },
  { id: 'sh-qcf4-5', questionId: 'qcf4', scoreValue: 5, anchorText: 'Mendasarkan keputusan pada memaksimalkan dampak jangka panjang bagi perusahaan dan pelanggannya—secara konsisten menyelaraskan tindakan dengan tujuan organisasi. Misalnya, membangun fitur yang mendorong retention, atau menyusun insight data yang langsung mendukung inisiatif bisnis prioritas.' },
  { id: 'sh-qcf4-6', questionId: 'qcf4', scoreValue: 6, anchorText: 'Menunjukkan pemikiran visioner dengan mendorong strategi yang menyelaraskan kepuasan pelanggan dengan tujuan bisnis yang menyeluruh—menjadi kompas arah bagi tim IT, product, maupun data dalam mengambil keputusan yang berorientasi pada nilai jangka panjang.' },

  // qcf5 — Openness for Extra-Role (peer)
  { id: 'sh-qcf5-1', questionId: 'qcf5', scoreValue: 1, anchorText: 'Menghindari berkontribusi di luar tanggung jawab langsung, terutama ketika bisa memberikan manfaat jangka panjang—misalnya tidak mau terlibat dalam diskusi product roadmap atau tidak bersedia membantu inisiatif peningkatan proses meski ada kapasitas.' },
  { id: 'sh-qcf5-2', questionId: 'qcf5', scoreValue: 2, anchorText: 'Sesekali bersedia berkontribusi pada aktivitas ekstra tapi kurang konsisten atau antusias—misalnya ikut membantu testing di luar sprint hanya jika dipaksa, atau baru mau berkontribusi ke dokumentasi setelah diminta berulang kali.' },
  { id: 'sh-qcf5-3', questionId: 'qcf5', scoreValue: 3, anchorText: 'Sesekali berpartisipasi dalam aktivitas yang berkontribusi pada keberhasilan jangka panjang tapi lebih mengutamakan pekerjaan yang segera—misalnya kadang ikut serta dalam knowledge sharing atau retrospective improvement tapi belum menjadi kebiasaan.' },
  { id: 'sh-qcf5-4', questionId: 'qcf5', scoreValue: 4, anchorText: 'Sering mengambil aktivitas di luar peran utamanya yang meningkatkan keberhasilan jangka panjang bisnis—misalnya aktif berkontribusi pada improvement tooling internal, membantu onboarding anggota tim baru, atau mengusulkan standar pengembangan yang lebih baik.' },
  { id: 'sh-qcf5-5', questionId: 'qcf5', scoreValue: 5, anchorText: 'Secara rutin mengambil tanggung jawab tambahan yang menciptakan nilai signifikan bagi bisnis jangka panjang—misalnya memimpin inisiatif peningkatan observability sistem, membangun template analisis data yang digunakan lintas tim, atau menginisiasi program mentoring teknis.' },
  { id: 'sh-qcf5-6', questionId: 'qcf5', scoreValue: 6, anchorText: 'Aktif mencari dan memimpin inisiatif ekstra yang menghasilkan perbaikan lasting bagi bisnis—menjadi penggerak utama budaya continuous improvement di seluruh divisi IT, product, maupun data.' },

  // qki1 — Openness for Feedbacks (peer)
  { id: 'sh-qki1-1', questionId: 'qki1', scoreValue: 1, anchorText: 'Menghindari atau menolak menerima feedback, menunjukkan minim minat untuk berkembang—misalnya defensif saat mendapat komentar di code review, atau tidak merespons catatan dari QA dengan tindak lanjut yang nyata.' },
  { id: 'sh-qki1-2', questionId: 'qki1', scoreValue: 2, anchorText: 'Sesekali menerima feedback tapi jarang menindaklanjutinya secara nyata—misalnya mengakui poin di retrospective tapi tidak ada perubahan yang terlihat di sprint berikutnya.' },
  { id: 'sh-qki1-3', questionId: 'qki1', scoreValue: 3, anchorText: 'Menerima feedback dalam situasi rutin dan membuat upaya yang moderat untuk memperbaiki diri—misalnya merespons komentar di pull request dengan perbaikan yang diminta tapi belum secara aktif mencari feedback tambahan.' },
  { id: 'sh-qki1-4', questionId: 'qki1', scoreValue: 4, anchorText: 'Secara aktif mencari feedback dan membuat upaya yang konsisten untuk menerapkannya—misalnya meminta input dari lead mengenai arsitektur kode, menindaklanjuti catatan dari design review, atau menggunakan feedback dari data stakeholder untuk meningkatkan kualitas laporan.' },
  { id: 'sh-qki1-5', questionId: 'qki1', scoreValue: 5, anchorText: 'Secara konsisten mencari feedback dari berbagai sumber—peer, lead, maupun stakeholder—dan menerapkannya secara efektif untuk tumbuh. Perkembangan ini terlihat nyata dalam kualitas kerja dari satu cycle ke cycle berikutnya.' },
  { id: 'sh-qki1-6', questionId: 'qki1', scoreValue: 6, anchorText: 'Menciptakan budaya feedback dalam tim, mendorong dan membimbing orang lain untuk aktif mencari dan menggunakan masukan yang konstruktif—menjadi teladan dalam pertumbuhan berbasis feedback di seluruh divisi.' },

  // qki2 — Openness for Challenges (peer)
  { id: 'sh-qki2-1', questionId: 'qki2', scoreValue: 1, anchorText: 'Ragu-ragu atau menolak mengambil pekerjaan yang menantang atau tugas baru. Tidak menunjukkan rasa ingin tahu atau motivasi untuk berkembang—misalnya selalu memilih task yang sudah familiar dan menghindari fitur atau area teknis yang belum dikuasai.' },
  { id: 'sh-qki2-2', questionId: 'qki2', scoreValue: 2, anchorText: 'Menunjukkan keterbatasan dalam kemauan mengambil tantangan, sering butuh dorongan—misalnya baru mau mencoba teknologi baru setelah ditekan, atau menolak mengambil task yang sedikit di luar comfort zone.' },
  { id: 'sh-qki2-3', questionId: 'qki2', scoreValue: 3, anchorText: 'Sesekali mengambil pekerjaan yang menantang dengan panduan atau motivasi dari orang lain—misalnya mau mencoba mengerjakan modul baru kalau ada senior yang memandu, atau berpartisipasi dalam spike teknis kalau diajak.' },
  { id: 'sh-qki2-4', questionId: 'qki2', scoreValue: 4, anchorText: 'Secara rutin mengambil tugas yang menantang dengan antusias dan rasa ingin tahu yang nyata—misalnya aktif mengajukan diri untuk mengerjakan feature yang kompleks, mengeksplorasi teknologi baru yang relevan, atau mengambil tantangan analisis data yang belum pernah dikerjakan sebelumnya.' },
  { id: 'sh-qki2-5', questionId: 'qki2', scoreValue: 5, anchorText: 'Menunjukkan motivasi yang kuat untuk mengambil pekerjaan yang menantang dan memimpin proyek-proyek penting—misalnya memimpin inisiatif migrasi sistem, mengambil alih analisis data kritikal dengan timeline ketat, atau menjadi pelopor penerapan praktik engineering baru di tim.' },
  { id: 'sh-qki2-6', questionId: 'qki2', scoreValue: 6, anchorText: 'Secara konsisten mengajukan diri dan unggul dalam proyek paling kompleks atau kritis, menginspirasi orang lain dengan antusiasme dan ketangguhannya dalam menghadapi tantangan apapun.' },

  // qki3 — Growth-Mindset (peer)
  { id: 'sh-qki3-1', questionId: 'qki3', scoreValue: 1, anchorText: 'Memegang teguh status quo dan tidak menunjukkan inisiatif untuk memperbaiki atau mengadaptasi proses—misalnya tidak pernah mempertanyakan cara kerja yang sudah lama berjalan meski jelas ada inefisiensi, atau tidak mau mengadopsi tools baru yang lebih efektif.' },
  { id: 'sh-qki3-2', questionId: 'qki3', scoreValue: 2, anchorText: 'Melihat proses yang ada sebagai sesuatu yang tetap dan tidak dapat diubah, menunjukkan sedikit dorongan untuk menantang atau memperbaikinya—misalnya tahu ada workflow yang tidak efisien tapi tidak mengambil langkah apapun untuk memperbaikinya.' },
  { id: 'sh-qki3-3', questionId: 'qki3', scoreValue: 3, anchorText: 'Menunjukkan inisiatif dasar untuk memperbaiki proses yang ada tapi jarang menantang status quo—misalnya mengusulkan perbaikan kecil saat retrospective tapi tidak pernah mendorong perubahan yang lebih mendasar.' },
  { id: 'sh-qki3-4', questionId: 'qki3', scoreValue: 4, anchorText: 'Secara rutin mengidentifikasi area untuk perbaikan dan mengambil langkah nyata—misalnya mengusulkan refactoring modul yang sudah lamban, memperbaiki alur estimasi di product, atau mengoptimasi query data yang tidak efisien.' },
  { id: 'sh-qki3-5', questionId: 'qki3', scoreValue: 5, anchorText: 'Secara proaktif memperbaiki proses di tim, menunjukkan komitmen kuat terhadap continuous improvement—misalnya memimpin inisiatif adopsi CI/CD yang lebih baik, menginisiasi review framework analisis data, atau mendorong penerapan design system yang konsisten.' },
  { id: 'sh-qki3-6', questionId: 'qki3', scoreValue: 6, anchorText: 'Mendorong perbaikan transformatif—menantang praktik yang sudah usang dan menciptakan solusi inovatif yang mengangkat seluruh tim ke level berikutnya dalam hal engineering excellence, product quality, atau data-driven decision making.' },

  // qki4 — Adaptable/Agility (peer)
  { id: 'sh-qki4-1', questionId: 'qki4', scoreValue: 1, anchorText: 'Kesulitan signifikan dalam menghadapi perubahan dan gagal meningkatkan skill untuk memenuhi tuntutan yang terus berkembang—misalnya menolak perubahan stack teknologi atau tidak menyesuaikan diri saat ada perubahan prioritas produk yang mendadak.' },
  { id: 'sh-qki4-2', questionId: 'qki4', scoreValue: 2, anchorText: 'Menunjukkan kemampuan adaptasi yang terbatas terhadap perubahan dan kesulitan mengikuti perkembangan teknologi atau praktik terbaru—misalnya lambat beradaptasi dengan framework baru atau workflow baru yang diadopsi tim.' },
  { id: 'sh-qki4-3', questionId: 'qki4', scoreValue: 3, anchorText: 'Cukup mampu beradaptasi dengan perubahan dan membuat upaya untuk memperbarui skill—misalnya mau belajar teknologi baru meski butuh waktu lebih lama dari yang diharapkan, atau menyesuaikan diri dengan perubahan prioritas sprint meski awalnya kurang nyaman.' },
  { id: 'sh-qki4-4', questionId: 'qki4', scoreValue: 4, anchorText: 'Menunjukkan kemampuan beradaptasi yang baik dalam situasi yang berubah dan secara aktif memperbarui skill—misalnya cepat menguasai tools atau framework baru, menyesuaikan strategi analisis ketika data source berubah, atau dengan mudah beralih ke prioritas product yang berbeda.' },
  { id: 'sh-qki4-5', questionId: 'qki4', scoreValue: 5, anchorText: 'Beradaptasi dengan mulus terhadap perubahan apapun dan proaktif mempelajari skill baru sebelum dibutuhkan—misalnya sudah mengeksplorasi teknologi AI/ML untuk product bahkan sebelum ada permintaan, atau membangun pemahaman tentang domain baru yang akan jadi fokus tim ke depan.' },
  { id: 'sh-qki4-6', questionId: 'qki4', scoreValue: 6, anchorText: 'Menjadi standar acuan agility—selalu menjadi yang paling siap menghadapi perubahan dan yang paling cepat menguasai hal baru. Menginspirasi tim untuk merangkul perubahan sebagai kesempatan, bukan hambatan.' },

  // qki5 — Proactive Learner (peer)
  { id: 'sh-qki5-1', questionId: 'qki5', scoreValue: 1, anchorText: 'Menunggu secara pasif untuk kesempatan belajar dan berkembang. Jarang mencari pertumbuhan pribadi—misalnya tidak pernah membaca dokumentasi teknis terbaru, tidak mengikuti perkembangan di bidang IT, product, maupun data, atau tidak pernah mengikuti pelatihan secara sukarela.' },
  { id: 'sh-qki5-2', questionId: 'qki5', scoreValue: 2, anchorText: 'Menunjukkan upaya minimal dalam mencari kesempatan belajar dan pengembangan diri—misalnya hanya mengikuti pelatihan yang diwajibkan perusahaan tanpa menginisiasi pembelajaran tambahan.' },
  { id: 'sh-qki5-3', questionId: 'qki5', scoreValue: 3, anchorText: 'Sesekali mencari kesempatan belajar tapi sering bergantung pada program terstruktur atau wajib—misalnya mengikuti workshop yang dijadwalkan tim tapi tidak aktif mencari kursus atau resource di luar itu.' },
  { id: 'sh-qki5-4', questionId: 'qki5', scoreValue: 4, anchorText: 'Secara proaktif mencari kesempatan untuk pengembangan diri—misalnya mengikuti kursus online tentang teknologi terbaru yang relevan, aktif di komunitas engineering atau product, atau mandiri mempelajari teknik analisis data baru untuk diterapkan di pekerjaan.' },
  { id: 'sh-qki5-5', questionId: 'qki5', scoreValue: 5, anchorText: 'Secara rutin terlibat dalam aktivitas belajar mandiri yang secara signifikan meningkatkan kapabilitas personal dan profesional—misalnya mengambil sertifikasi cloud, mendalami machine learning untuk data engineering, atau menantang diri dengan side project yang memperluas wawasan teknis.' },
  { id: 'sh-qki5-6', questionId: 'qki5', scoreValue: 6, anchorText: 'Menjadi role model pembelajaran sepanjang hayat di tim. Membimbing orang lain dan memperkenalkan kesempatan belajar yang memberikan manfaat bagi seluruh tim—misalnya menginisiasi internal tech talk, mendirikan pembelajaran rutin lintas fungsi antara IT, product, dan data.' },

  // qsa1 — Goal Achievement (self)
  { id: 'sh-qsa1-1', questionId: 'qsa1', scoreValue: 1, anchorText: 'Sebagian besar target tidak tercapai di periode ini. Sering melewatkan deadline dan belum ada langkah nyata untuk memperbaikinya.' },
  { id: 'sh-qsa1-2', questionId: 'qsa1', scoreValue: 2, anchorText: 'Beberapa target tercapai, tapi hasilnya tidak konsisten. Masih kesulitan memprioritaskan pekerjaan dan menyelesaikan komitmen yang sudah disepakati.' },
  { id: 'sh-qsa1-3', questionId: 'qsa1', scoreValue: 3, anchorText: 'Sebagian besar target tercapai sesuai ekspektasi. Hasil kerja cukup baik meski masih ada beberapa gap dalam eksekusi atau follow-up.' },
  { id: 'sh-qsa1-4', questionId: 'qsa1', scoreValue: 4, anchorText: 'Target konsisten tercapai, sesekali melampaui ekspektasi. Mampu mengelola prioritas dengan baik dan bekerja mandiri tanpa banyak arahan.' },
  { id: 'sh-qsa1-5', questionId: 'qsa1', scoreValue: 5, anchorText: 'Target selalu tercapai dan sering melampaui ekspektasi. Menunjukkan inisiatif tinggi dan memberikan dampak lebih dari yang ditugaskan.' },
  { id: 'sh-qsa1-6', questionId: 'qsa1', scoreValue: 6, anchorText: 'Mencapai hasil luar biasa di semua target. Menghadirkan solusi atau improvement yang memberikan nilai signifikan bagi tim dan produk.' },

  // qsa2 — Technical & Functional Contribution (self)
  { id: 'sh-qsa2-1', questionId: 'qsa2', scoreValue: 1, anchorText: 'Kontribusi teknis/fungsional minim. Tugas-tugas utama sering tidak selesai atau membutuhkan banyak bantuan dari orang lain.' },
  { id: 'sh-qsa2-2', questionId: 'qsa2', scoreValue: 2, anchorText: 'Bisa menyelesaikan tugas rutin tapi masih bergantung pada panduan atau bantuan untuk pekerjaan yang lebih kompleks. Kontribusi ke tim atau proyek terbatas.' },
  { id: 'sh-qsa2-3', questionId: 'qsa2', scoreValue: 3, anchorText: 'Menyelesaikan tugas teknis/fungsional sesuai standar yang ditetapkan. Berkontribusi pada tim di level yang diharapkan.' },
  { id: 'sh-qsa2-4', questionId: 'qsa2', scoreValue: 4, anchorText: 'Secara konsisten memberikan kontribusi teknis/fungsional yang solid. Aktif berkontribusi di luar tugas utama, misalnya membantu code review, dokumentasi, atau sharing knowledge ke tim.' },
  { id: 'sh-qsa2-5', questionId: 'qsa2', scoreValue: 5, anchorText: 'Memberikan kontribusi teknis/fungsional yang melampaui ekspektasi. Proaktif mencari cara baru untuk meningkatkan kualitas kerja, proses, atau produk.' },
  { id: 'sh-qsa2-6', questionId: 'qsa2', scoreValue: 6, anchorText: 'Menjadi referensi teknis/fungsional di tim. Kontribusi yang diberikan berdampak nyata pada kualitas produk, efisiensi tim, atau keputusan bisnis.' },

  // qsa3 — Self Development & Learning (self)
  { id: 'sh-qsa3-1', questionId: 'qsa3', scoreValue: 1, anchorText: 'Tidak ada upaya aktif untuk belajar hal baru atau mengembangkan skill di bidang IT/product/data selama periode ini.' },
  { id: 'sh-qsa3-2', questionId: 'qsa3', scoreValue: 2, anchorText: 'Sesekali mengikuti pelatihan atau membaca materi baru, tapi belum konsisten dan jarang diterapkan ke pekerjaan sehari-hari.' },
  { id: 'sh-qsa3-3', questionId: 'qsa3', scoreValue: 3, anchorText: 'Cukup aktif belajar hal baru, namun masih bergantung pada program yang sudah tersedia. Penerapannya ke pekerjaan masih bertahap.' },
  { id: 'sh-qsa3-4', questionId: 'qsa3', scoreValue: 4, anchorText: 'Secara proaktif mencari ilmu baru yang relevan dengan pekerjaan, baik melalui kursus online, dokumentasi teknis, atau komunitas IT/product/data. Hasilnya mulai terlihat dalam kualitas kerja.' },
  { id: 'sh-qsa3-5', questionId: 'qsa3', scoreValue: 5, anchorText: 'Rutin belajar mandiri dan langsung menerapkan ke pekerjaan. Perkembangan skill terlihat jelas dan berkontribusi nyata pada hasil kerja di tim.' },
  { id: 'sh-qsa3-6', questionId: 'qsa3', scoreValue: 6, anchorText: 'Menjadi contoh dalam pengembangan diri. Aktif berbagi pengetahuan ke tim, membantu orang lain berkembang, dan membawa perspektif baru yang mengangkat kualitas seluruh tim.' },

  // qsa4 — Collaboration & Communication (self)
  { id: 'sh-qsa4-1', questionId: 'qsa4', scoreValue: 1, anchorText: 'Jarang berkomunikasi dengan baik ke tim, stakeholder, atau lintas divisi. Cara berkolaborasi sering menghambat progress pekerjaan.' },
  { id: 'sh-qsa4-2', questionId: 'qsa4', scoreValue: 2, anchorText: 'Ikut serta dalam diskusi tim tapi komunikasinya belum efektif. Kadang informasi tidak disampaikan tepat waktu atau kurang jelas.' },
  { id: 'sh-qsa4-3', questionId: 'qsa4', scoreValue: 3, anchorText: 'Komunikasi dan kolaborasi cukup baik di situasi normal. Terkadang perlu perbaikan dalam menangani diskusi yang lebih kompleks atau dengan pihak lain di luar tim langsung.' },
  { id: 'sh-qsa4-4', questionId: 'qsa4', scoreValue: 4, anchorText: 'Berkomunikasi dengan jelas dan efektif, baik secara tertulis maupun lisan. Aktif berkolaborasi lintas tim dan membantu menyelesaikan miskomunikasi sebelum jadi masalah besar.' },
  { id: 'sh-qsa4-5', questionId: 'qsa4', scoreValue: 5, anchorText: 'Menjadi penghubung yang kuat dalam tim dan lintas divisi. Komunikasi yang dibangun menciptakan kepercayaan dan mempercepat pengambilan keputusan.' },
  { id: 'sh-qsa4-6', questionId: 'qsa4', scoreValue: 6, anchorText: 'Menjadi contoh dalam kolaborasi dan komunikasi. Secara aktif membangun ekosistem kerja yang terbuka, transparan, dan produktif—baik untuk engineering, product, maupun data.' },

  // qsa5 — Self-Awareness & Impact (self)
  { id: 'sh-qsa5-1', questionId: 'qsa5', scoreValue: 1, anchorText: 'Belum menyadari bagaimana perilaku dan keputusan sehari-hari berdampak ke orang lain atau ke jalannya pekerjaan tim.' },
  { id: 'sh-qsa5-2', questionId: 'qsa5', scoreValue: 2, anchorText: 'Kadang menyadari dampak dari tindakan sendiri tapi jarang mengambil langkah perbaikan setelah menerima feedback.' },
  { id: 'sh-qsa5-3', questionId: 'qsa5', scoreValue: 3, anchorText: 'Cukup memahami dampak dari cara kerja sendiri dalam situasi sehari-hari. Mulai menerima dan merespons feedback meski belum konsisten.' },
  { id: 'sh-qsa5-4', questionId: 'qsa5', scoreValue: 4, anchorText: 'Secara rutin merefleksikan cara kerja dan dampaknya ke tim. Mau menerima feedback dan menggunakannya untuk memperbaiki diri secara nyata.' },
  { id: 'sh-qsa5-5', questionId: 'qsa5', scoreValue: 5, anchorText: 'Punya kesadaran diri yang kuat. Aktif meminta feedback dari berbagai pihak dan secara konsisten menyesuaikan pendekatan untuk memberikan dampak positif ke tim.' },
  { id: 'sh-qsa5-6', questionId: 'qsa5', scoreValue: 6, anchorText: 'Menjadi contoh dalam kesadaran diri dan keterbukaan terhadap feedback. Sikap ini menginspirasi orang lain untuk lebih reflektif dan mendorong budaya belajar yang sehat di tim.' },
];

// ── Score Hint Examples (ERD v6: score_hint_examples table) ───────────────────────────────
const mockScoreHintExamples: ScoreHintExample[] = [];


// ── Store Interface ────────────────────────────────────────────────────────────────────────
interface QuestionStore {
  goalCategories: GoalCategory[];
  questions: Question[];
  scoreHints: ScoreHint[];
  scoreHintExamples: ScoreHintExample[];

  // Goal Category CRUD
  addGoalCategory: (cat: Omit<GoalCategory, 'id'>) => void;
  updateGoalCategory: (id: string, updates: Partial<Omit<GoalCategory, 'id'>>) => void;
  deleteGoalCategory: (id: string) => void;

  // Question CRUD
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<Omit<Question, 'id'>>) => void;
  deleteQuestion: (id: string) => void;

  // ScoreHint CRUD
  addScoreHint: (hint: Omit<ScoreHint, 'id'>) => void;
  updateScoreHint: (id: string, updates: Partial<Omit<ScoreHint, 'id'>>) => void;
  deleteScoreHint: (id: string) => void;

  // ScoreHintExample CRUD
  addScoreHintExample: (example: Omit<ScoreHintExample, 'id'>) => void;
  updateScoreHintExample: (id: string, updates: Partial<Omit<ScoreHintExample, 'id'>>) => void;
  deleteScoreHintExample: (id: string) => void;

  // Selectors
  getQuestionsByReviewType: (reviewType: ReviewType) => Question[];
  getHintsForQuestion: (questionId: string) => ScoreHint[];
}

export const useQuestionStore = create<QuestionStore>((set, get) => ({
  goalCategories: DEFAULT_GOAL_CATEGORIES,
  questions: mockQuestions,
  scoreHints: mockScoreHints,
  scoreHintExamples: mockScoreHintExamples,

  addGoalCategory: (cat) =>
    set((s) => ({ goalCategories: [...s.goalCategories, { ...cat, id: generateId() }] })),
  updateGoalCategory: (id, updates) =>
    set((s) => ({ goalCategories: s.goalCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
  deleteGoalCategory: (id) =>
    set((s) => ({ goalCategories: s.goalCategories.filter((c) => c.id !== id) })),

  addQuestion: (question) =>
    set((s) => ({ questions: [...s.questions, { ...question, id: generateId() }] })),
  updateQuestion: (id, updates) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)) })),
  deleteQuestion: (id) =>
    set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),

  addScoreHint: (hint) =>
    set((s) => ({ scoreHints: [...s.scoreHints, { ...hint, id: generateId() }] })),
  updateScoreHint: (id, updates) =>
    set((s) => ({ scoreHints: s.scoreHints.map((h) => (h.id === id ? { ...h, ...updates } : h)) })),
  deleteScoreHint: (id) =>
    set((s) => ({ scoreHints: s.scoreHints.filter((h) => h.id !== id) })),

  addScoreHintExample: (example) =>
    set((s) => ({ scoreHintExamples: [...s.scoreHintExamples, { ...example, id: generateId() }] })),
  updateScoreHintExample: (id, updates) =>
    set((s) => ({ scoreHintExamples: s.scoreHintExamples.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
  deleteScoreHintExample: (id) =>
    set((s) => ({ scoreHintExamples: s.scoreHintExamples.filter((e) => e.id !== id) })),

  getQuestionsByReviewType: (reviewType) =>
    get().questions.filter((q) => q.reviewType === reviewType).sort((a, b) => a.order - b.order),

  getHintsForQuestion: (questionId) =>
    get().scoreHints.filter((h) => h.questionId === questionId).sort((a, b) => a.scoreValue - b.scoreValue),
}));

/** @deprecated Use useQuestionStore instead */
export const useTemplateStore = useQuestionStore;

