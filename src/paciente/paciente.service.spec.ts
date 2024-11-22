import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity/diagnostico.entity';

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
        diagnosticos: [],
        medicos: []
      })
      pacientesList.push(paciente);
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

  it('findAll should return all the pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('findOne should return a paciente by id', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    const foundPaciente: PacienteEntity = await service.findOne(paciente.pacienteId);
    expect(foundPaciente).not.toBeNull();
    expect(foundPaciente.pacienteId).toEqual(paciente.pacienteId);
    expect(foundPaciente.nombre).toEqual(paciente.nombre);
    expect(foundPaciente.genero).toEqual(paciente.genero);
  });

  it('findOne should throw an error when the paciente is not found', async () => {
    expect(service.findOne("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('delete should remove a paciente', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.pacienteId);
    const deletedPaciente: PacienteEntity = await repository.findOne({where: {pacienteId: paciente.pacienteId}});
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an error when the paciente is not found', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await expect(service.delete("0")).rejects.toHaveProperty("message", "The patient with the given id was not found");
  });

  it('delete should throw an error when the paciente has diagnosticos associated with it', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    const diagnostico: DiagnosticoEntity = {
      diagnosticoId: "",
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      pacientes: [paciente]
    }
    await repository.manager.getRepository(DiagnosticoEntity).save(diagnostico);
    await expect(service.delete(paciente.pacienteId)).rejects.toHaveProperty("message", "The patient has diagnosticos associated with it");
  });
  
});
