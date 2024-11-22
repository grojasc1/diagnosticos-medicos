import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        pacientes: []
      })
      diagnosticosList.push(diagnostico);
    }
  }
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('findAll should return all diagnosticos', async () => {
      const diagnosticos: DiagnosticoEntity[] = await service.findAll();
      expect(diagnosticos).not.toBeNull();
      expect(diagnosticos).toHaveLength(diagnosticosList.length);
    });

    it('findOne should return a diagnostico by id', async () => {
      const diagnostico: DiagnosticoEntity = diagnosticosList[0];
      const foundDiagnostico: DiagnosticoEntity = await service.findOne(diagnostico.diagnosticoId);
      expect(foundDiagnostico).not.toBeNull();
      expect(foundDiagnostico.nombre).toEqual(diagnostico.nombre);
      expect(foundDiagnostico.descripcion).toEqual(diagnostico.descripcion);
    });

    it('findOne should throw an exceeption for an invalid diagnostico', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty('message', 'The diagnostic with the given id was not found');
    });

    it('create should create a new diagnostico', async () => {
      const diagnostico: DiagnosticoEntity = {
        diagnosticoId: "",
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        pacientes: []
      }

      const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
      expect(newDiagnostico).not.toBeNull();

      const storedDiagnostico: DiagnosticoEntity = await repository.findOne({where: {diagnosticoId: newDiagnostico.diagnosticoId}});
      expect(storedDiagnostico).not.toBeNull();
      expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
      expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
    });

    it('create should throw an error when the description is too long', async () => {
      const diagnostico: DiagnosticoEntity = {
        diagnosticoId: "",
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.paragraph() + faker.lorem.paragraph() + faker.lorem.paragraph(),
        pacientes: []
      }

      expect(service.create(diagnostico)).rejects.toHaveProperty('message', 'The description of the diagnostic is too long');
    });

    it('delete should remove a diagnostico', async () => {
      const diagnostico: DiagnosticoEntity = diagnosticosList[0];
      await service.delete(diagnostico.diagnosticoId);
      const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({where: {diagnosticoId: diagnostico.diagnosticoId}});
      expect(deletedDiagnostico).toBeNull();
    });

    it('delete should throw an error when the diagnostico is not found', async () => {
      await expect(service.delete("0")).rejects.toHaveProperty('message', 'The diagnostic with the given id was not found');
    });
});
