import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('text') idea: string;
  @Column('text') description: string;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne(type => UserEntity, author => author.ideas)
  author: UserEntity;
}
