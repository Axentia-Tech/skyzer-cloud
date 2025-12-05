// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// User Types
export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

// Product Types
export interface ProductLimits {
  ram: number; // MB
  cpu: number; // percentage
  disk: number; // MB
  databases: number;
  backups: number;
  slots: number;
}

export interface ProductDto {
  id: string;
  name: string;
  description?: string;
  slug: string;
  priceAmount: number;
  priceCurrency: string;
  billingCycle: string;
  isFree: boolean;
  limits: ProductLimits;
  createdAt: string;
}

// Order Types
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'PROVISIONING'
  | 'ACTIVE'
  | 'CANCELLED'
  | 'SUSPENDED';

export interface OrderDto {
  id: string;
  userId: string;
  productId: string;
  product?: ProductDto;
  status: OrderStatus;
  paymentAmount: number;
  paymentCurrency: string;
  isRecurring: boolean;
  createdAt: string;
  paidAt?: string;
  expiresAt?: string;
}

// Server Types
export interface ServerDto {
  id: string;
  userId: string;
  orderId: string;
  pteroServerId?: number;
  ip?: string;
  port?: number;
  hostname?: string;
  status: string;
  createdAt: string;
}

// Tebex Types
export interface TebexCheckoutRequest {
  userId: string;
  productId: string;
}

export interface TebexOrderWebhook {
  id: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
  packages: Array<{
    id: number;
    name: string;
  }>;
  price: {
    amount: number;
    currency: string;
  };
  created_at: string;
  status: string;
}

// Pterodactyl Types
export interface PteroUserPayload {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface PteroServerPayload {
  nodeId: number;
  allocationId: number;
  name: string;
  description: string;
  userId: number;
  eggId: number;
  nestId: number;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  featureLimits: {
    backups: number;
    databases: number;
    allocations: number;
  };
}

// Provisioning Job Types
export type JobType = 'create_server' | 'delete_server' | 'update_limits' | 'sync_status';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ProvisioningJobPayload {
  serverId: string;
  orderId: string;
  userId: string;
  jobType: JobType;
  payload: Record<string, unknown>;
}
