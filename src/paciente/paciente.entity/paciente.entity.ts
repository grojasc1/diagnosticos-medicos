import { MedicoEntity } from "../../medico/medico.entity/medico.entity";
import { DiagnosticoEntity } from "../../diagnostico/diagnostico.entity/diagnostico.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    pacienteId: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;

    @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
    diagnosticos: DiagnosticoEntity[];

    @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
    medicos: MedicoEntity[];
}
