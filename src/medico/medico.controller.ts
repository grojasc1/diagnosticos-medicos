import { Controller } from '@nestjs/common';
import { MedicoService } from './medico.service';

@Controller('medicos')
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}
}
