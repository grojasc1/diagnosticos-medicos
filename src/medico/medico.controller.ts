import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MedicoDto } from './medico.dto/medico.dto';
import { plainToInstance } from 'class-transformer';
import { MedicoEntity } from './medico.entity/medico.entity';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}

    @Get()
    async findAll() {
        return await this.medicoService.findAll();
    }

    @Get(':medicoId')
    async findOne(@Param('medicoId') medicoId: string) {
        return await this.medicoService.findOne(medicoId);
    }

    @Post()
    async create(@Body() medicoDto: MedicoDto) {
        const medico = plainToInstance(MedicoEntity, medicoDto);
        return await this.medicoService.create(medico);
    }

    @Delete(':medicoId')
    @HttpCode(204)
    async delete(@Param('medicoId') medicoId: string) {
        await this.medicoService.delete(medicoId);
    }
}
