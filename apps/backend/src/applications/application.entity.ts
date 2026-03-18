import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import type { ScanStatus } from './application.interface'

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  filename: string

  @Column('varchar')
  filePath: string

  @Column('varchar', { unique: true })
  hash: string

  @Column('int')
  size: number

  @Column('varchar', { nullable: true })
  name: string

  @Column('text', { nullable: true })
  comment: string

  @Column('text', { default: 'PENDING' })
  scanStatus: ScanStatus

  @Column('jsonb', { nullable: true })
  scanResult: string

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  scanDate: Date

  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updatedAt: Date
}
