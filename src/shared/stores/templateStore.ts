import { create } from 'zustand';
import type { QuestionTemplate, Question, GoalCategory } from '@/shared/types';
import { resolveTemplate } from '@/lib/templateResolver';
import { generateId } from '@/lib/utils';
import type { ReviewType } from '@/shared/types';

export const DEFAULT_GOAL_CATEGORIES: GoalCategory[] = [
  { id: 'gc1', name: 'Delivery & Reliability',        slug: 'delivery_reliability',        description: 'Konsistensi menyelesaikan task sesuai estimasi dan komitmen' },
  { id: 'gc2', name: 'Technical Quality',              slug: 'technical_quality',            description: 'Kualitas kode, solusi teknis, dan engineering standard' },
  { id: 'gc3', name: 'Collaboration & Communication', slug: 'collaboration_communication',   description: 'Efektivitas kerja sama dan komunikasi dalam tim' },
  { id: 'gc4', name: 'Ownership & Initiative',         slug: 'ownership_initiative',          description: 'Rasa kepemilikan, proaktivitas, dan inisiatif di luar scope' },
  { id: 'gc5', name: 'Learning & Growth',              slug: 'learning_growth',               description: 'Perkembangan skill dan pertumbuhan profesional' },
];

const mockTemplates: QuestionTemplate[] = [
  { id: 'tmpl1', name: 'General Peer Review',               reviewType: 'peer',    reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl2', name: 'Self Assessment',                   reviewType: 'self',    reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl3', name: 'Manager Review',                    reviewType: 'manager', reviewerRoleId: null, revieweeRoleId: null, priority: 1 },
  { id: 'tmpl4', name: 'Senior Eng → Engineer Peer Review', reviewType: 'peer',    reviewerRoleId: 'r2', revieweeRoleId: 'r3', priority: 2 },
  { id: 'tmpl5', name: 'QA / Tester Peer Review',           reviewType: 'peer',    reviewerRoleId: null, revieweeRoleId: null, priority: 3 },
  { id: 'tmpl6', name: 'Data Role Peer Review',             reviewType: 'peer',    reviewerRoleId: null, revieweeRoleId: null, priority: 3 },
];

const mockQuestions: Question[] = [
  // ── tmpl1 · General Peer Review ───────────────────────────────────────────────────────────
  { id: 'qp1',  templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 1,  text: 'Apakah dia memberikan update status tugas secara transparan dan proaktif tanpa perlu sering ditanya?' },
  { id: 'qp2',  templateId: 'tmpl1', categoryId: 'gc4', type: 'score', order: 2,  text: 'Apakah dia memahami kebutuhan bisnis atau produk dan memberikan solusi yang relevan?' },
  { id: 'qp3',  templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 3,  text: 'Apakah dia responsif dan terbuka saat berdiskusi mengenai prioritas atau perubahan requirement?' },
  { id: 'qp4',  templateId: 'tmpl1', categoryId: 'gc1', type: 'score', order: 4,  text: 'Apakah dia realistis dalam menyepakati komitmen sprint sesuai kapasitas dan dependencies?' },
  { id: 'qp5',  templateId: 'tmpl1', categoryId: 'gc4', type: 'score', order: 5,  text: 'Saat menghadapi masalah atau blocker, apakah dia datang dengan usulan solusi bukan hanya melaporkan masalah?' },
  { id: 'qp6',  templateId: 'tmpl1', categoryId: 'gc2', type: 'score', order: 6,  text: 'Apakah dia melengkapi pekerjaannya dengan dokumentasi teknis yang cukup (jika diperlukan)?' },
  { id: 'qp7',  templateId: 'tmpl1', categoryId: 'gc2', type: 'score', order: 7,  text: 'Apakah dia memberikan review PR yang teliti namun tetap konstruktif?' },
  { id: 'qp8',  templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 8,  text: 'Apakah dia terbuka menerima masukan terkait desain/flow dan enak diajak tektokan?' },
  { id: 'qp9',  templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 9,  text: 'Apakah dia menunjukkan sikap positif dan fokus mencari solusi saat ada masalah (tidak menyalahkan orang lain)?' },
  { id: 'qp10', templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 10, text: 'Apakah dia berkontribusi menciptakan lingkungan kerja yang aman, suportif, dan saling menghargai?' },
  { id: 'qp11', templateId: 'tmpl1', categoryId: 'gc3', type: 'score', order: 11, text: 'Apakah dia bersedia membantu rekan lain yang sedang kesulitan (sharing knowledge/pairing)?' },
  { id: 'qpe1', templateId: 'tmpl1', categoryId: null, type: 'essay', order: 12, text: 'START (Mulai Lakukan): Apa satu hal yang sebaiknya mulai dilakukan atau ditingkatkan oleh yang bersangkutan untuk membantu efektivitas tim?' },
  { id: 'qpe2', templateId: 'tmpl1', categoryId: null, type: 'essay', order: 13, text: 'STOP (Hentikan): Adakah perilaku atau cara kerja yang menghambat tim dan sebaiknya dihentikan atau dikurangi?' },
  { id: 'qpe3', templateId: 'tmpl1', categoryId: null, type: 'essay', order: 14, text: 'CONTINUE (Lanjutkan): Apa kekuatan atau perilaku positif yang paling Anda hargai dari yang bersangkutan dan harus tetap dipertahankan?' },
  { id: 'qpe4', templateId: 'tmpl1', categoryId: null, type: 'essay', order: 15, text: 'Adakah hal lain yang ingin Anda sampaikan secara privat kepada Manager terkait performa yang bersangkutan?' },

  // ── tmpl2 · Self Assessment ────────────────────────────────────────────────────────────
  { id: 'qs1',  templateId: 'tmpl2', categoryId: 'gc1', type: 'score', order: 1,
    text: 'Seberapa baik kamu memenuhi komitmen sprint dan akurasi estimasimu?',
    scoreHints: { 1: 'Sering miss target dan estimasi jauh meleset', 2: 'Sebagian tercapai tapi sering carry over', 3: 'Mayoritas komitmen tercapai sesuai estimasi', 4: 'Konsisten tepat waktu dan estimasi realistis' } },
  { id: 'qs2',  templateId: 'tmpl2', categoryId: 'gc2', type: 'score', order: 2,
    text: 'Seberapa puas kamu dengan kualitas kode dan pengujian (testing) yang kamu buat?',
    scoreHints: { 1: 'Sering menimbulkan bug atau rework', 2: 'Kualitas cukup tapi masih sering ada temuan di QA', 3: 'Kode rapi dan bug minimal', 4: 'Kualitas sangat baik, jarang bug dan mudah di-maintain' } },
  { id: 'qs3',  templateId: 'tmpl2', categoryId: 'gc3', type: 'score', order: 3,
    text: 'Seberapa efektif komunikasimu dengan tim dan stakeholder?',
    scoreHints: { 1: 'Jarang update dan sering miss info', 2: 'Komunikasi ada tapi belum proaktif', 3: 'Komunikasi jelas dan tepat waktu', 4: 'Sangat proaktif dan membantu menyelaraskan tim' } },
  { id: 'qs4',  templateId: 'tmpl2', categoryId: 'gc4', type: 'score', order: 4,
    text: 'Seberapa besar tanggung jawabmu dalam menuntaskan tugas secara mandiri?',
    scoreHints: { 1: 'Sering menunggu arahan', 2: 'Bisa mandiri tapi masih sering bergantung', 3: 'Mampu menyelesaikan tugas end-to-end', 4: 'Sangat ownership, menyelesaikan sampai tuntas tanpa disuruh' } },
  { id: 'qs5',  templateId: 'tmpl2', categoryId: 'gc5', type: 'score', order: 5,
    text: 'Seberapa besar inisiatif dan kemauan kamu dalam melakukan research teknis atau mempelajari hal baru demi kemajuan tim?',
    scoreHints: { 1: 'Jarang belajar hal baru', 2: 'Belajar jika diminta', 3: 'Aktif belajar dan menerapkan', 4: 'Sangat inisiatif dan berbagi insight ke tim' } },
  { id: 'qs6',  templateId: 'tmpl2', categoryId: 'gc4', type: 'score', order: 6,
    text: 'Sejauh mana kamu memahami dampak bisnis dari fitur yang kamu kerjakan terhadap pengguna?',
    scoreHints: { 1: 'Hanya fokus pada tiket/koding', 2: 'Tahu tujuan fitur tapi tidak terlalu peduli metrik', 3: 'Memahami tujuan bisnis di balik tugas dan aktif memberi saran UX', 4: 'Mengusulkan solusi yang meningkatkan kepuasan user dan bisnis' } },
  { id: 'qs7',  templateId: 'tmpl2', categoryId: 'gc3', type: 'score', order: 7,
    text: 'Seberapa besar kontribusimu dalam membantu rekan tim berkembang atau mempermudah kerja tim?',
    scoreHints: { 1: 'Fokus tugas sendiri saja', 2: 'Membantu jika ditanya', 3: 'Aktif memberikan review berkualitas dan dokumentasi', 4: 'Menjadi mentor junior atau menciptakan tools/proses yang mempercepat tim' } },
  { id: 'qs8',  templateId: 'tmpl2', categoryId: 'gc2', type: 'score', order: 8,
    text: 'Bagaimana caramu menghadapi masalah teknis yang kompleks atau technical debt?',
    scoreHints: { 1: 'Sering buntu dan butuh bantuan penuh', 2: 'Bisa menyelesaikan tapi sering pakai quick fix', 3: 'Mampu mendiagnosa root cause secara mandiri', 4: 'Antisipatif terhadap masalah dan aktif mengurangi technical debt' } },
  { id: 'qs9',  templateId: 'tmpl2', categoryId: 'gc1', type: 'score', order: 9,
    text: 'Seberapa baik kamu beradaptasi dengan perubahan prioritas atau kegagalan teknis (incident)?' },
  { id: 'qs10', templateId: 'tmpl2', categoryId: 'gc1', type: 'score', order: 10,
    text: 'Seberapa efektif kamu dalam melakukan estimasi dan manajemen ekspektasi jika ada kendala?',
    scoreHints: { 1: 'Diam saat telat', 2: 'Memberitahu telat saat deadline sudah lewat', 3: 'Memberi update kendala di tengah jalan', 4: 'Proaktif mitigasi risiko dan memberi solusi alternatif sebelum deadline' } },
  { id: 'qs11', templateId: 'tmpl2', categoryId: 'gc4', type: 'score', order: 11,
    text: 'Seberapa sering kamu memberikan masukan untuk memperbaiki proses kerja (workflow) tim?',
    scoreHints: { 1: 'Mengikuti arus saja', 2: 'Memberi masukan jika ditanya saat retro', 3: 'Aktif memberi saran perbaikan proses di tim', 4: 'Menginisiasi perubahan proses nyata seperti otomasi atau standardisasi' } },
  { id: 'qse1', templateId: 'tmpl2', categoryId: 'gc1', type: 'essay', order: 12, text: 'Apa pencapaian terbesarmu dalam 12 bulan terakhir yang paling membuatmu bangga?' },
  { id: 'qse2', templateId: 'tmpl2', categoryId: null, type: 'essay', order: 13, text: 'Hal apa yang paling menghambat produktivitasmu atau membuatmu merasa frustrasi di tim saat ini?' },
  { id: 'qse3', templateId: 'tmpl2', categoryId: null, type: 'essay', order: 14, text: 'Bantuan atau dukungan seperti apa yang kamu harapkan dari Manager agar kamu bisa bekerja lebih efektif?' },
  { id: 'qse4', templateId: 'tmpl2', categoryId: 'gc5', type: 'essay', order: 15, text: 'Skill apa yang ingin kamu kuasai di tahun depan, dan bagaimana peranmu saat ini bisa membantu mencapainya?' },

  // ── tmpl3 · Manager Review ──────────────────────────────────────────────────────────────
  { id: 'qm1',  templateId: 'tmpl3', categoryId: 'gc1', type: 'score', order: 1, text: 'Seberapa baik pencapaian target dan deliverable karyawan ini dalam periode review?' },
  { id: 'qm2',  templateId: 'tmpl3', categoryId: 'gc5', type: 'score', order: 2, text: 'Seberapa signifikan perkembangan dan pertumbuhan profesional karyawan ini?' },
  { id: 'qm3',  templateId: 'tmpl3', categoryId: 'gc4', type: 'score', order: 3, text: 'Seberapa besar dampak kontribusi karyawan ini terhadap tim dan tujuan bisnis?' },
  { id: 'qm4',  templateId: 'tmpl3', categoryId: 'gc3', type: 'score', order: 4, text: 'Seberapa baik karyawan ini mengkomunikasikan progress dan kendala kepada tim dan stakeholder?' },
  { id: 'qme1', templateId: 'tmpl3', categoryId: 'gc1', type: 'essay', order: 5, text: 'Apa kontribusi terbesar karyawan ini dalam periode review ini?' },
  { id: 'qme2', templateId: 'tmpl3', categoryId: 'gc5', type: 'essay', order: 6, text: 'Area pengembangan apa yang perlu difokuskan oleh karyawan ini ke depannya?' },

  // ── tmpl4 · Senior Eng → Engineer Peer Review ─────────────────────────────────────────
  { id: 'qsr1',  templateId: 'tmpl4', categoryId: 'gc2', type: 'score', order: 1, text: 'Seberapa siap karyawan ini mengambil tanggung jawab di level Senior Engineer?' },
  { id: 'qsr2',  templateId: 'tmpl4', categoryId: 'gc4', type: 'score', order: 2, text: 'Seberapa dalam pemahaman teknis dan rasa kepemilikan karyawan ini terhadap sistem yang dikerjakan?' },
  { id: 'qsre1', templateId: 'tmpl4', categoryId: 'gc2', type: 'essay', order: 3, text: 'Kekuatan apa yang akan membuat karyawan ini efektif sebagai Senior Engineer?' },
  { id: 'qsre2', templateId: 'tmpl4', categoryId: 'gc4', type: 'essay', order: 4, text: 'Gap apa yang perlu diselesaikan sebelum promosi ke level Senior Engineer?' },

  // ── tmpl5 · QA / Tester Peer Review ──────────────────────────────────────────────────────
  { id: 'qqa1', templateId: 'tmpl5', categoryId: 'gc2', type: 'score', order: 1, text: 'Apakah dia ikut membantu menemukan akar permasalahan bug (root cause) saat melaporkan issue?' },
  { id: 'qqa2', templateId: 'tmpl5', categoryId: 'gc2', type: 'score', order: 2, text: 'Apakah laporan bug yang dibuat jelas dan lengkap dengan langkah reproduksi (steps to reproduce)?' },
  { id: 'qqa3', templateId: 'tmpl5', categoryId: 'gc2', type: 'score', order: 3, text: 'Apakah dia mengerti prioritas bug (membedakan mana critical, mana minor/kosmetik)?' },
  { id: 'qqa4', templateId: 'tmpl5', categoryId: 'gc2', type: 'score', order: 4, text: 'Apakah dia mengetahui batasan scope testing (tidak melebar kemana-mana di luar requirement)?' },
  { id: 'qqa5', templateId: 'tmpl5', categoryId: 'gc2', type: 'score', order: 5, text: 'Apakah dia memiliki pemahaman mendalam tentang flow produk yang dites?' },
  { id: 'qqa6', templateId: 'tmpl5', categoryId: 'gc5', type: 'score', order: 6, text: 'Apakah dia memiliki keinginan untuk mengetahui cara kerja teknis sistem (blackbox vs whitebox)?' },

  // ── tmpl6 · Data Role Peer Review ────────────────────────────────────────────────────────
  { id: 'qd1', templateId: 'tmpl6', categoryId: 'gc4', type: 'score', order: 1, text: 'Apakah dia memahami business context di balik data yang diolah dan memberikan insight atau solusi data yang relevan?' },
  { id: 'qd2', templateId: 'tmpl6', categoryId: 'gc3', type: 'score', order: 2, text: 'Apakah dia memberikan update mengenai progres data pipeline atau analisis secara transparan, termasuk jika ada blocker terkait ketersediaan data?' },
  { id: 'qd3', templateId: 'tmpl6', categoryId: 'gc2', type: 'score', order: 3, text: 'Apakah output data (dashboard/model/report) yang dihasilkan akurat dan reliable untuk pengambilan keputusan?' },
  { id: 'qd4', templateId: 'tmpl6', categoryId: 'gc1', type: 'score', order: 4, text: 'Apakah dia memberikan tracking requirements yang jelas kepada tim Engineer untuk kebutuhan analytics?' },
  { id: 'qd5', templateId: 'tmpl6', categoryId: 'gc2', type: 'score', order: 5, text: 'Apakah dia memperhatikan performa sistem (query efficiency, resource usage) saat melakukan pengambilan data dari production database?' },
];

interface TemplateStore {
  templates: QuestionTemplate[];
  questions: Question[];
  goalCategories: GoalCategory[];
  addTemplate: (template: Omit<QuestionTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<Omit<QuestionTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
  addQuestion: (question: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<Omit<Question, 'id'>>) => void;
  deleteQuestion: (id: string) => void;
  resolveTemplate: (reviewType: ReviewType, reviewerRoleId: string | null, revieweeRoleId: string | null) => QuestionTemplate | null;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: mockTemplates,
  questions: mockQuestions,
  goalCategories: DEFAULT_GOAL_CATEGORIES,

  addTemplate: (template) =>
    set((s) => ({ templates: [...s.templates, { ...template, id: generateId() }] })),
  updateTemplate: (id, updates) =>
    set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  deleteTemplate: (id) =>
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),

  addQuestion: (question) =>
    set((s) => ({ questions: [...s.questions, { ...question, id: generateId() }] })),
  updateQuestion: (id, updates) =>
    set((s) => ({ questions: s.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)) })),
  deleteQuestion: (id) =>
    set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),

  resolveTemplate: (reviewType, reviewerRoleId, revieweeRoleId) =>
    resolveTemplate(reviewType, reviewerRoleId, revieweeRoleId, get().templates),
}));
