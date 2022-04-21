import {
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
  Response,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DftService } from './dft.service';
import { Transfer } from '@prisma/client';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dftService: DftService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('getTransfers?')
  async getTrades(@Query('tokenName') tokenName: string): Promise<string> {
    return await this.dftService.getTransfers(tokenName);
  }
  @Get('getBalances?')
  async getBalances(@Query('tokenName') tokenName: string): Promise<string> {
    return await this.dftService.getBalances(tokenName);
  }

  @Get('getTransfersCSV?')
  async getTransfersCSV(
    @Query('tokenName') tokenName: string,
    @Response({ passthrough: true }) res,
  ): Promise<any> {
    const data = await this.dftService.getTransfersCSV(tokenName);
    const buffer = Readable.from(data);
    res.set({
      'Content-Type': 'text/csv',
      // 'Content-Disposition': 'attachment; filename=transfers.csv',
    });

    return data;
  }
  @Get('getBalancesCSV?')
  async getBalancesCSV(
    @Query('tokenName') tokenName: string,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const data = await this.dftService.getBalancesCSV(tokenName);
    const buffer = Readable.from(data);
    res.set({
      'Content-Disposition': 'attachment; filename="Transfers.csv"',
    });
    return new StreamableFile(buffer);
  }

  @Get('getOwner?')
  async getOwner(@Query('tokenName') tokenName: string): Promise<string> {
    return await this.dftService.getOwner(tokenName);
  }
  @Get('updateTrades?')
  async updateTrades(
    @Query('tokenName') tokenName: string,
    @Query('start') start: number,
    @Query('count') count: number,
  ): Promise<string> {
    return await this.dftService.updateTrades(tokenName, start, count);
  }

  @Get('clearAndRestart')
  async clearAndRestart() {
    return await this.dftService.clearAndRestart();
  }
}
