import { Controller } from '@nestjs/common';
import { PacienteService } from './paciente.service';

@Controller('pacientes')
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}
}
