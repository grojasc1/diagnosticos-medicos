import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();
    medicosList = [];
    for (let i = 0; i < 5; i++) {
      const medico = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.firstName(),
      genero: ['M', 'F'][Math.floor(Math.random() * 2)],
      diagnosticos: [],
      medicos: medicosList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should add a medico to a paciente', async () => {
    const medico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });

    const updatedPaciente: PacienteEntity = await service.addMedicoToPaciente(paciente.pacienteId, medico.medicoId);
    expect(updatedPaciente.medicos.length).toEqual(medicosList.length + 1);
  });

  it('addMedicoToPaciente should throw an exception when the paciente does not exist', async () => {
    await expect(() => service.addMedicoToPaciente("0", medicosList[0].medicoId)).rejects.toHaveProperty('message', 'The patient with the given id was not found');
  });

  it('addMedicoToPaciente should throw an exception when the medico does not exist', async () => {
    await expect(() => service.addMedicoToPaciente(paciente.pacienteId, "0")).rejects.toHaveProperty('message', 'The medic with the given id was not found');
  });

  it('addMedicoToPaciente should throw an exception when the paciente has too many medicos', async () => {
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.firstName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });

      paciente.medicos = [...paciente.medicos, medico];
    }

    await pacienteRepository.save(paciente);

    const medico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.firstName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });

    await expect(() => service.addMedicoToPaciente(paciente.pacienteId, medico.medicoId)).rejects.toHaveProperty('message', 'The patient has too many medicos associated with it');
  });
});
