import { MigrationInterface, QueryRunner } from "typeorm";

export class Test41697809310131 implements MigrationInterface {
    name = 'Test41697809310131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "otherText" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "date"`);
    }

}
