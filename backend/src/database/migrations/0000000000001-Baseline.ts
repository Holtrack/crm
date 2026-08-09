import { MigrationInterface, QueryRunner } from "typeorm";

export class Baseline0000000000001 implements MigrationInterface {
  name = "Baseline0000000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "companies_status_enum" AS ENUM ('Prospect', 'Active', 'Customer')
    `);
    await queryRunner.query(`
      CREATE TYPE "companies_source_enum" AS ENUM (
        'Website Contact Form', 'Cold Outreach', 'Existing Client Referral',
        'Charissa', 'Brantley', 'Delvin', 'Other'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "deals_status_enum" AS ENUM ('Proposal', 'Negotiation', 'Won', 'Lost')
    `);
    await queryRunner.query(`
      CREATE TYPE "tasks_status_enum" AS ENUM ('Todo', 'In Progress', 'Completed')
    `);
    await queryRunner.query(`
      CREATE TYPE "tasks_priority_enum" AS ENUM ('Low', 'Medium', 'High')
    `);
    await queryRunner.query(`
      CREATE TYPE "activities_type_enum" AS ENUM (
        'WhatsApp', 'Call', 'Email', 'Demo', 'Follow Up', 'Meeting'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "name" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'Sales Administrator',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying NOT NULL,
        "name" character varying NOT NULL,
        "industry" character varying NOT NULL,
        "region" character varying NOT NULL,
        "website" character varying NOT NULL DEFAULT '',
        "phone" character varying NOT NULL DEFAULT '',
        "address" character varying NOT NULL DEFAULT '',
        "team_lead_owner" character varying NOT NULL,
        "status" "companies_status_enum" NOT NULL DEFAULT 'Prospect',
        "source" "companies_source_enum" NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_companies_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_companies_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "company_id" uuid NOT NULL,
        "email" character varying NOT NULL DEFAULT '',
        "phone" character varying NOT NULL DEFAULT '',
        "position" character varying NOT NULL DEFAULT '',
        "owner" character varying NOT NULL,
        "notes" character varying NOT NULL DEFAULT '',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contacts_company_id" FOREIGN KEY ("company_id")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "deals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "amount" character varying NOT NULL,
        "status" "deals_status_enum" NOT NULL DEFAULT 'Proposal',
        "probability" integer NOT NULL DEFAULT 50,
        "contact_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_deals_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_deals_company_id" FOREIGN KEY ("company_id")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "tag" character varying NOT NULL,
        "status" "tasks_status_enum" NOT NULL DEFAULT 'Todo',
        "priority" "tasks_priority_enum" NOT NULL DEFAULT 'Medium',
        "due_date" date NOT NULL,
        "notes" character varying NOT NULL DEFAULT '',
        "company_id" uuid,
        "is_follow_up" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "activities" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "type" "activities_type_enum" NOT NULL,
        "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "summary" character varying NOT NULL DEFAULT '',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_activities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_activities_company_id" FOREIGN KEY ("company_id")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "deals"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "companies"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "activities_type_enum"`);
    await queryRunner.query(`DROP TYPE "tasks_priority_enum"`);
    await queryRunner.query(`DROP TYPE "tasks_status_enum"`);
    await queryRunner.query(`DROP TYPE "deals_status_enum"`);
    await queryRunner.query(`DROP TYPE "companies_source_enum"`);
    await queryRunner.query(`DROP TYPE "companies_status_enum"`);
  }
}
