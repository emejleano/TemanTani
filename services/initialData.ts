import { User, UserRole, FarmerPlan, Product, Article, Comment, Like } from '../types';

export const initialUsers: User[] = [
    { id: 'admin01', name: 'Admin', email: 'admin@gmail.com', password: 'admin', role: UserRole.ADMIN, address: 'Kantor Pusat', city: 'Jakarta', province: 'DKI Jakarta', joinDate: '2023-01-01T00:00:00Z' },
    { id: 'farmer01', name: 'Budi Santoso', email: 'budi@gmail.com', password: 'password', role: UserRole.FARMER, plan: FarmerPlan.PRO, address: 'Jl. Tani Makmur No. 10', city: 'Subang', province: 'Jawa Barat', joinDate: '2023-05-15T00:00:00Z' },
    { id: 'farmer02', name: 'Siti Aminah', email: 'siti@gmail.com', password: 'password', role: UserRole.FARMER, plan: FarmerPlan.FREE, address: 'Dusun Cempaka RT 02 RW 01', city: 'Boyolali', province: 'Jawa Tengah', joinDate: '2023-06-20T00:00:00Z' },
    { id: 'buyer01', name: 'Andi Wijaya', email: 'andi@gmail.com', password: 'password', role: UserRole.BUYER, address: 'Jl. Merdeka No. 5', city: 'Bandung', province: 'Jawa Barat', joinDate: '2023-07-01T00:00:00Z' },
    { id: 'buyer02', name: 'Rina Lestari', email: 'rina@gmail.com', password: 'password', role: UserRole.BUYER, address: 'Jl. Pahlawan No. 123', city: 'Surabaya', province: 'Jawa Timur', joinDate: '2023-08-10T00:00:00Z' },
];

export const initialProducts: Product[] = [
    { id: 'prod01', name: 'Beras Pandan Wangi Organik', description: 'Beras organik berkualitas tinggi dari sawah Subang, tanpa pestisida. Pulen dan wangi alami.', price: 15000, unit: 'kg', stock: 100, imageUrl: 'https://emejleano.github.io/TemanTani/logo.png', farmerId: 'farmer01' },
    { id: 'prod02', name: 'Cabai Rawit Merah Segar', description: 'Cabai rawit merah segar, dipetik langsung saat ada pesanan. Pedasnya mantap.', price: 50000, unit: 'kg', stock: 25, imageUrl: 'https://emejleano.github.io/TemanTani/logo.png', farmerId: 'farmer01' },
    { id: 'prod03', name: 'Susu Sapi Murni Boyolali', description: 'Susu sapi segar langsung dari peternakan di Boyolali. Kualitas terjamin, tanpa bahan pengawet.', price: 18000, unit: 'liter', stock: 50, imageUrl: 'https://emejleano.github.io/TemanTani/logo.png', farmerId: 'farmer02' },
    { id: 'prod04', name: 'Sayur Bayam Hidroponik', description: 'Bayam segar dan renyah dari kebun hidroponik. Bebas pestisida dan lebih higienis.', price: 5000, unit: 'ikat', stock: 80, imageUrl: 'https://emejleano.github.io/TemanTani/logo.png', farmerId: 'farmer02' },
];

export const initialArticles: Article[] = [
    { id: 'art01', title: '5 Tips Jitu Mengatasi Hama Wereng Secara Organik', content: 'Wereng adalah salah satu hama utama tanaman padi. Untuk mengatasinya secara organik, Anda bisa menggunakan pestisida nabati dari daun nimba atau bawang putih...', authorId: 'admin01', publishDate: '2023-07-10T00:00:00Z', tags: ['padi', 'hama', 'organik'], imageUrl: 'https://emejleano.github.io/TemanTani/logo.png' },
    { id: 'art02', title: 'Cara Membuat Pupuk Kompos Sendiri di Rumah', content: 'Membuat pupuk kompos sangat mudah. Cukup siapkan wadah, campurkan sisa sampah organik dapur seperti sayuran dan buah, dengan sampah coklat seperti daun kering...', authorId: 'admin01', publishDate: '2023-07-12T00:00:00Z', tags: ['pupuk', 'kompos', 'tips'], imageUrl: 'https://emejleano.github.io/TemanTani/logo.png' },
];

export const initialComments: Comment[] = [
    { id: 'com01', articleId: 'art01', userId: 'farmer01', content: 'Terima kasih informasinya, sangat bermanfaat!', timestamp: '2023-07-11T02:00:00Z' },
];

export const initialLikes: Like[] = [
    { id: 'like01', articleId: 'art01', userId: 'farmer02' },
];
