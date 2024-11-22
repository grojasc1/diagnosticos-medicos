import { Controller } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';

@Controller('diagnosticos')
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}
}
