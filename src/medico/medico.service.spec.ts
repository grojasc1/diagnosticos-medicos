import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    medicosList = [];
    for (let i =0; i< 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      })
      medicosList.push(medico);
    }

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicosList.length);
  });

  it('findOne should return a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    const foundMedico: MedicoEntity = await service.findOne(medico.medicoId);
    expect(foundMedico).not.toBeNull();
    expect(foundMedico.nombre).toEqual(medico.nombre);
    expect(foundMedico.especialidad).toEqual(medico.especialidad);
    expect(foundMedico.telefono).toEqual(medico.telefono);
  });

  it('create should create a new medico', async () => {
    const medico: MedicoEntity = {
      medicoId: "",
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    }

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({where: {medicoId: newMedico.medicoId}});
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('create should throw an error when the nombre and especialidad are missing', async () => {
    const medico: MedicoEntity = {
      medicoId: "",
      nombre: "",
      especialidad: "",
      telefono: faker.phone.number(),
      pacientes: []
    }

    expect(service.create(medico)).rejects.toHaveProperty("message", "The nombre and the especialidad of the medico are required");
  });

  it('delete should remove a medico', async () => {
    const medico: MedicoEntity = medicosList[0];
    await service.delete(medico.medicoId);
    const deletedMedico: MedicoEntity = await repository.findOne({where: {medicoId: medico.medicoId}});
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an error when the medico is not found', async () => {
    expect(service.delete("0")).rejects.toHaveProperty("message", "The medic with the given id was not found");
  });

  it('delete should throw an error when the medico has patients associated with it', async () => {
    const medico: MedicoEntity = medicosList[0];
    const paciente: PacienteEntity = {
      pacienteId: "",
      nombre: faker.person.firstName(),
      genero: ['M', 'F'][Math.floor(Math.random() * 2)],
      diagnosticos: [],
      medicos: [medico]
    }
    await repository.manager.getRepository(PacienteEntity).save(paciente);
    await expect(service.delete(medico.medicoId)).rejects.toHaveProperty("message", "The medic has patients associated with it");
  });
});
