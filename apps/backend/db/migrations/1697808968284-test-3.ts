import { MigrationInterface, QueryRunner } from "typeorm";

export class Test31697808968284 implements MigrationInterface {
    name = 'Test31697808968284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "date"`);
    }

}
