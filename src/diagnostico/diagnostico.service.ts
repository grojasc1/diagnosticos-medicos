import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DiagnosticoService {
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    ) {}

    async findAll() {
        return await this.diagnosticoRepository.find({relations: ['paciente']});
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {diagnosticoId: id}, relations: ['paciente']});
        if (!diagnostico) {
            throw new Error("The diagnostic with the given id was not found");
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.descripcion.length > 200) {
            throw new BusinessLogicException("The description of the diagnostic is too long", BusinessError.BAD_REQUEST);
        }
        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string) {
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where: {diagnosticoId: id}});
        if (!diagnostico) {
            throw new BusinessLogicException("The diagnostic with the given id was not found", BusinessError.NOT_FOUND);
        }

        await this.diagnosticoRepository.remove(diagnostico);
    }
}
