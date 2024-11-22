import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class MedicoService {
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>,
    ){}

    async findAll(): Promise<MedicoEntity[]> {
        return await this.medicoRepository.find({relations: ['pacientes']});
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {medicoId: id}, relations: ['pacientes']});
        if (!medico) {
            throw new Error("The medic with the given id was not found");
        }
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if (medico.nombre === undefined || medico.especialidad === undefined) {
            throw new BusinessLogicException("The name and the especialidad of the medic are required", BusinessError.BAD_REQUEST);
        }
        return await this.medicoRepository.save(medico);
    }


    async delete(id: string) {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {medicoId: id}});
        if (!medico) {
            throw new BusinessLogicException("The medic with the given id was not found", BusinessError.NOT_FOUND);
        }

        if (medico.pacientes.length > 0) {
            throw new BusinessLogicException("The medic has patients associated with it", BusinessError.PRECONDITION_FAILED);
        }
        await this.medicoRepository.remove(medico);
    }
}
