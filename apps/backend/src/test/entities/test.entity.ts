import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Test {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    number: number;

    @Column()
    date: Date

    @Column()
    otherText: string;
}
