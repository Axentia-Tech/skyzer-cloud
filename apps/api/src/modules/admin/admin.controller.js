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
import { Controller, Get, Post, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
let AdminController = (() => {
    let _classDecorators = [ApiTags('Admin'), Controller('admin'), UseGuards(JwtAuthGuard), ApiBearerAuth()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getAllProducts_decorators;
    let _createProduct_decorators;
    let _updateProduct_decorators;
    let _deleteProduct_decorators;
    let _getAllOrders_decorators;
    let _getAllUsers_decorators;
    let _suspendUser_decorators;
    let _getAuditLogs_decorators;
    let _getWebhookLogs_decorators;
    var AdminController = _classThis = class {
        constructor(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        // Products
        async getAllProducts() {
            const products = await this.adminService.getAllProducts();
            return { success: true, data: products };
        }
        async createProduct(data) {
            const product = await this.adminService.createProduct(data);
            return { success: true, data: product };
        }
        async updateProduct(id, data) {
            const product = await this.adminService.updateProduct(id, data);
            return { success: true, data: product };
        }
        async deleteProduct(id) {
            await this.adminService.deleteProduct(id);
            return { success: true };
        }
        // Orders
        async getAllOrders() {
            const orders = await this.adminService.getAllOrders();
            return { success: true, data: orders };
        }
        // Users
        async getAllUsers() {
            const users = await this.adminService.getAllUsers();
            return { success: true, data: users };
        }
        async suspendUser(id, data) {
            await this.adminService.suspendUser(id, data.reason);
            return { success: true };
        }
        // Logs
        async getAuditLogs() {
            const logs = await this.adminService.getAuditLogs();
            return { success: true, data: logs };
        }
        async getWebhookLogs() {
            const logs = await this.adminService.getWebhookLogs();
            return { success: true, data: logs };
        }
    };
    __setFunctionName(_classThis, "AdminController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllProducts_decorators = [Get('products'), ApiOperation({ summary: 'Get all products (admin)' })];
        _createProduct_decorators = [Post('products'), ApiOperation({ summary: 'Create product' })];
        _updateProduct_decorators = [Put('products/:id'), ApiOperation({ summary: 'Update product' })];
        _deleteProduct_decorators = [Delete('products/:id'), ApiOperation({ summary: 'Delete product' })];
        _getAllOrders_decorators = [Get('orders'), ApiOperation({ summary: 'Get all orders (admin)' })];
        _getAllUsers_decorators = [Get('users'), ApiOperation({ summary: 'Get all users (admin)' })];
        _suspendUser_decorators = [Put('users/:id/suspend'), ApiOperation({ summary: 'Suspend user' })];
        _getAuditLogs_decorators = [Get('audit-logs'), ApiOperation({ summary: 'Get audit logs' })];
        _getWebhookLogs_decorators = [Get('webhook-logs'), ApiOperation({ summary: 'Get webhook logs' })];
        __esDecorate(_classThis, null, _getAllProducts_decorators, { kind: "method", name: "getAllProducts", static: false, private: false, access: { has: obj => "getAllProducts" in obj, get: obj => obj.getAllProducts }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createProduct_decorators, { kind: "method", name: "createProduct", static: false, private: false, access: { has: obj => "createProduct" in obj, get: obj => obj.createProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProduct_decorators, { kind: "method", name: "updateProduct", static: false, private: false, access: { has: obj => "updateProduct" in obj, get: obj => obj.updateProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteProduct_decorators, { kind: "method", name: "deleteProduct", static: false, private: false, access: { has: obj => "deleteProduct" in obj, get: obj => obj.deleteProduct }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllOrders_decorators, { kind: "method", name: "getAllOrders", static: false, private: false, access: { has: obj => "getAllOrders" in obj, get: obj => obj.getAllOrders }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllUsers_decorators, { kind: "method", name: "getAllUsers", static: false, private: false, access: { has: obj => "getAllUsers" in obj, get: obj => obj.getAllUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _suspendUser_decorators, { kind: "method", name: "suspendUser", static: false, private: false, access: { has: obj => "suspendUser" in obj, get: obj => obj.suspendUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAuditLogs_decorators, { kind: "method", name: "getAuditLogs", static: false, private: false, access: { has: obj => "getAuditLogs" in obj, get: obj => obj.getAuditLogs }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWebhookLogs_decorators, { kind: "method", name: "getWebhookLogs", static: false, private: false, access: { has: obj => "getWebhookLogs" in obj, get: obj => obj.getWebhookLogs }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
})();
export { AdminController };
//# sourceMappingURL=admin.controller.js.map