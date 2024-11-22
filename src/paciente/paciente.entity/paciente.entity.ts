import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PacienteEntity {
    @PrimaryGeneratedColumn('uuid')
    pacienteId: string;

    @Column()
    nombre: string;

    @Column()
    genero: string;
}
