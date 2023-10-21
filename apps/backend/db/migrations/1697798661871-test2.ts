import { MigrationInterface, QueryRunner } from "typeorm";

export class Test21697798661871 implements MigrationInterface {
    name = 'Test21697798661871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "text" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "text"`);
    }

}
