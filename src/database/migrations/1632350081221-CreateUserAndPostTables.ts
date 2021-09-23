import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndPostTables1632350081221 implements MigrationInterface {
  name = 'CreateUserAndPostTables1632350081221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "image" character varying, "gender" character varying, "provider" character varying, "social_id" character varying, "birthday" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT false, "is_sms_notification" boolean NOT NULL DEFAULT false, "is_push_notification" boolean NOT NULL DEFAULT false, "is_email_notification" boolean NOT NULL DEFAULT false, "is_admin" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "activated_at" TIMESTAMP, "status" character varying DEFAULT 'pending', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_3676155292d72c67cd4e090514" ON "users" ("status") `);
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" jsonb NOT NULL, "meta" jsonb, "description" text, "img" character varying, "views" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "activated_at" TIMESTAMP, "status" character varying DEFAULT 'pending', "user_id" integer, "category_id" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a69d9e2ae78ef7d100f8317ae0" ON "posts" ("status") `);
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying, "status" character varying DEFAULT 'active', CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE ("slug"), CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_da635700e28a70645b4d47622d" ON "category" ("status") `);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_852f266adc5d67c40405c887b49" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_852f266adc5d67c40405c887b49"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
    await queryRunner.query(`DROP INDEX "IDX_da635700e28a70645b4d47622d"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP INDEX "IDX_a69d9e2ae78ef7d100f8317ae0"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP INDEX "IDX_3676155292d72c67cd4e090514"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
