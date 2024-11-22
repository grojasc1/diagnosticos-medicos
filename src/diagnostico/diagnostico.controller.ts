import { Controller, UseInterceptors } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}
}
