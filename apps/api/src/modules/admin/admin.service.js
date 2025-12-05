var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
let AdminService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AdminService = _classThis = class {
        constructor(prisma) {
            this.prisma = prisma;
            this.logger = new Logger(AdminService.name);
        }
        // Products
        async getAllProducts() {
            return this.prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        async createProduct(data) {
            return this.prisma.product.create({
                data: {
                    name: data.name,
                    description: data.description,
                    slug: data.slug,
                    priceAmount: data.priceAmount,
                    priceCurrency: data.priceCurrency,
                    billingCycle: data.billingCycle || 'monthly',
                    isFree: data.isFree || false,
                    isActive: data.isActive !== false,
                    tebexProductId: data.tebexProductId,
                    pteroEggId: data.pteroEggId,
                    pteroNestId: data.pteroNestId,
                    limits: data.limits,
                },
            });
        }
        async updateProduct(id, data) {
            const product = await this.prisma.product.findUnique({ where: { id } });
            if (!product)
                throw new NotFoundException('Product not found');
            return this.prisma.product.update({
                where: { id },
                data,
            });
        }
        async deleteProduct(id) {
            const product = await this.prisma.product.findUnique({ where: { id } });
            if (!product)
                throw new NotFoundException('Product not found');
            return this.prisma.product.delete({ where: { id } });
        }
        // Orders
        async getAllOrders() {
            return this.prisma.order.findMany({
                include: { user: true, product: true },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        }
        // Users
        async getAllUsers() {
            return this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    isSuspended: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        }
        async suspendUser(userId, reason) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new NotFoundException('User not found');
            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    isSuspended: true,
                    suspendedAt: new Date(),
                    suspensionReason: reason,
                },
            });
        }
        // Logs
        async getAuditLogs() {
            return this.prisma.auditLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        }
        async getWebhookLogs() {
            return this.prisma.webhookLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
        }
    };
    __setFunctionName(_classThis, "AdminService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
})();
export { AdminService };
//# sourceMappingURL=admin.service.js.map