import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1697805109355 implements MigrationInterface {
    name = 'Migrations1697805109355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "number" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "number"`);
    }

}
