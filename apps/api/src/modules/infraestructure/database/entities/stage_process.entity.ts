import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stage_processes')
export class StageProcessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  stageName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', array: true, nullable: true })
  allowedReturnStage: number[];

  @Column({ type: 'int', nullable: true })
  nextStageId: number;
}
