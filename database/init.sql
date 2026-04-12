-- CREACION DE ESQUEMAS

CREATE SCHEMA IF NOT EXISTS "security";
CREATE SCHEMA IF NOT EXISTS "membership";
CREATE SCHEMA IF NOT EXISTS "finances";

-- CREACION DE TIPOS ENUM

CREATE TYPE genderEnum AS ENUM ('M', 'F');
CREATE TYPE maritalStatusEnum AS ENUM ('Soltero', 'Casado', 'Viudo', 'Divorciado');
CREATE TYPE memberTypeEnum AS ENUM ('Comunion', 'Activos', 'Pasivos', 'Visitantes', 'Ministeriales', 'Catecumenos', 'Adherentes');
CREATE TYPE academicLevelEnum AS ENUM ('Primaria', 'Secundaria', 'Grado', 'Postgrado');
CREATE TYPE statusEnum AS ENUM ('Pendiente', 'Confirmado', 'Rechazado');
CREATE TYPE paymentMethodEnum AS ENUM ('Efectivo', 'Transferencia', 'Cheque', 'Deposito');
create type unitOfMeasureEnum as ENUM ('libras', 'galones', 'unidades', 'litros', 'kilogramos', 'otros' );
CREATE TYPE categoryItemEnum AS ENUM ('Dinero', 'Comida', 'Ropa', 'Combustible', 'Medicamentos', 'Materiales de construcción', 'Muebles', 'Electrodomésticos', 'Juguetes', 'Libros', 'Otros');
CREATE TYPE caseStatusEnum AS ENUM ('En proceso', 'Resuelto', 'Apelado', 'Archivado');
CREATE TYPE eventStatusEnum AS ENUM ('Programado', 'En curso', 'Finalizado', 'Cancelado');
CREATE TYPE municipioEnum AS ENUM ( 'Baní', 'Matanzas', 'Nizao');
CREATE TYPE districtEnum AS ENUM ('Baní','Catalina','El Carretón', 'El Limonal', 'Paya', 'Villa Fundación','Matanzas', 'Sabana Buey', 'Villa Sombrero', 'Nizao',  'Pizarrete','Santana');
CREATE TYPE relationshipEnum AS ENUM ('Padre', 'Madre', 'Hijo', 'Hija', 'Abuelo', 'Abuela', 'Nieto', 'Nieta',
    'Hermano', 'Hermana', 'Tío', 'Tía', 'Sobrino', 'Sobrina', 'Primo', 'Prima',  'Cónyuge',  'Suegro', 'Suegra', 'Yerno', 'Nuera',
    'Cuñado', 'Cuñada', 'Padrastro', 'Madrastra', 'Hijastro', 'Hijastra', 'Tutor', 'Pupilo','Otro');

--  ESQUEMA SEGURIDAD

CREATE TABLE "security"."role" (
    "roleId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(50) UNIQUE NOT NULL,
    "description" text 
);

CREATE TABLE "security"."user" (
    "userId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "email" varchar(150) UNIQUE NOT NULL,
    "passwordHash" text NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "security"."userRoles" (
    "userId" int NOT NULL,
    "roleId" int NOT NULL,
    "assignedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY ("userId", "roleId"),
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "security"."user"("userId") ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY ("roleId") REFERENCES "security"."role"("roleId") ON DELETE CASCADE
);

CREATE TABLE "security"."refreshTokens" (
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "token" varchar(256) NOT NULL,
    "userId" int NOT NULL REFERENCES "security"."user"("userId") ON DELETE CASCADE,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRevoked" boolean DEFAULT false NOT NULL
);

CREATE INDEX "IX_refreshTokens_token" ON "security"."refreshTokens" ("token");
CREATE INDEX "IX_refreshTokens_userId" ON "security"."refreshTokens" ("userId");

CREATE TABLE "security"."auditLog" (
    "logId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "operation" varchar(50) NOT NULL,
    "affectedTable" varchar(100) NOT NULL,
    "entityId" int,
    "oldValues" text,
    "newValues" text,
    "httpMethod" varchar(10) NOT NULL,
    "endPoint" varchar(255) NOT NULL,
    "detail" text ,
    "sourceIp" varchar(50) ,
    "timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "userId" int NOT NULL REFERENCES "security"."user"("userId")
);

-- ESQUEMA MEMBRESÍA

CREATE TABLE "membership"."sector" (
    "sectorId"   int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name"       varchar(100) NOT NULL,
    "municipio"  municipioEnum NOT NULL,
    "district"   districtEnum NOT NULL,
    "createdAt"  timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "membership"."family" (
    "familyId" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "lastName" VARCHAR(100) UNIQUE NOT NULL, -- Primer y segundo apellido aqui mismo, para poder utilizar UNIQUE y evitar duplicados.
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "membership"."churchRole" ( 
    "churchRoleId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "description" text
);

CREATE TABLE "membership"."smallGroup" (
    "smallGroupId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) UNIQUE NOT NULL,
    "description" text
);


CREATE TABLE "membership"."member" (
    "memberId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nationalId" varchar(20),
    "passportNumber" varchar(20),
    "firstName" varchar(50) NOT NULL,
    "secondName" varchar(50),
    "lastName" varchar(50) NOT NULL,
    "secondLastName" varchar(50),
    "gender" genderEnum NOT NULL, -- (ENUM) F O M
    "birthDate" date NOT NULL, -- (select tipo calendario)
    "birthPlace" varchar(50),
    "nationality" varchar(50),
    "maritalStatus" maritalStatusEnum NOT NULL, -- (ENUM) Soltero, Casado, Viudo, Divorciado.
    "photoUrl" text,

    "phoneNumber" varchar(15),
    "email" varchar(150) UNIQUE,
    "address" text,
    "sector" int REFERENCES "membership"."sector"("sectorId"),
    "emergencyContactName" varchar(100),
    "emergencyContactPhone" varchar(15),

    "medicalCondition" text,
    "bloodType" varchar(5),

    "memberType" memberTypeEnum,
    "isActive" boolean DEFAULT true NOT NULL,      -- Es un miembro activo o no? (es diferente al membertype: activo)
    "joinDate" date DEFAULT CURRENT_DATE,
    "conversionDate" date,
    "originChurch" varchar(100),
    "baptized" boolean DEFAULT false NOT NULL,
    "baptismDate" date,
    "baptismPlace" varchar(100),
    "discipleshipLevel" varchar(50),
    "smallGroupId" int REFERENCES "membership"."smallGroup"("smallGroupId"),
    "churchRoleId" int REFERENCES "membership"."churchRole"("churchRoleId"),
    "memberSkills" text,

    "discipline" boolean DEFAULT false NOT NULL,
    "courtCase" boolean DEFAULT false NOT NULL,

    "transferDate" date,                                -- fecha en que se trasladó a otra iglesia
    "transferDestination" varchar(100),                 -- Iglesia destino del traslado

    "academicLevel" academicLevelEnum,
    "profession" varchar(100),
    "occupation" varchar(100),
    "memberCourses" text,

    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz
);

CREATE TABLE "membership"."memberChurchRole" ( -- INTERMEDIA member y churchRole.
    "churchRoleId" int NOT NULL,
    "memberId" int NOT NULL,
    "assignedAt" timestamptz DEFAULT CURRENT_TIMESTAMP,

     PRIMARY KEY ("churchRoleId", "memberId"),
    CONSTRAINT fk_churchRole FOREIGN KEY ("churchRoleId") REFERENCES "membership"."churchRole"("churchRoleId") ON DELETE CASCADE,
    CONSTRAINT fk_member FOREIGN KEY ("memberId") REFERENCES "membership"."member"("memberId") ON DELETE CASCADE
);

CREATE TABLE "membership"."memberSmallGroup" ( -- INTERMEDIA member y smallGroup.
    "smallGroupId" int NOT NULL,
    "memberId" int NOT NULL,
    "assignedAt" timestamptz DEFAULT CURRENT_TIMESTAMP,

     PRIMARY KEY ("smallGroupId", "memberId"),
    CONSTRAINT fk_smallGroup FOREIGN KEY ("smallGroupId") REFERENCES "membership"."smallGroup"("smallGroupId") ON DELETE CASCADE,
    CONSTRAINT fk_member FOREIGN KEY ("memberId") REFERENCES "membership"."member"("memberId") ON DELETE CASCADE
);

-- INTERMEDIA member y family (un miembro puede tener vínculo con más de una familia)
CREATE TABLE "membership"."familyMember" (
    "familyId"       int NOT NULL,
    "memberId"       int NOT NULL,
    "relationship"   relationshipEnum NOT NULL, --ENUM
    "assignedAt"     timestamptz DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("familyId", "memberId"),
    CONSTRAINT fk_family FOREIGN KEY ("familyId") REFERENCES "membership"."family"("familyId") ON DELETE CASCADE,
    CONSTRAINT fk_member FOREIGN KEY ("memberId") REFERENCES "membership"."member"("memberId") ON DELETE CASCADE
);

CREATE TABLE "membership"."courtCaseInfo" (
    "courtCaseInfoId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "caseDetails" text NOT NULL,
    "status" caseStatusEnum NOT NULL DEFAULT 'En proceso',
    "lastUpdated" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "membership"."disciplinaryInfo" (
    "disciplinaryInfoId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "caseDetails" text NOT NULL,
    "status" caseStatusEnum NOT NULL DEFAULT 'En proceso',
    "lastUpdated" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "membership"."event" (
    "eventId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" varchar(100) NOT NULL,
    "type" varchar(50) NOT NULL,
    "description" text,
    "location" varchar(200),
    "capacity" int,
    "isOrdinary" boolean NOT NULL DEFAULT true, -- true = actividad ordinaria (culto semanal), false = actividad extraordinaria (congreso, campaña, etc.)
    "status" eventStatusEnum NOT NULL DEFAULT 'Programado',
    "organizerUserId" int REFERENCES "security"."user"("userId"),
    "isRecurring" boolean NOT NULL,
    "startDate" timestamptz NOT NULL,
    "endDate" timestamptz NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checkDates" CHECK ("endDate" > "startDate")
);


CREATE TABLE "membership"."attendance" (
    "attendanceId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "eventId" int NOT NULL REFERENCES "membership"."event"("eventId"),
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "isPresent" boolean NOT NULL,
    "entryTime" timestamptz,
    "exitTime" timestamptz,
    CONSTRAINT uq_attendance UNIQUE ("eventId", "memberId") -- evita duplicar asistencia del mismo miembro en el mismo evento
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

CREATE TABLE "finances"."donationItemType" (
    "donationItemTypeId" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL, -- Arroz, Habichuelas, Gasolina
    "category" categoryItemEnum NOT NULL, -- (ENUM) 'Efectivo', 'Comida', 'Ropa', 'Combustible' etc    
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1. Tabla principal de la donación
CREATE TABLE "finances"."donation" ( -- este viene siendo el id principal, que se puede utilizar para generar el recibo de donación y el comprobante fiscal.
    "donationId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int REFERENCES "membership"."member"("memberId"),
    "eventId" int REFERENCES "membership"."event"("eventId"),
    "date" timestamptz DEFAULT NOW() NOT NULL,
    "observation" text,  -- Notas: "Donación para el evento de jóvenes" (Luego deberia ser por fk id.)
    CONSTRAINT chk_donation_origin
    CHECK ("memberId" IS NOT NULL OR "eventId" IS NOT NULL)
);

-- 2. Tabla para detalles (aquí va la comida, ropa, etc.)
CREATE TABLE "finances"."donationItem" (
    "donationItemId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "donationId" int NOT NULL REFERENCES "finances"."donation"("donationId") ON DELETE CASCADE,
    "donationItemType" int NOT NULL REFERENCES "finances"."donationItemType"("donationItemTypeId"),
    "quantity" decimal(10,2),        -- cantidad de lo donado (dinero no va aqui).
    "unitOfMeasure" unitOfMeasureEnum,   -- (ENUM)'libras', 'galones', 'unidades', etc
    "amount" decimal(12,2),           -- Solo si es dinero, aquí va el valor
    "paymentMethod" paymentMethodEnum, -- (ENUM) Efectivo, Transferencia, Cheque, etc.
    "status" statusEnum -- (ENUM) Pendiente, Confirmado, Rechazado, etc.
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
    "phoneNumber" varchar(13) NOT NULL,
    "email" varchar(150) UNIQUE,
    "contactName" varchar(100)
);

CREATE TABLE "finances"."expenseInvoice" (
    "expenseInvoiceId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "vendorId" int NOT NULL REFERENCES "finances"."vendor"("vendorId"),
    "invoiceNumber" varchar(50) NOT NULL,
    "description" text,
    "total" decimal(12,2) NOT NULL,
    "paymentMethod" paymentMethodEnum,
    "issueDate" timestamptz NOT NULL,
    "dueDate" timestamptz NOT NULL,
    "status" varchar(20) NOT NULL,
    "journalEntryId" int NOT NULL REFERENCES "finances"."journalEntry"("journalEntryId")
);

-- FUNCIONES

CREATE OR REPLACE FUNCTION "finances"."registerDonation"(
    "pMemberId" int,
    "pAmount" decimal,
    "pAccountCode" varchar,      -- Cuenta de Activo (Caja/Banco)
    "pIncomeAccountCode" varchar, -- Cuenta de Ingreso (Donaciones)
    "pUserId" int,
    "pPaymentMethod" paymentMethodEnum,
    "pDonationItemTypeId" int
)
RETURNS int AS $$
DECLARE
    "vJournalEntryId" int;
    "vDonationId" int;
BEGIN
    -- Crear el asiento
    INSERT INTO "finances"."journalEntry" ("memo", "reference", "recordedByUserId", "isBalanced")
    VALUES ('Donación Recibida - Miembro ' || "pMemberId", 'DON-AUTO', "pUserId", true)
    RETURNING "journalEntryId" INTO "vJournalEntryId";

    -- Movimiento de Débito (Entra dinero)
    INSERT INTO "finances"."ledgerTransaction" ("journalEntryId", "accountCode", "debit", "credit")
    VALUES ("vJournalEntryId", "pAccountCode", "pAmount", 0);

    -- Movimiento de Crédito (Se registra el ingreso)
    INSERT INTO "finances"."ledgerTransaction" ("journalEntryId", "accountCode", "debit", "credit")
    VALUES ("vJournalEntryId", "pIncomeAccountCode", 0, "pAmount");

    -- Actualizar saldo de cuenta de activo
    UPDATE "finances"."ledgerAccount"
    SET "currentBalance" = "currentBalance" + "pAmount"
    WHERE "accountCode" = "pAccountCode";

    -- Registrar la donación administrativa
    INSERT INTO "finances"."donation" ("memberId", "observation")
    VALUES ("pMemberId", 'Registro automático vía función financiera')
    RETURNING "donationId" INTO "vDonationId";

    -- Detalle de la donación 
    INSERT INTO "finances"."donationItem" ("donationId", "donationItemType", "amount", "paymentMethod", "status")
    VALUES ("vDonationId", "pDonationItemTypeId", "pAmount", "pPaymentMethod", 'Confirmado');

    RETURN "vDonationId";
END;
$$ LANGUAGE plpgsql;

-- -- -- SEED DATA -- -- --


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
    -- 1. Obtener IDs de los roles 

    SELECT "roleId" INTO "vAdminId" FROM "security"."role" WHERE "name" = 'admin';
    SELECT "roleId" INTO "vManagerId" FROM "security"."role" WHERE "name" = 'manager';
    SELECT "roleId" INTO "vStaffId" FROM "security"."role" WHERE "name" = 'staff';
    SELECT "roleId" INTO "vAuditorId" FROM "security"."role" WHERE "name" = 'auditor';

    -- 2. Insertar los usuarios
   
    INSERT INTO "security"."user" ("name", "email", "passwordHash", "active") VALUES
    ('Admin 01', 'joshua@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Admin 02', 'elias@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Admin 03', 'gadiel@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Finance Manager', 'finance_mgr@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Operativo 01', 'operaciones_01@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Operativo 02', 'operaciones_02@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true),
    ('Auditor Externo', 'auditoria_externa@proyectox.com', 'AQAAAAIAAYagAAAAEIh2ZC2Q6PPYhs2tRldCDoUJSXbLl7ge9QTvSs0GAtXQRirFnFmbLDW9naNQmwRv2g==', true)
    ON CONFLICT ("email") DO NOTHING;

    -- 3. Insertar roles a los usuarios
    
    -- Admin
    INSERT INTO "security"."userRoles" ("userId", "roleId")
    SELECT u."userId", "vAdminId"
    FROM "security"."user" u
    WHERE u."email" IN ('joshua@proyectox.com', 'elias@proyectox.com', 'gadiel@proyectox.com')
    ON CONFLICT DO NOTHING;

    -- Manager
    INSERT INTO "security"."userRoles" ("userId", "roleId")
    SELECT u."userId", "vManagerId"
    FROM "security"."user" u
    WHERE u."email" = 'finance_mgr@proyectox.com'
    ON CONFLICT DO NOTHING;

    -- Staff
    INSERT INTO "security"."userRoles" ("userId", "roleId")
    SELECT u."userId", "vStaffId"
    FROM "security"."user" u
    WHERE u."email" IN ('operaciones_01@proyectox.com', 'operaciones_02@proyectox.com')
    ON CONFLICT DO NOTHING;

    -- Auditor
    INSERT INTO "security"."userRoles" ("userId", "roleId")
    SELECT u."userId", "vAuditorId"
    FROM "security"."user" u
    WHERE u."email" = 'auditoria_externa@proyectox.com'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Seed de usuarios y roles completado con éxito.';

END $$;


INSERT INTO "membership"."churchRole" ("name", "description")
VALUES 
    ('Ministerio de Alabanza', 'Responsables de la dirección musical, coro y equipo técnico de sonido durante los servicios.'),
    ('Escuela Bíblica Infantil', 'Encargados de la enseñanza y cuidado de los niños, divididos por grupos de edad.'),
    ('Departamento de Diaconado', 'Servidores dedicados al orden del templo, atención de visitas y logística de eventos.'),
    ('Ministerio de Jóvenes', 'Líderes y coordinadores de actividades para el grupo juvenil de la iglesia.'),
    ('Departamento de Damas', 'Organización y coordinación de actividades para las damas de la congregación.'),
    ('Ministerio de Evangelismo', 'Responsables de las campañas de evangelización y visitas a nuevos miembros.'),
    ('Departamento de Caballeros', 'Organización y coordinación de actividades para los caballeros de la congregación.');

    INSERT INTO "membership"."family" ("lastName") 
    VALUES 
    ('Romero'), ('Morrobel'), ('Nivar'),
    ('Pérez'), ('González'), ('Martínez'), ('Hernández');

    INSERT INTO "membership"."sector" ("name", "municipio", "district")
    VALUES
    ('Villa Sombrero',  'Matanzas', 'Villa Sombrero'),
    ('Florentino',      'Baní',     'Baní'),
    ('La Cuca',         'Baní',     'Baní'),
    ('Los Cacaos',      'Matanzas', 'Matanzas'),
    ('El Limonal',      'Baní',     'El Limonal'),
    ('Barrio Nuevo',    'Baní',     'Baní'),
    ('Paya',            'Baní',     'Paya'),
    ('Villa Fundación', 'Baní',     'Villa Fundación'),
    ('Sabana Buey',     'Matanzas', 'Sabana Buey'),
    ('Pizarrete',       'Nizao',    'Pizarrete'),
    ('Santana',         'Nizao',    'Santana'),
    ('El Carretón',     'Baní',     'El Carretón'),
    ('Catalina',        'Baní',     'Catalina');

    INSERT INTO "membership"."smallGroup" ("name", "description")
    VALUES
    ('Grupo Alfa',      'Grupo de discipulado para nuevos creyentes.'),
    ('Grupo Betel',     'Grupo de crecimiento espiritual para adultos.'),
    ('Grupo Siloé',     'Grupo de jóvenes adultos enfocado en liderazgo.'),
    ('Grupo Maranatha', 'Grupo familiar de estudio bíblico semanal.'),
    ('Grupo Eben-Ezer', 'Grupo de intercesión y oración congregacional.');

    INSERT INTO "membership"."member" (
        "firstName", "secondName", "lastName", "secondLastName",
        "gender", "birthDate", "birthPlace", "nationality", "maritalStatus",
        "phoneNumber", "email", "address", "sector",
        "memberType", "isActive", "baptized", "baptismDate", "baptismPlace",
        "academicLevel", "profession", "occupation",
        "smallGroupId", "churchRoleId"
    )
    VALUES 
    ('Carlos',   'Antonio',  'Romero',    'Díaz',      'M', '1994-04-04', 'Baní',          'Dominicana', 'Soltero',   '8293736456', 'cocofrio@proyectox.com',       'Calle 5, Villa Sombrero',    1, 'Activos',      true,  true,  '2010-06-15', 'Iglesia Central Baní',  'Grado',      'Ingeniero',  'Empleado',   1, 1),
    ('Ana',      'María',    'Nivar',     'Santos',    'F', '1993-03-03', 'Azua',          'Dominicana', 'Casado',    '8295346787', 'bronx@proyectox.com',          'Av. Principal, La Cuca',     3, 'Activos',      true,  true,  '2008-03-20', 'Iglesia Central Baní',  'Secundaria', 'Maestra',    'Empleado',   2, 2),
    ('Luis',     'Miguel',   'Morrobel',  'Reyes',     'M', '1997-07-07', 'Baní',          'Dominicana', 'Soltero',   '8093546765', 'kiruleisy@proyectox.com',      'Calle 12, Florentino',       2, 'Comunion',     true,  true,  '2015-08-10', 'Iglesia Florentino',    'Grado',      'Contador',   'Empleado',   3, 3),
    ('María',    'Elena',    'Pérez',     'Vargas',    'F', '1985-11-22', 'San Cristóbal', 'Dominicana', 'Casado',    '8091234567', 'maria.perez@proyectox.com',    'Calle 3, Los Cacaos',        4, 'Ministeriales',true,  true,  '2001-05-05', 'Iglesia Sombrero',      'Postgrado',  'Médica',     'Empleado',   4, 5),
    ('José',     'Rafael',   'González',  'Marte',     'M', '1990-08-14', 'Baní',          'Dominicana', 'Casado',    '8097654321', 'jose.gonzalez@proyectox.com',  'Av. Duarte, El Limón',       5, 'Activos',      true,  true,  '2005-09-18', 'Iglesia Central Baní',  'Grado',      'Abogado',    'Empleado',   1, 6),
    ('Carmen',   'Luisa',    'Martínez',  'Feliz',     'F', '2000-01-30', 'Peravia',       'Dominicana', 'Soltero',   '8299876543', 'carmen.martinez@proyectox.com','Calle 8, Barrio Nuevo',      6, 'Catecumenos',  true,  false, NULL,         NULL,                    'Secundaria', 'Estudiante', 'Estudiante', 5, 2),
    ('Pedro',    'Isaías',   'Hernández', 'Cruz',      'M', '1978-05-19', 'Baní',          'Dominicana', 'Viudo',     '8094561234', 'pedro.hernandez@proyectox.com','Calle 1, Villa Sombrero',    1, 'Pasivos',      true,  true,  '1998-07-07', 'Iglesia Central Baní',  'Primaria',   NULL,         'Jubilado',   2, 4)
    ON CONFLICT DO NOTHING;

    INSERT INTO "membership"."event" 
    ("title", "type", "description", "location", "capacity", "isOrdinary", "status", "organizerUserId", "isRecurring", "startDate", "endDate")
    VALUES
    ('Congreso de Damas',        'Congreso', 'El evento anual más esperado de las damas.',                                                                'Templo Central, Baní',  200, false, 'Programado', 1, false, '2026-09-05 02:00:00+00', '2026-09-05 13:30:00+00'),
    ('Culto Dominical',          'Culto',    'Reunion congregacional para alabanzas y enseñanza biblica.',                                                 'Templo Central, Baní',  300, true,  'Programado', 2, true,  '2026-09-05 04:00:00+00', '2026-09-05 07:30:00+00'),
    ('Congreso de Caballeros',   'Congreso', 'El evento anual más esperado de los Caballeros.',                                                            'Templo Central, Baní',  150, false, 'Programado', 1, false, '2026-09-05 12:00:00+00', '2026-09-05 17:30:00+00'),
    ('Culto Unido Presbiterial', 'Reunion',  'Reunion congregacional para alabanzas, enseñanza biblica e informaciones entre iglesias seccion Bani-Ocoa.', 'Iglesia Florentino',    400, false, 'Programado', 3, false, '2026-09-05 16:00:00+00', '2026-09-05 19:30:00+00'),
    ('EBDV',                     'Escuela',  'Escuela biblica de verano para niños de 4 a 12 años.',                                                       'Salón Infantil, Baní',  100, false, 'Programado', 2, false, '2026-09-05 05:00:00+00', '2026-09-05 10:30:00+00'),
    ('Retiro Espiritual Juvenil','Retiro',   'Retiro espiritual para jóvenes con talleres de liderazgo y adoración.',                                      'Campamento El Edén',     80, false, 'Programado', 1, false, '2026-10-15 08:00:00+00', '2026-10-17 18:00:00+00'),
    ('Culto de Oración y Ayuno', 'Culto',    'Servicio especial de oración y ayuno congregacional.',                                                       'Templo Central, Baní',  300, true,  'Programado', 2, true,  '2026-09-12 05:00:00+00', '2026-09-12 08:00:00+00'),
    ('Semana Santa 2026',        'Semana Especial', 'Semana de reflexión y cultos especiales de Semana Santa.',                                            'Templo Central, Baní',  NULL, false, 'Programado', 1, false, '2026-04-05 00:00:00+00', '2026-04-12 23:59:00+00'),
    ('Aniversario de la Iglesia','Celebración',     'Celebración del aniversario de fundación de la iglesia local.',                                       'Templo Central, Baní',  NULL, false, 'Programado', 2, true,  '2026-06-15 18:00:00+00', '2026-06-15 22:00:00+00'),
    ('Campaña de Evangelismo',   'Campaña',         'Campaña evangelística en el sector de Villa Sombrero.',                                               'Villa Sombrero, Baní',  NULL, false, 'Programado', 1, false, '2026-07-01 19:00:00+00', '2026-07-07 22:00:00+00'),
    ('Convención Distrital',     'Convención',      'Convención anual del distrito Sombrero-Boca Canasta.',                                                'Iglesia Florentino',    NULL, false, 'Programado', 3, true,  '2026-08-20 08:00:00+00', '2026-08-22 18:00:00+00'),
    ('Vigilia de Fin de Año',    'Vigilia',         'Servicio de vigilia y acción de gracias de cierre de año.',                                           'Templo Central, Baní',  NULL, false, 'Programado', 2, true,  '2026-12-31 22:00:00+00', '2027-01-01 02:00:00+00');


-- SEED: TABLAS INTERMEDIAS DE MEMBRESÍA

INSERT INTO "membership"."memberChurchRole" ("churchRoleId", "memberId")
VALUES
    (1, 1), -- Carlos -> Ministerio de Alabanza
    (2, 2), -- Ana -> Escuela Bíblica Infantil
    (3, 3), -- Luis -> Diaconado
    (5, 4), -- María -> Departamento de Damas
    (6, 5), -- José -> Evangelismo
    (4, 6), -- Carmen -> Ministerio de Jóvenes
    (7, 7); -- Pedro -> Departamento de Caballeros

INSERT INTO "membership"."memberSmallGroup" ("smallGroupId", "memberId")
VALUES
    (1, 1), -- Carlos -> Grupo Alfa
    (2, 2), -- Ana -> Grupo Betel
    (3, 3), -- Luis -> Grupo Siloé
    (4, 4), -- María -> Grupo Maranatha
    (5, 5), -- José -> Grupo Eben-Ezer
    (5, 6), -- Carmen -> Grupo Eben-Ezer
    (2, 7); -- Pedro -> Grupo Betel


-- SEED: ASISTENCIA

INSERT INTO "membership"."attendance" ("eventId", "memberId", "isPresent", "entryTime", "exitTime")
VALUES
    (1, 1, true,  '2026-09-05 02:05:00+00', '2026-09-05 13:25:00+00'),
    (1, 2, true,  '2026-09-05 02:10:00+00', '2026-09-05 13:30:00+00'),
    (2, 3, true,  '2026-09-05 04:02:00+00', '2026-09-05 07:28:00+00'),
    (2, 4, false, NULL, NULL),
    (3, 5, true,  '2026-09-05 12:05:00+00', '2026-09-05 17:20:00+00'),
    (4, 6, true,  '2026-09-05 16:00:00+00', '2026-09-05 19:30:00+00'),
    (5, 7, true,  '2026-09-05 05:10:00+00', '2026-09-05 10:25:00+00');


-- SEED: FINANZAS - CUENTAS CONTABLES

INSERT INTO "finances"."ledgerAccount" ("accountCode", "name", "type", "subType", "currentBalance", "isActive")
VALUES
    ('1-1-001', 'Caja General',                  'Activo',  'Activo Corriente',      5000.00, true),
    ('1-1-002', 'Banco BHD - Cuenta Corriente',  'Activo',  'Activo Corriente',     25000.00, true),
    ('1-1-003', 'Banco Popular - Cuenta Ahorro', 'Activo',  'Activo Corriente',     10000.00, true),
    ('1-2-001', 'Terreno Iglesia',               'Activo',  'Activo No Corriente', 500000.00, true),
    ('1-2-002', 'Edificio Templo',               'Activo',  'Activo No Corriente', 800000.00, true),
    ('4-1-001', 'Ingresos por Diezmos',          'Ingreso', 'Ingreso Ordinario',        0.00, true),
    ('4-1-002', 'Ingresos por Ofrendas',         'Ingreso', 'Ingreso Ordinario',        0.00, true),
    ('4-1-003', 'Ingresos por Donaciones',       'Ingreso', 'Ingreso Ordinario',        0.00, true),
    ('5-1-001', 'Gastos de Servicios Públicos',  'Gasto',   'Gasto Operativo',          0.00, true),
    ('5-1-002', 'Gastos de Mantenimiento',       'Gasto',   'Gasto Operativo',          0.00, true),
    ('5-1-003', 'Gastos de Eventos',             'Gasto',   'Gasto Operativo',          0.00, true);


-- FINANZAS - TIPOS DE DONACIÓN

INSERT INTO "finances"."donationItemType" ("name", "category")
VALUES
    ('Diezmo en Efectivo',   'Dinero'),
    ('Ofrenda General',      'Dinero'),
    ('Arroz',                'Comida'),
    ('Habichuelas',          'Comida'),
    ('Gasolina',             'Combustible'),
    ('Ropa Usada',           'Ropa'),
    ('Medicamentos Varios',  'Medicamentos');


-- FINANZAS - ASIENTOS Y TRANSACCIONES

INSERT INTO "finances"."journalEntry" ("date", "memo", "reference", "isBalanced", "recordedByUserId")
VALUES
    ('2026-01-05 10:00:00+00', 'Diezmos recibidos - Culto Dominical 05/01',  'REF-2026-001', true, 1),
    ('2026-01-12 10:00:00+00', 'Ofrendas recibidas - Culto Dominical 12/01', 'REF-2026-002', true, 1),
    ('2026-02-01 09:00:00+00', 'Pago de electricidad - Febrero 2026',        'REF-2026-003', true, 4),
    ('2026-02-15 11:00:00+00', 'Donación especial - Congreso de Damas',      'REF-2026-004', true, 1),
    ('2026-03-01 09:30:00+00', 'Pago de mantenimiento - Marzo 2026',         'REF-2026-005', true, 4);

INSERT INTO "finances"."ledgerTransaction" ("journalEntryId", "accountCode", "debit", "credit")
VALUES
    -- Asiento 1: Diezmos (Débito Caja, Crédito Ingresos Diezmos)
    (1, '1-1-001', 8500.00,    0.00),
    (1, '4-1-001',    0.00, 8500.00),
    -- Asiento 2: Ofrendas (Débito Caja, Crédito Ingresos Ofrendas)
    (2, '1-1-001', 3200.00,    0.00),
    (2, '4-1-002',    0.00, 3200.00),
    -- Asiento 3: Pago electricidad (Débito Gasto, Crédito Banco BHD)
    (3, '5-1-001', 4500.00,    0.00),
    (3, '1-1-002',    0.00, 4500.00),
    -- Asiento 4: Donación especial (Débito Banco Popular, Crédito Ingresos Donaciones)
    (4, '1-1-003', 15000.00,     0.00),
    (4, '4-1-003',     0.00, 15000.00),
    -- Asiento 5: Mantenimiento (Débito Gasto, Crédito Banco BHD)
    (5, '5-1-002', 2800.00,    0.00),
    (5, '1-1-002',    0.00, 2800.00);


-- FINANZAS - DONACIONES

INSERT INTO "finances"."donation" ("memberId", "eventId", "date", "observation")
VALUES
    (1, NULL, '2026-01-05 10:30:00+00', 'Diezmo mensual de Carlos Romero'),
    (2, NULL, '2026-01-05 10:35:00+00', 'Ofrenda de Ana Nivar'),
    (3, NULL, '2026-01-12 10:20:00+00', 'Diezmo mensual de Luis Morrobel'),
    (4, 1,    '2026-09-05 03:00:00+00', 'Donación especial para el Congreso de Damas'),
    (5, NULL, '2026-02-15 11:00:00+00', 'Ofrenda de José González'),
    (6, 2,    '2026-09-05 04:30:00+00', 'Ofrenda en el Culto Dominical'),
    (7, NULL, '2026-03-01 09:00:00+00', 'Donación de Pedro Hernández');

INSERT INTO "finances"."donationItem" ("donationId", "donationItemType", "quantity", "unitOfMeasure", "amount", "paymentMethod", "status")
VALUES
    (1, 1, NULL, NULL,    2500.00, 'Efectivo',      'Confirmado'),
    (2, 2, NULL, NULL,     800.00, 'Efectivo',      'Confirmado'),
    (3, 1, NULL, NULL,    1800.00, 'Transferencia', 'Confirmado'),
    (4, 2, NULL, NULL,    5000.00, 'Transferencia', 'Confirmado'),
    (5, 2, NULL, NULL,    1200.00, 'Efectivo',      'Confirmado'),
    (6, 3, 10.00, 'libras', NULL,  NULL,            'Pendiente'),
    (7, 6, 5.00, 'unidades', NULL, NULL,            'Confirmado');


-- FINANZAS - COMPROBANTES FISCALES

INSERT INTO "finances"."taxReceipt" ("code", "issueDate", "donationId")
VALUES
    ('REC-2026-0001', '2026-01-05 11:00:00+00', 1),
    ('REC-2026-0002', '2026-01-05 11:05:00+00', 2),
    ('REC-2026-0003', '2026-01-12 11:00:00+00', 3),
    ('REC-2026-0004', '2026-09-05 04:00:00+00', 4),
    ('REC-2026-0005', '2026-02-15 12:00:00+00', 5);


-- FINANZAS - PROVEEDORES Y FACTURAS

INSERT INTO "finances"."vendor" ("name", "taxId", "address", "phoneNumber", "email", "contactName")
VALUES
    ('EDEESTE S.A.',              '1-01-12345-6', 'Av. Independencia 45, Santo Domingo', '8095551001', 'clientes@edeeste.com.do',      'Roberto Sánchez'),
    ('Ferretería El Constructor', '1-02-67890-1', 'Calle Duarte 12, Baní',               '8095552002', 'ventas@constructor.com',       'Miguel Ángel Reyes'),
    ('Distribuidora Agua Pura',   '1-03-11223-4', 'Av. Mella 78, Baní',                  '8095553003', 'pedidos@aguapura.com',         'Laura Jiménez'),
    ('Impresos Rápidos SRL',      '1-04-44556-7', 'Calle El Conde 5, Baní',              '8095554004', 'info@impresosrapidos.com',     'Carlos Marte'),
    ('Supermercado La Colonia',   '1-05-77889-0', 'Av. Anacaona 90, Baní',               '8095555005', 'proveedores@lacolonia.com.do', 'Ana Feliz');

INSERT INTO "finances"."expenseInvoice" ("vendorId", "invoiceNumber", "description", "total", "paymentMethod", "issueDate", "dueDate", "status", "journalEntryId")
VALUES
    (1, 'FAC-EDEESTE-0234', 'Pago de electricidad mes de febrero',          4500.00, 'Transferencia', '2026-02-01 00:00:00+00', '2026-02-15 00:00:00+00', 'Pagada',    3),
    (2, 'FAC-FERRET-0089',  'Materiales de mantenimiento del templo',       2800.00, 'Cheque',        '2026-03-01 00:00:00+00', '2026-03-20 00:00:00+00', 'Pagada',    5),
    (3, 'FAC-AGUA-0456',    'Servicio de agua potable mes de febrero',       650.00, 'Efectivo',      '2026-02-01 00:00:00+00', '2026-02-28 00:00:00+00', 'Pendiente', 3),
    (4, 'FAC-IMPR-0112',    'Impresión de boletines y programas de culto',  1200.00, 'Efectivo',      '2026-01-15 00:00:00+00', '2026-01-30 00:00:00+00', 'Pagada',    2),
    (5, 'FAC-SUPER-0778',   'Compra de víveres para actividad social',      3100.00, 'Transferencia', '2026-03-10 00:00:00+00', '2026-03-25 00:00:00+00', 'Pendiente', 5);


-- TABLA INTERMEDIA member <-> family

INSERT INTO "membership"."familyMember" ("familyId", "memberId", "relationship")
VALUES
    (1, 1, 'Hijo'),      -- Carlos Romero -> Familia Romero
    (3, 2, 'Madre'),     -- Ana Nivar -> Familia Nivar
    (2, 3, 'Padre'),     -- Luis Morrobel -> Familia Morrobel
    (4, 4, 'Madre'),     -- María Pérez -> Familia Pérez
    (5, 5, 'Padre'),     -- José González -> Familia González
    (6, 6, 'Hija'),      -- Carmen Martínez -> Familia Martínez
    (7, 7, 'Padre'),     -- Pedro Hernández -> Familia Hernández
    (1, 5, 'Cónyuge'),   -- José González también vinculado a Familia Romero (por matrimonio)
    (4, 2, 'Cónyuge');   -- Ana Nivar también vinculada a Familia Pérez (por matrimonio)
