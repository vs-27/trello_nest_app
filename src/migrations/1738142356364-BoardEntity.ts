import { MigrationInterface, QueryRunner } from "typeorm";

export class BoardEntity1738142356364 implements MigrationInterface {
    name = 'BoardEntity1738142356364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "boards" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "color" character varying NOT NULL, "font" character varying(255) NOT NULL, "backgroundColor" character varying NOT NULL, "createdById" integer, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "boards" ADD CONSTRAINT "FK_b82b543934c5e662ec834e5ad48" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "boards" DROP CONSTRAINT "FK_b82b543934c5e662ec834e5ad48"`);
        await queryRunner.query(`DROP TABLE "boards"`);
    }

}
