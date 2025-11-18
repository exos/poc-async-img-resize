import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class ImageSize {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    size: string;

    @Column()
    proccessed: boolean;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    url: string | null;

    @ManyToOne(() => Image, (image) => image.sizes, { onDelete: 'CASCADE' })
    image: Image;
}
