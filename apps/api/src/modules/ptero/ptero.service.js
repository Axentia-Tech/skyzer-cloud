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
import axios from 'axios';
let PteroService = (() => {
    let _classDecorators = [Injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PteroService = _classThis = class {
        constructor(configService) {
            this.configService = configService;
            this.logger = new Logger(PteroService.name);
            const pteroUrl = this.configService.get('PTERODACTYL_URL') || 'http://pterodactyl:8080';
            const pteroKey = this.configService.get('PTERODACTYL_API_KEY');
            this.axiosInstance = axios.create({
                baseURL: pteroUrl,
                headers: {
                    Authorization: `Bearer ${pteroKey}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
        }
        async createUser(payload) {
            try {
                this.logger.debug(`Creating Pterodactyl user: ${payload.email}`);
                const response = await this.axiosInstance.post('/api/application/users', {
                    email: payload.email,
                    username: payload.username,
                    password: payload.password,
                    first_name: payload.firstName || 'User',
                    last_name: payload.lastName || '',
                });
                this.logger.log(`Pterodactyl user created: ${response.data.object.id}`);
                return {
                    id: response.data.object.id,
                    username: response.data.object.username,
                    email: response.data.object.email,
                };
            }
            catch (error) {
                this.logger.error(`Failed to create Pterodactyl user: ${error.message}`);
                throw error;
            }
        }
        async updateUserPassword(userId, newPassword) {
            try {
                this.logger.debug(`Updating password for Pterodactyl user: ${userId}`);
                await this.axiosInstance.post(`/api/application/users/${userId}/password`, {
                    password: newPassword,
                });
                this.logger.log(`Password updated for Pterodactyl user: ${userId}`);
            }
            catch (error) {
                this.logger.error(`Failed to update password for Pterodactyl user ${userId}: ${error.message}`);
                throw error;
            }
        }
        async createServer(payload) {
            try {
                this.logger.debug(`Creating server for user: ${payload.userId}`);
                const response = await this.axiosInstance.post('/api/application/servers', {
                    name: payload.name,
                    description: payload.description,
                    user_id: payload.userId,
                    nest_id: payload.nestId,
                    egg_id: payload.eggId,
                    docker_image: 'ghcr.io/pterodactyl/yolks:java_17',
                    startup: 'cd /home/container && java -Xmx{{SERVER_MEMORY}}M -Xms128M -jar server.jar nogui',
                    limits: {
                        memory: payload.limits.memory,
                        swap: payload.limits.swap,
                        disk: payload.limits.disk,
                        io: payload.limits.io,
                        cpu: payload.limits.cpu,
                    },
                    feature_limits: {
                        backups: payload.featureLimits.backups,
                        databases: payload.featureLimits.databases,
                        allocations: payload.featureLimits.allocations,
                    },
                    allocation: {
                        default: payload.allocationId,
                    },
                });
                this.logger.log(`Server created: ${response.data.object.id} for user ${payload.userId}`);
                return {
                    id: response.data.object.id,
                    name: response.data.object.name,
                    ip: response.data.object.relationships?.allocation?.data?.attributes?.ip,
                    port: response.data.object.relationships?.allocation?.data?.attributes?.port,
                };
            }
            catch (error) {
                this.logger.error(`Failed to create server: ${error.message}`);
                throw error;
            }
        }
        async getServer(serverId) {
            try {
                const response = await this.axiosInstance.get(`/api/application/servers/${serverId}?include=allocations,variables`);
                return response.data.object;
            }
            catch (error) {
                this.logger.error(`Failed to get server ${serverId}: ${error.message}`);
                throw error;
            }
        }
        async deleteServer(serverId, force = false) {
            try {
                this.logger.debug(`Deleting server: ${serverId} (force=${force})`);
                await this.axiosInstance.delete(`/api/application/servers/${serverId}?force=${force}`);
                this.logger.log(`Server deleted: ${serverId}`);
            }
            catch (error) {
                this.logger.error(`Failed to delete server ${serverId}: ${error.message}`);
                throw error;
            }
        }
        async getAllocations(nodeId) {
            try {
                const response = await this.axiosInstance.get(`/api/application/nodes/${nodeId}/allocations?per_page=50`);
                return response.data.data;
            }
            catch (error) {
                this.logger.error(`Failed to get allocations for node ${nodeId}: ${error.message}`);
                throw error;
            }
        }
        async getEggs(nestId) {
            try {
                const response = await this.axiosInstance.get(`/api/application/nests/${nestId}/eggs`);
                return response.data.data;
            }
            catch (error) {
                this.logger.error(`Failed to get eggs for nest ${nestId}: ${error.message}`);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "PteroService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PteroService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PteroService = _classThis;
})();
export { PteroService };
//# sourceMappingURL=ptero.service.js.map