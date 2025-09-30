
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
}

export enum FarmerPlan {
  FREE = 'FREE',
  PRO = 'PRO',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client, but needed for creation
  role: UserRole;
  address: string;
  city: string;
  province: string;
  joinDate: string;
  plan?: FarmerPlan; // Optional, mainly for farmers
}

export interface SensorDataPoint {
  time: string;
  value: number;
}

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    rainfall: number;
  };
  forecast: {
    day: string;
    temp: number;
    icon: string;
  }[];
}

export interface EcoScore {
  total: number;
  waterEfficiency: number;
  fertilizerUse: number;
  productivity: number;
  wasteManagement: number;
}

export interface IrrigationLog {
  date: string;
  startTime: string;
  duration: string;
  volume: number;
}

export interface MarketPrice {
  month: string;
  price: number;
}

// FIX: Renamed from ChatMessage to BotMessage for AI chatbot to avoid conflicts.
export interface BotMessage {
    role: 'user' | 'model';
    text: string;
}

// FIX: Added ChatMessage interface for user-to-user chat.
export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

// FIX: Added ChatConversation interface for user-to-user chat.
export interface ChatConversation {
    id: string;
    participants: string[];
    messages: ChatMessage[];
    lastMessageTimestamp: string;
}

// FIX: Added Order interface for marketplace transactions.
export interface Order {
    id: string;
    buyerId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    orderDate: string;
    status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: 'kg' | 'ikat' | 'buah' | 'liter';
    stock: number;
    imageUrl: string;
    farmerId: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    authorId: string;
    publishDate: string;
    tags: string[];
}

export interface Comment {
    id: string;
    articleId: string;
    userId: string;
    content: string;
    timestamp: string;
}

export interface Like {
    id: string;
    articleId: string;
    userId: string;
}
