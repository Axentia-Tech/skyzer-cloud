var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
let OrdersController = (() => {
    let _classDecorators = [ApiTags('Orders'), Controller('orders')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createOrder_decorators;
    let _getUserOrders_decorators;
    let _getOrder_decorators;
    var OrdersController = _classThis = class {
        constructor(ordersService) {
            this.ordersService = (__runInitializers(this, _instanceExtraInitializers), ordersService);
        }
        async createOrder(req, body) {
            const order = await this.ordersService.createOrder(req.user.sub, body.productId);
            return {
                success: true,
                data: order,
            };
        }
        async getUserOrders(req) {
            const orders = await this.ordersService.getUserOrders(req.user.sub);
            return {
                success: true,
                data: orders,
            };
        }
        async getOrder(req, id) {
            const order = await this.ordersService.getOrder(id, req.user.sub);
            return {
                success: true,
                data: order,
            };
        }
    };
    __setFunctionName(_classThis, "OrdersController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createOrder_decorators = [Post(), UseGuards(JwtAuthGuard), ApiBearerAuth(), ApiOperation({ summary: 'Create order (returns Tebex checkout link)' })];
        _getUserOrders_decorators = [Get(), UseGuards(JwtAuthGuard), ApiBearerAuth(), ApiOperation({ summary: 'Get user orders' })];
        _getOrder_decorators = [Get(':id'), UseGuards(JwtAuthGuard), ApiBearerAuth(), ApiOperation({ summary: 'Get order details' })];
        __esDecorate(_classThis, null, _createOrder_decorators, { kind: "method", name: "createOrder", static: false, private: false, access: { has: obj => "createOrder" in obj, get: obj => obj.createOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserOrders_decorators, { kind: "method", name: "getUserOrders", static: false, private: false, access: { has: obj => "getUserOrders" in obj, get: obj => obj.getUserOrders }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrder_decorators, { kind: "method", name: "getOrder", static: false, private: false, access: { has: obj => "getOrder" in obj, get: obj => obj.getOrder }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrdersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrdersController = _classThis;
})();
export { OrdersController };
//# sourceMappingURL=orders.controller.js.map