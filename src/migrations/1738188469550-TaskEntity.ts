import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskEntity1738188469550 implements MigrationInterface {
    name = 'TaskEntity1738188469550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "columns" DROP CONSTRAINT "FK_87fb5aec73b37fb3ad46141c981"`);
        await queryRunner.query(`ALTER TABLE "columns" RENAME COLUMN "boardsId" TO "boardId"`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "link" character varying NOT NULL, "files" character varying NOT NULL, "estimation" character varying NOT NULL, "startTime" TIMESTAMP NOT NULL DEFAULT now(), "endTime" TIMESTAMP NOT NULL DEFAULT now(), "columnId" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "columns" ADD CONSTRAINT "FK_ac92bfd7ba33174aabef610f361" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "columns" DROP CONSTRAINT "FK_ac92bfd7ba33174aabef610f361"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`ALTER TABLE "columns" RENAME COLUMN "boardId" TO "boardsId"`);
        await queryRunner.query(`ALTER TABLE "columns" ADD CONSTRAINT "FK_87fb5aec73b37fb3ad46141c981" FOREIGN KEY ("boardsId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
