import { Controller, UseInterceptors } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) {}
}
