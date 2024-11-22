import { Controller, UseInterceptors } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
    constructor(private readonly medicoService: MedicoService) {}
}
