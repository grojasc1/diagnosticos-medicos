import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DiagnosticoEntity {
    @PrimaryGeneratedColumn('uuid')
    diagnosticoId: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;
}
