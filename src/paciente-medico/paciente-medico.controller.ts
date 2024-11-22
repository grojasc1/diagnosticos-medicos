import { Controller, Param, Post } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('pacientes')
export class PacienteMedicoController {
    constructor(
        private readonly pacienteMedicoService: PacienteMedicoService
    ) {}

    @Post(':pacienteId/medicos/:medicoId')
    async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }
}
