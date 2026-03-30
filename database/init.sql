--  CREACIÓN DE ESQUEMAS

CREATE SCHEMA IF NOT EXISTS "security";
CREATE SCHEMA IF NOT EXISTS "membership";
CREATE SCHEMA IF NOT EXISTS "finances";

--  ESQUEMA SEGURIDAD

CREATE TABLE "security"."role" (
    "roleId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(50) UNIQUE NOT NULL,
    "description" text 
);

CREATE TABLE "security"."user" (
    "userId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "email" varchar(150) UNIQUE NOT NULL CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    "passwordHash" text NOT NULL,
    "roleId" int NOT NULL REFERENCES "security"."role"("roleId"),
    "active" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "security"."auditLog" (
    "logId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "timestamp" timestamp DEFAULT CURRENT_TIMESTAMP,
    "userId" int NOT NULL REFERENCES "security"."user"("userId"),
    "operation" varchar(50) NOT NULL,
    "affectedTable" varchar(100) NOT NULL,
    "detail" text NOT NULL,
    "sourceIp" varchar(50) NOT NULL
);

-- ESQUEMA MEMBRESÍA

CREATE TABLE "membership"."family" (
    "familyId" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "familyName" VARCHAR(100) NOT NULL,
    "relationship" VARCHAR(50) NOT NULL,
    "firstName" VARCHAR(25) NOT NULL,
    "lastName" VARCHAR(25) NOT NULL,
    "nationality" VARCHAR(50) NOT NULL,
    "sex" VARCHAR(10) CHECK ("sex" IN ('Femenino', 'Masculino')) NOT NULL,
    "academicLevel" VARCHAR(100),
    "occupation" VARCHAR(100),
    "profession" VARCHAR(100),
    "idCard" VARCHAR(20),
    "passport" VARCHAR(20),
    "birthDate" DATE,
    "district" VARCHAR(100),
    "sector" VARCHAR(100),
    "address" TEXT,
    "phoneNumber" VARCHAR(15),
    "emergencyNumber" VARCHAR(15),
    "email" VARCHAR(255),
    "medicalCondition" TEXT,
    "photoUrl" text,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "membership"."member" (
    "memberId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "firstName" varchar(50) NOT NULL,
    "lastName" varchar(50) NOT NULL,
    "photoUrl" text,
    "birthDate" date NOT NULL,
    "phoneNumber" varchar(15),
    "email" varchar(150)
);

CREATE TABLE "membership"."event" (
    "eventId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" varchar(100) NOT NULL,
    "type" varchar(50) NOT NULL,
    "description" text,
    "startDate" timestamptz NOT NULL,
    "endDate" timestamptz NOT NULL,
    "organizerUserId" int REFERENCES "security"."user"("userId"),
    CONSTRAINT "checkDates" CHECK ("endDate" > "startDate")
);

CREATE TABLE "membership"."attendance" (
    "attendanceId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "eventId" int NOT NULL REFERENCES "membership"."event"("eventId"),
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "date" date DEFAULT CURRENT_DATE NOT NULL,
    "isPresent" boolean NOT NULL,
    "entryTime" timestamptz,
    "exitTime" timestamptz
);

--  ESQUEMA FINANZAS

CREATE TABLE "finances"."ledgerAccount" (
    "accountCode" varchar(20) PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "type" varchar(50) NOT NULL,
    "subType" varchar(50) NOT NULL,
    "currentBalance" decimal(12,2) DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);

CREATE TABLE "finances"."journalEntry" (
    "journalEntryId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "date" timestamptz DEFAULT NOW() NOT NULL,
    "memo" text NOT NULL,
    "reference" varchar(50) NOT NULL,
    "isBalanced" boolean DEFAULT false,
    "recordedByUserId" int NOT NULL REFERENCES "security"."user"("userId")
);

CREATE TABLE "finances"."ledgerTransaction" (
    "transactionId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "journalEntryId" int NOT NULL REFERENCES "finances"."journalEntry"("journalEntryId"),
    "accountCode" varchar(20) NOT NULL REFERENCES "finances"."ledgerAccount"("accountCode"),
    "debit" decimal (12,2) DEFAULT 0 NOT NULL,
    "credit" decimal(12,2) DEFAULT 0 NOT NULL
);

CREATE TABLE "finances"."donation" (
    "donationId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "amount" decimal (12,2) NOT NULL,
    "date" timestamptz DEFAULT NOW() NOT NULL,
    "type" varchar(50) NOT NULL,
    "paymentMethod" varchar(50) NOT NULL,
    "status" varchar(20) NOT NULL
);

CREATE TABLE "finances"."taxReceipt" (
    "taxReceiptId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "code" varchar(50) UNIQUE NOT NULL, 
    "issueDate" timestamptz DEFAULT NOW() NOT NULL,
    "donationId" int NOT NULL REFERENCES "finances"."donation"("donationId")
);

CREATE TABLE "finances"."vendor" (
    "vendorId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "taxId" varchar(20) NOT NULL,
    "address" text NOT NULL,
    "phoneNumber" varchar(13) NOT NULL
);

CREATE TABLE "finances"."expenseInvoice" (
    "expenseInvoiceId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "vendorId" int NOT NULL REFERENCES "finances"."vendor"("vendorId"),
    "invoiceNumber" varchar(50) NOT NULL,
    "total" decimal(12,2) NOT NULL,
    "issueDate" timestamptz NOT NULL,
    "dueDate" timestamptz NOT NULL,
    "status" varchar(20) NOT NULL,
    "journalEntryId" int NOT NULL REFERENCES "finances"."journalEntry"("journalEntryId")
);

-- FUNCIONES

CREATE OR REPLACE FUNCTION "finances"."registerDonation"(
    "pMemberId" int,
    "pAmount" decimal,
    "pAccountCode" varchar,
    "pUserId" int,
    "pPaymentMethod" varchar,
    "pType" varchar
)
RETURNS int AS $$
DECLARE
    "vJournalEntryId" int;
    "vDonationId" int;
BEGIN
    INSERT INTO "finances"."journalEntry" ("memo", "reference", "recordedByUserId")
    VALUES ('Donation Received', 'DON-MB-' || "pMemberId", "pUserId")
    RETURNING "journalEntryId" INTO "vJournalEntryId";

    INSERT INTO "finances"."ledgerTransaction" ("journalEntryId", "accountCode", "debit", "credit")
    VALUES ("vJournalEntryId", "pAccountCode", "pAmount", 0);

    UPDATE "finances"."ledgerAccount"
    SET "currentBalance" = "currentBalance" + "pAmount"
    WHERE "accountCode" = "pAccountCode";

    INSERT INTO "finances"."donation" ("memberId", "amount", "type", "paymentMethod", "status")
    VALUES ("pMemberId", "pAmount", "pType", "pPaymentMethod", 'CONFIRMED')
    RETURNING "donationId" INTO "vDonationId";

    RETURN "vDonationId";
END;
$$ LANGUAGE plpgsql;

-- SEED DATA
INSERT INTO "security"."role" ("name", "description")
VALUES 
    ('admin', 'Administrator with full access'),
    ('manager', 'Gestor con acceso a reportes y finanzas'),
    ('staff', 'Personal operativo con permisos de registro'),
    ('auditor', 'Acceso de solo lectura para revisión de registros y logs')
ON CONFLICT ("name") DO NOTHING;


--  || Insertar usuarios con diferentes roles ||

DO $$
DECLARE
    "vAdminId" int;
    "vManagerId" int;
    "vStaffId" int;
    "vAuditorId" int;
BEGIN
    -- Obtener IDs de los roles de forma dinámica
    SELECT "roleId" INTO "vAdminId" FROM "security"."role" WHERE "name" = 'admin';
    SELECT "roleId" INTO "vManagerId" FROM "security"."role" WHERE "name" = 'manager';
    SELECT "roleId" INTO "vStaffId" FROM "security"."role" WHERE "name" = 'staff';
    SELECT "roleId" INTO "vAuditorId" FROM "security"."role" WHERE "name" = 'auditor';

    -- Insertar Administradores adicionales (si no existen)
    INSERT INTO "security"."user" ("name", "email", "passwordHash", "roleId", "active") VALUES
    ('Admin 01', 'joshua@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vAdminId", true),
    ('Admin 02', 'elias@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vAdminId", true),
    ('Admin 03', 'gadiel@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vAdminId", true)
    ON CONFLICT ("email") DO NOTHING;

    -- Insertar Gerente de Finanzas
    INSERT INTO "security"."user" ("name", "email", "passwordHash", "roleId", "active") VALUES
    ('Finance Manager', 'finance_mgr@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vManagerId", true)
    ON CONFLICT ("email") DO NOTHING;

    -- Insertar Staff Operativo
    INSERT INTO "security"."user" ("name", "email", "passwordHash", "roleId", "active") VALUES
    ('Operativo 01', 'operaciones_01@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vStaffId", true),
    ('Operativo 02', 'operaciones_02@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vStaffId", true)
    ON CONFLICT ("email") DO NOTHING;

    -- Insertar Auditor Externo
    INSERT INTO "security"."user" ("name", "email", "passwordHash", "roleId", "active") VALUES
    ('Auditor Externo', 'auditoria_externa@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', "vAuditorId", true)
    ON CONFLICT ("email") DO NOTHING;

END $$;