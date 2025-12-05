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
import { Injectable, Logger } from '@nestjs/common';
let WebhooksService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WebhooksService = _classThis = class {
        constructor(prisma) {
            this.prisma = prisma;
            this.logger = new Logger(WebhooksService.name);
        }
        async processTebexWebhook(payload) {
            /**
             * Tebex Webhook Handler
             *
             * This function:
             * 1. Validates webhook signature (should verify HMAC)
             * 2. Extracts order metadata (orderId, userId, productId)
             * 3. Checks for idempotency (prevent duplicate processing)
             * 4. Updates order status to PAID
             * 5. Triggers provisioning job in queue
             * 6. Logs webhook for audit
             */
            // TODO: Verify webhook signature using Tebex secret
            // Extract order data
            const orderId = payload.metadata?.orderId;
            const eventType = payload.type; // e.g., "order.completed"
            if (!orderId) {
                this.logger.warn(`Tebex webhook missing orderId: ${JSON.stringify(payload)}`);
                return { status: 'skipped' };
            }
            // Check for idempotency
            const existingLog = await this.prisma.webhookLog.findFirst({
                where: {
                    orderId,
                    provider: 'tebex',
                    eventType,
                },
            });
            if (existingLog?.processed) {
                this.logger.log(`Tebex webhook already processed: ${orderId}`);
                return { status: 'already_processed' };
            }
            try {
                // Get order
                const order = await this.prisma.order.findUnique({
                    where: { id: orderId },
                });
                if (!order) {
                    this.logger.error(`Order not found: ${orderId}`);
                    return { status: 'order_not_found' };
                }
                // Update order to PAID
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                        tebexOrderId: payload.id,
                    },
                });
                // Log webhook
                await this.prisma.webhookLog.create({
                    data: {
                        orderId,
                        provider: 'tebex',
                        eventType,
                        payload,
                        processed: true,
                        processedAt: new Date(),
                        result: { status: 'success' },
                    },
                });
                this.logger.log(`Order paid: ${orderId}`);
                // TODO: Trigger provisioning job in BullMQ queue
                return { status: 'success', orderId };
            }
            catch (error) {
                this.logger.error(`Error processing Tebex webhook: ${error.message}`);
                // Log error
                await this.prisma.webhookLog.create({
                    data: {
                        orderId,
                        provider: 'tebex',
                        eventType,
                        payload,
                        processed: false,
                        error: error.message,
                    },
                });
                throw error;
            }
        }
        async processPterodactylWebhook(payload) {
            /**
             * Pterodactyl Webhook Handler
             *
             * Handles server lifecycle events:
             * - server.installed
             * - server.install_failed
             * - token.created
             * etc.
             */
            this.logger.debug(`Processing Pterodactyl webhook: ${payload.type}`);
            // Log for audit
            await this.prisma.webhookLog.create({
                data: {
                    orderId: '', // If needed, map server to order
                    provider: 'pterodactyl',
                    eventType: payload.type,
                    payload,
                    processed: true,
                    processedAt: new Date(),
                },
            });
            return { status: 'logged' };
        }
    };
    __setFunctionName(_classThis, "WebhooksService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhooksService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhooksService = _classThis;
})();
export { WebhooksService };
//# sourceMappingURL=webhooks.service.js.map