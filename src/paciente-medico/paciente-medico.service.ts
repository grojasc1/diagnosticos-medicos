import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteMedicoService {
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,

        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ) {}

    async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {pacienteId}, relations: ['medicos', 'diagnosticos']});
        if (!paciente) {
            throw new BusinessLogicException("The patient with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (paciente.medicos.length > 5) {
            throw new BusinessLogicException("The patient has too many medicos associated with it", BusinessError.PRECONDITION_FAILED);
        }

        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {medicoId}, relations: ['pacientes']});
        if (!medico) {
            throw new BusinessLogicException("The medic with the given id was not found", BusinessError.NOT_FOUND);
        }

        paciente.medicos = [...paciente.medicos, medico];
        return await this.pacienteRepository.save(paciente);
    }
}
