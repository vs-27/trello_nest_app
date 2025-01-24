import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAndPurchaseEntities1737728993733 implements MigrationInterface {
    name = 'ProductAndPurchaseEntities1737728993733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "stripeProductPriceId" character varying(255) NOT NULL, "quantity" integer NOT NULL, "totalPrice" double precision NOT NULL, "paymentStatus" character varying(255), CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(0) NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "color" character varying NOT NULL, "price" double precision NOT NULL, "stripeProductPriceId" character varying(255) NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
    }

}
