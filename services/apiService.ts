import { User, UserRole, FarmerPlan, Product, Article, Comment, Like, Order, ChatConversation, ChatMessage } from '../types';
import { initialUsers, initialProducts, initialArticles, initialComments, initialLikes } from './initialData';

// --- Helper Functions ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Main ApiService Class ---
class ApiService {
    private users: User[] = [];
    private products: Product[] = [];
    private articles: Article[] = [];
    private comments: Comment[] = [];
    private likes: Like[] = [];
    private orders: Order[] = [];
    private conversations: ChatConversation[] = [];

    constructor() {
        this.init();
    }

    private init() {
        // Load data from localStorage or use initial data
        this.users = this.load('users', initialUsers);
        this.products = this.load('products', initialProducts);
        this.articles = this.load('articles', initialArticles);
        this.comments = this.load('comments', initialComments);
        this.likes = this.load('likes', initialLikes);
        this.orders = this.load('orders', []);
        this.conversations = this.load('conversations', []);
    }

    private load<T>(key: string, initialData: T): T {
        try {
            const stored = localStorage.getItem(`teman-tani-${key}`);
            return stored ? JSON.parse(stored) : initialData;
        } catch (e) {
            console.error(`Failed to load ${key} from localStorage`, e);
            return initialData;
        }
    }

    private save(key: string, data: any) {
        try {
            localStorage.setItem(`teman-tani-${key}`, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save ${key} to localStorage`, e);
        }
    }

    // --- User Management ---
    async getUsers(): Promise<User[]> {
        return [...this.users];
    }

    async authenticateUser(email: string, password_raw: string): Promise<User | null> {
        if (email === 'admin@gmail.com' && password_raw === 'admin') {
            const admin = this.users.find(u => u.email === email);
            return admin || null;
        }
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        // In a real app, passwords would be hashed. Here we do a plain text check.
        if (user && user.password === password_raw) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    async createUser(userData: Omit<User, 'id' | 'joinDate' | 'plan'> & { password?: string }): Promise<User> {
        if (this.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            throw new Error("Email already exists");
        }
        const newUser: User = {
            id: generateId(),
            ...userData,
            joinDate: new Date().toISOString(),
            plan: userData.role === UserRole.FARMER ? FarmerPlan.FREE : undefined,
        };
        this.users.push(newUser);
        this.save('users', this.users);
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    
    async updateUser(userId: string, updateData: Partial<Omit<User, 'id' | 'joinDate' | 'password'>>): Promise<User> {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error("User not found");
        
        this.users[userIndex] = { ...this.users[userIndex], ...updateData };
        this.save('users', this.users);
        const { password, ...userWithoutPassword } = this.users[userIndex];
        return userWithoutPassword;
    }

    async deleteUser(userId: string): Promise<void> {
        this.users = this.users.filter(u => u.id !== userId);
        // Also delete related data
        this.products = this.products.filter(p => p.farmerId !== userId);
        this.comments = this.comments.filter(c => c.userId !== userId);
        this.likes = this.likes.filter(l => l.userId !== userId);
        this.save('users', this.users);
        this.save('products', this.products);
        this.save('comments', this.comments);
        this.save('likes', this.likes);
    }


    // --- Product Management ---
    async getProducts(): Promise<Product[]> {
        return [...this.products];
    }
    
    async getProductsByFarmer(farmerId: string): Promise<Product[]> {
        return this.products.filter(p => p.farmerId === farmerId);
    }
    
    async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        const newProduct: Product = { id: generateId(), ...productData };
        this.products.push(newProduct);
        this.save('products', this.products);
        return newProduct;
    }
    
    async updateProduct(productId: string, updateData: Partial<Omit<Product, 'id' | 'farmerId'>>): Promise<Product> {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) throw new Error("Product not found");
        this.products[productIndex] = { ...this.products[productIndex], ...updateData };
        this.save('products', this.products);
        return this.products[productIndex];
    }
    
    async deleteProduct(productId: string): Promise<void> {
        this.products = this.products.filter(p => p.id !== productId);
        this.save('products', this.products);
    }


    // --- Article, Comment, Like Management ---
    async getArticles(): Promise<Article[]> {
        return [...this.articles];
    }
    
    async createArticle(articleData: Omit<Article, 'id' | 'publishDate'>): Promise<Article> {
        const newArticle: Article = { id: generateId(), publishDate: new Date().toISOString(), ...articleData };
        this.articles.push(newArticle);
        this.save('articles', this.articles);
        return newArticle;
    }
    
    async updateArticle(articleId: string, updateData: Partial<Omit<Article, 'id' | 'publishDate' | 'authorId'>>): Promise<Article> {
         const articleIndex = this.articles.findIndex(a => a.id === articleId);
        if (articleIndex === -1) throw new Error("Article not found");
        this.articles[articleIndex] = { ...this.articles[articleIndex], ...updateData };
        this.save('articles', this.articles);
        return this.articles[articleIndex];
    }
    
    async deleteArticle(articleId: string): Promise<void> {
        this.articles = this.articles.filter(a => a.id !== articleId);
        this.comments = this.comments.filter(c => c.articleId !== articleId);
        this.likes = this.likes.filter(l => l.articleId !== articleId);
        this.save('articles', this.articles);
        this.save('comments', this.comments);
        this.save('likes', this.likes);
    }

    async getCommentsForArticle(articleId: string): Promise<Comment[]> {
        return this.comments.filter(c => c.articleId === articleId);
    }

    async addComment(articleId: string, userId: string, content: string): Promise<Comment> {
        const newComment: Comment = {
            id: generateId(),
            articleId,
            userId,
            content,
            timestamp: new Date().toISOString(),
        };
        this.comments.push(newComment);
        this.save('comments', this.comments);
        return newComment;
    }

    async getLikesForArticle(articleId: string): Promise<Like[]> {
        return this.likes.filter(l => l.articleId === articleId);
    }

    async toggleLike(articleId: string, userId: string): Promise<void> {
        const likeIndex = this.likes.findIndex(l => l.articleId === articleId && l.userId === userId);
        if (likeIndex > -1) {
            this.likes.splice(likeIndex, 1);
        } else {
            this.likes.push({ id: generateId(), articleId, userId });
        }
        this.save('likes', this.likes);
    }
    
    // --- Order Management ---
    async createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
        const newOrder: Order = {
            id: generateId(),
            ...orderData,
            orderDate: new Date().toISOString(),
            status: 'Pending',
        };
        this.orders.push(newOrder);
        this.save('orders', this.orders);
        return newOrder;
    }
    
    async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
        return this.orders.filter(o => o.buyerId === buyerId).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }

    async getOrdersByFarmer(farmerId: string): Promise<Order[]> {
        const farmerProductIds = this.products.filter(p => p.farmerId === farmerId).map(p => p.id);
        return this.orders.filter(o => farmerProductIds.includes(o.productId)).sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    }

    // --- Chat Management ---
    async getConversationsForUser(userId: string): Promise<ChatConversation[]> {
        return this.conversations.filter(c => c.participants.includes(userId))
            .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());
    }

    async getOrCreateConversation(userId1: string, userId2: string): Promise<ChatConversation> {
        let conversation = this.conversations.find(c =>
            c.participants.includes(userId1) && c.participants.includes(userId2)
        );

        if (!conversation) {
            conversation = {
                id: generateId(),
                participants: [userId1, userId2],
                messages: [],
                lastMessageTimestamp: new Date().toISOString(),
            };
            this.conversations.push(conversation);
            this.save('conversations', this.conversations);
        }
        return conversation;
    }

    async sendMessage(conversationId: string, senderId: string, text: string): Promise<ChatMessage> {
        const conversationIndex = this.conversations.findIndex(c => c.id === conversationId);
        if (conversationIndex === -1) throw new Error("Conversation not found");

        const newMessage: ChatMessage = {
            id: generateId(),
            senderId,
            text,
            timestamp: new Date().toISOString(),
        };
        
        this.conversations[conversationIndex].messages.push(newMessage);
        this.conversations[conversationIndex].lastMessageTimestamp = newMessage.timestamp;
        this.save('conversations', this.conversations);
        return newMessage;
    }
}


// --- Initial Data for localStorage ---
// This file is now part of the service to keep it self-contained.
const initialData = {
    // initial users, products, etc.
};


// Export a singleton instance of the service
export const api = new ApiService();
