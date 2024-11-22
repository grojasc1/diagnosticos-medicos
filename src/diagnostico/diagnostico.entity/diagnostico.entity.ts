import { PacienteEntity } from "../../paciente/paciente.entity/paciente.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    diagnosticoId: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
    pacientes: PacienteEntity[];
}
