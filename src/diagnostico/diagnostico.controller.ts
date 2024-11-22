import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';
import { plainToInstance } from 'class-transformer';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}

    @Get()
    async findAll() {
        return await this.diagnosticoService.findAll();
    }

    @Get(':diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string) {
        return await this.diagnosticoService.findOne(diagnosticoId);
    }

    @Post()
    async create(@Body() diagnosticoDto: DiagnosticoDto) {
        const diagnostico = plainToInstance(DiagnosticoEntity, diagnosticoDto);
        return await this.diagnosticoService.create(diagnostico);
    }

    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string) {
        await this.diagnosticoService.delete(diagnosticoId);
    }
}
