import { Controller, Post, Body, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('tebex')
  @ApiOperation({ summary: 'Handle Tebex payment webhook' })
  async handleTebexWebhook(@Body() payload: any) {
    this.logger.debug(`Received Tebex webhook: ${JSON.stringify(payload)}`);

    try {
      const result = await this.webhooksService.processTebexWebhook(payload);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error processing Tebex webhook: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @Post('pterodactyl')
  @ApiOperation({ summary: 'Handle Pterodactyl events' })
  async handlePterodactylWebhook(@Body() payload: any) {
    this.logger.debug(`Received Pterodactyl webhook: ${JSON.stringify(payload)}`);

    try {
      const result = await this.webhooksService.processPterodactylWebhook(payload);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error processing Pterodactyl webhook: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
