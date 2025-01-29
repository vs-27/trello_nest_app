import { MigrationInterface, QueryRunner } from "typeorm";

export class ColumnEntity1738176828675 implements MigrationInterface {
    name = 'ColumnEntity1738176828675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "columns" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "boardsId" integer, CONSTRAINT "PK_4ac339ccbbfed1dcd96812abbd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "columns" ADD CONSTRAINT "FK_87fb5aec73b37fb3ad46141c981" FOREIGN KEY ("boardsId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "columns" DROP CONSTRAINT "FK_87fb5aec73b37fb3ad46141c981"`);
        await queryRunner.query(`DROP TABLE "columns"`);
    }

}
