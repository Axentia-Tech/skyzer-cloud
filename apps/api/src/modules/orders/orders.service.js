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
import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
let OrdersService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var OrdersService = _classThis = class {
        constructor(prisma, configService) {
            this.prisma = prisma;
            this.configService = configService;
            this.logger = new Logger(OrdersService.name);
        }
        async createOrder(userId, productId) {
            this.logger.debug(`Creating order for user ${userId}, product ${productId}`);
            // Get product
            const product = await this.prisma.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new NotFoundException('Product not found');
            }
            // Create order
            const order = await this.prisma.order.create({
                data: {
                    userId,
                    productId,
                    status: 'PENDING',
                    paymentAmount: product.priceAmount,
                    paymentCurrency: product.priceCurrency,
                },
                include: { product: true },
            });
            this.logger.log(`Order created: ${order.id}`);
            // Generate Tebex checkout link
            // In real app, call Tebex API to create checkout
            const checkoutLink = this.generateTebexCheckoutLink(order.id, product);
            return {
                order: this.mapOrderToDto(order),
                checkoutLink,
            };
        }
        async getUserOrders(userId) {
            const orders = await this.prisma.order.findMany({
                where: { userId },
                include: { product: true },
                orderBy: { createdAt: 'desc' },
            });
            return orders.map((o) => this.mapOrderToDto(o));
        }
        async getOrder(id, userId) {
            const order = await this.prisma.order.findUnique({
                where: { id },
                include: { product: true },
            });
            if (!order) {
                throw new NotFoundException('Order not found');
            }
            if (order.userId !== userId) {
                throw new ForbiddenException('You do not have access to this order');
            }
            return this.mapOrderToDto(order);
        }
        generateTebexCheckoutLink(orderId, product) {
            // This is a placeholder - in production, call Tebex API
            const baseUrl = this.configService.get('TEBEX_CHECKOUT_BASE_URL') || 'https://checkout.tebex.io';
            return `${baseUrl}/?orderId=${orderId}&productId=${product.tebexProductId}`;
        }
        mapOrderToDto(order) {
            return {
                id: order.id,
                userId: order.userId,
                productId: order.productId,
                product: order.product,
                status: order.status,
                paymentAmount: order.paymentAmount,
                paymentCurrency: order.paymentCurrency,
                isRecurring: order.isRecurring,
                createdAt: order.createdAt.toISOString(),
                paidAt: order.paidAt?.toISOString(),
                expiresAt: order.expiresAt?.toISOString(),
            };
        }
    };
    __setFunctionName(_classThis, "OrdersService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersService = _classThis;
})();
export { OrdersService };
//# sourceMappingURL=orders.service.js.map