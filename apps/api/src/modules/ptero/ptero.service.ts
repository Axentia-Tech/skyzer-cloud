import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PteroUserPayload, PteroServerPayload } from '@skyzer/shared';

@Injectable()
export class PteroService {
  private readonly logger = new Logger(PteroService.name);
  private axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
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

  async createUser(payload: PteroUserPayload) {
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
    } catch (error) {
      this.logger.error(`Failed to create Pterodactyl user: ${error.message}`);
      throw error;
    }
  }

  async updateUserPassword(userId: number, newPassword: string) {
    try {
      this.logger.debug(`Updating password for Pterodactyl user: ${userId}`);

      await this.axiosInstance.post(`/api/application/users/${userId}/password`, {
        password: newPassword,
      });

      this.logger.log(`Password updated for Pterodactyl user: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to update password for Pterodactyl user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  async createServer(payload: PteroServerPayload) {
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
    } catch (error) {
      this.logger.error(`Failed to create server: ${error.message}`);
      throw error;
    }
  }

  async getServer(serverId: number) {
    try {
      const response = await this.axiosInstance.get(
        `/api/application/servers/${serverId}?include=allocations,variables`,
      );

      return response.data.object;
    } catch (error) {
      this.logger.error(`Failed to get server ${serverId}: ${error.message}`);
      throw error;
    }
  }

  async deleteServer(serverId: number, force = false) {
    try {
      this.logger.debug(`Deleting server: ${serverId} (force=${force})`);

      await this.axiosInstance.delete(`/api/application/servers/${serverId}?force=${force}`);

      this.logger.log(`Server deleted: ${serverId}`);
    } catch (error) {
      this.logger.error(`Failed to delete server ${serverId}: ${error.message}`);
      throw error;
    }
  }

  async getAllocations(nodeId: number) {
    try {
      const response = await this.axiosInstance.get(
        `/api/application/nodes/${nodeId}/allocations?per_page=50`,
      );

      return response.data.data;
    } catch (error) {
      this.logger.error(`Failed to get allocations for node ${nodeId}: ${error.message}`);
      throw error;
    }
  }

  async getEggs(nestId: number) {
    try {
      const response = await this.axiosInstance.get(`/api/application/nests/${nestId}/eggs`);

      return response.data.data;
    } catch (error) {
      this.logger.error(`Failed to get eggs for nest ${nestId}: ${error.message}`);
      throw error;
    }
  }
}
