import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i =0; i< 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.firstName(),
        genero: ['M', 'F'][Math.floor(Math.random() * 2)],
      })
    }

  } 

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a new paciente', async () => {
    const paciente: PacienteEntity = {
      pacienteId: "",
      nombre: faker.person.firstName(),
      genero: ['M', 'F'][Math.floor(Math.random() * 2)],
      diagnosticos: [],
      medicos: []
    }

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({where: {pacienteId: newPaciente.pacienteId}});
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an error when the name is too short', async () => {
    const paciente: PacienteEntity = {
      pacienteId: "",
      nombre: "A",
      genero: ['M', 'F'][Math.floor(Math.random() * 2)],
      diagnosticos: [],
      medicos: []
    }

    expect(service.create(paciente)).rejects.toHaveProperty("message", "The name of the patient is too short");
  });
});
