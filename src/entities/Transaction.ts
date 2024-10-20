import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Asset } from "./Asset";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  walletAddress!: string;

  @Column()
  transactionType!: string;

  @Column("decimal", { precision: 18, scale: 8 })
  amountSpent!: number;

  @Column("decimal", { precision: 18, scale: 8 })
  amountReceived!: number;

  @ManyToOne(() => Asset, { cascade: true, eager: true })
  @JoinColumn()
  asset!: Asset;

  @Column({ nullable: true })
  receivingAddress?: string;

  @Column({ nullable: true })
  sendingAddress?: string;

  @Column()
  transactionHash!: string;

  @CreateDateColumn()
  timestamp!: Date;
}
