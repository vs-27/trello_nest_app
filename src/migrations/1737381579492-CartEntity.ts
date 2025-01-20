import { MigrationInterface, QueryRunner } from "typeorm";

export class CartEntity1737381579492 implements MigrationInterface {
    name = 'CartEntity1737381579492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdById" integer, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_0c49ff749c0b599ea09bcdca1e8" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_0c49ff749c0b599ea09bcdca1e8"`);
        await queryRunner.query(`DROP TABLE "carts"`);
    }

}
