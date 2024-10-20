import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  symbol?: string;

  @Column()
  contract!: string;

  @Column()
  logo?: string;
}
