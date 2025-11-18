import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ImageSize } from './imagesize.entity';

@Entity()
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => ImageSize, (imagesize) => imagesize.image, {
        cascade: true,
        eager: true,
    })
    sizes: ImageSize[];
}
