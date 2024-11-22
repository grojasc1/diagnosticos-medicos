import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,
    ){}

    async findAll() {
        return await this.pacienteRepository.find({relations: ['diagnosticos', 'medicos']});
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {pacienteId: id}, relations: ['diagnosticos', 'medicos']});
        if (!paciente) {
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
    
        }
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (paciente.nombre.length < 3) {
            throw new BusinessLogicException("The name of the patient is too short", BusinessError.BAD_REQUEST);
        }
        return await this.pacienteRepository.save(paciente);
    }


    async delete(id: string) {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {pacienteId: id}});
        if (!paciente) {
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (paciente.diagnosticos.length > 0) {
            throw new BusinessLogicException("The patient has diagnosticos associated with it", BusinessError.PRECONDITION_FAILED);
        }
        await this.pacienteRepository.remove(paciente);
    }
}
