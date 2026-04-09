--  CREACIÓN DE ESQUEMAS

CREATE SCHEMA IF NOT EXISTS "security";
CREATE SCHEMA IF NOT EXISTS "membership";
CREATE SCHEMA IF NOT EXISTS "finances";

-- CREACION DE ENUMs

CREATE TYPE genderEnum AS ENUM ('Masculino', 'Femenino');
CREATE TYPE maritalStatusEnum AS ENUM ('Soltero', 'Casado', 'Viudo', 'Divorciado');
CREATE TYPE memberTypeEnum AS ENUM ('Comunion', 'Activos', 'Pasivos', 'Visitantes', 'Ministeriales', 'Catecumenos', 'Adherentes');
CREATE TYPE academicLevelEnum AS ENUM ('Primaria', 'Secundaria', 'Grado', 'Postgrado');
CREATE TYPE statusEnum AS ENUM ('Pendiente', 'Confirmado', 'Rechazado');
CREATE TYPE paymentMethodEnum AS ENUM ('Efectivo', 'Transferencia', 'Cheque', 'Deposito');
create type unitOfMeasureEnum as ENUM ('libras', 'galones', 'unidades', 'litros', 'kilogramos', 'otros' );
CREATE TYPE categoryItemEnum AS ENUM ('Dinero', 'Comida', 'Ropa', 'Combustible', 'Medicamentos', 'Materiales de construcción', 'Muebles', 'Electrodomésticos', 'Juguetes', 'Libros', 'Otros');

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

CREATE TABLE "security"."auditLog" (
    "logId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "operation" varchar(50) NOT NULL,
    "affectedTable" varchar(100) NOT NULL,
    "entityId" int,
    "oldValues" text,
    "newValues" text,
    "httpMethod" varchar(10) NOT NULL,
    "endPoint" varchar(255) NOT NULL,
    "detail" text NOT NULL,
    "sourceIp" varchar(50) NOT NULL,
    "timestamp" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "userId" int NOT NULL REFERENCES "security"."user"("userId")
);

-- ESQUEMA MEMBRESÍA

CREATE TABLE "membership"."sector" (
    "sectorId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL, -- (ENUM) Villa, Florentino, La cuca, etc. Y si es necesario agregar más sectores, se puede crear una tabla de sectores y referenciarla aquí.
    "district" varchar(100) NOT NULL, -- (ENUM) Sombrero, Boca canasta, El llano, etc. (Que al colocar nombre se coloque el id por default)
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "membership"."family" (
    "familyId" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "lastName" VARCHAR(100) UNIQUE NOT NULL, -- Primer y segundo apellido aqui mismo, para poder utilizar UNIQUE y evitar duplicados.
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "membership"."churchRole" ( 
    "churchRoleId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) NOT NULL, -- (Enum) agregar todos los departamentos de la iglesia local.
    "description" text
);

CREATE TABLE "membership"."smallGroup" (
    "smallGroupId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" varchar(100) UNIQUE NOT NULL,
    "description" text
);

-- Tener en cuenta la privacidad de datos.
CREATE TABLE "membership"."member" (
    "memberId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nationalId" varchar(20),
    "passportNumber" varchar(20),
    "firstName" varchar(50) NOT NULL,
    "secondName" varchar(50),
    "lastName" varchar(50) NOT NULL,
    "secondLastName" varchar(50),
    "gender" genderEnum NOT NULL, -- (ENUM) Masculino, Femenino.
    "birthDate" date NOT NULL, -- (select tipo calendario)
    "birthPlace" varchar(50),
    "nationality" varchar(50),
    "maritalStatus" maritalStatusEnum NOT NULL, -- (ENUM) Soltero, Casado, Viudo, Divorciado.
    "photoUrl" text,

    "phoneNumber" varchar(15),
    "email" varchar(150) UNIQUE CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    "address" text,
    "sector" int REFERENCES "membership"."sector"("sectorId"), -- (Que al colocar nombre se coloque el id por default) Villa, Florentino, La cuca, etc. Y si es necesario agregar más sectores, se puede crear una tabla de sectores y referenciarla aquí.
    "emergencyContactName" varchar(100),
    "emergencyContactPhone" varchar(15),
    "familyId" int REFERENCES "membership"."family"("familyId"),

    "medicalCondition" text, -- Alergias, enfermedades crónicas u otras condiciones de salud relevantes.
    "bloodType" varchar(5), -- A+, O-, etc.

    "memberType" memberTypeEnum, -- (ENUM) comunion, activos, pasivos, visitantes, ministeriales, catecumenos, adherentes.
    "joinDate" date DEFAULT CURRENT_DATE, 
    "conversionDate" date, -- Fecha en que el miembro se convirtió o aceptó la fe.
    "originChurch" varchar(100), -- Iglesia de origen, si es un traslado.
    "baptized" boolean DEFAULT false NOT NULL, 
    "baptismDate" date,
    "baptismPlace" varchar(100), 
    "discipleshipLevel" varchar(50), -- (ENUM) Hay que revisar el reglamento local.
    "smallGroupId" int REFERENCES "membership"."smallGroup"("smallGroupId"),
    "churchRoleId" int REFERENCES "membership"."churchRole"("churchRoleId"),
    "memberSkills" text, -- Habilidades, talentos o dones espirituales del miembro.

    "discipline" boolean DEFAULT false NOT NULL,
    "courtCase" boolean DEFAULT false NOT NULL,

    "academicLevel" academicLevelEnum, -- (ENUM) Primaria, Secundaria, Universitaria, Postgrado.
    "profession" varchar(100), 
    "occupation" varchar(100), -- Donde labora actualmente, Desempleado, Estudiante, Jubilado, etc.
    "memberCourses" text, -- Cursos o capacitaciones que el miembro ha recibido, como liderazgo, enseñanza bíblica o seculares, etc.

    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz
    -- "frecuenciaAsistencia" varchar(50), -- regular, ocasional.
    -- "requiereSeguimiento" boolean DEFAULT false,
    -- "ultimaVisitaPastoral" date,
    -- "notasPastorales" text, 
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

CREATE TABLE "membership"."courtCaseInfo" (
    "courtCaseInfoId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "caseDetails" text NOT NULL,
    "status" varchar(20) NOT NULL, -- (ENUM) En proceso, Resuelto, Apelado, etc.
    "lastUpdated" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "membership"."disciplinaryInfo" (
    "disciplinaryInfoId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "caseDetails" text NOT NULL,
    "status" varchar(20) NOT NULL, -- (ENUM) En proceso, Resuelto, Apelado, etc.
    "lastUpdated" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "membership"."event" (
    "eventId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" varchar(100) NOT NULL,
    "type" varchar(50) NOT NULL, -- (ENUM) Culto, Reunión, Congreso, etc.
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
    "isPresent" boolean NOT NULL,
    "entryTime" timestamptz, --  estos solo para hora y Duplicar el dato para utilizar el date
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

CREATE TABLE "finances"."donationItemType" (
    "donationItemTypeId" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL, -- Arroz, Habichuelas, Gasolina
    "category" categoryItemEnum NOT NULL, -- (ENUM) 'Efectivo', 'Comida', 'Ropa', 'Combustible' etc    
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 1. Tabla principal de la donación
CREATE TABLE "finances"."donation" ( -- este viene siendo el id principal, que se puede utilizar para generar el recibo de donación y el comprobante fiscal.
    "donationId" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "memberId" int NOT NULL REFERENCES "membership"."member"("memberId"),
    "date" timestamptz DEFAULT NOW() NOT NULL,
    "observation" text  -- Notas: "Donación para el evento de jóvenes" (Luego deberia ser por fk id.)
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

    -- 3. Insertar roles a los usuarios (Cada bloque debe terminar en ;)
    
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
    ('Departamento de Diaconado', 'Servidores dedicados al orden del templo, atención de visitas y logística de eventos.');

    INSERT INTO "membership"."family" ("lastName") 
    VALUES 
    ('Romero'), ('Morrobel'), ('Nivar');
	

    INSERT INTO "membership"."member" ("familyId", "firstName", "lastName", "gender", "birthDate", "maritalStatus", "phoneNumber", "email")
    VALUES 
    (1,'Carlos', 'Romero', 'Masculino', '1994-04-04','Soltero','8293736456', 'cocofrio@poyectox.com'),
    (3,'Ana', 'Nivar', 'Femenino', '1993-03-03','Soltero','8295346787', 'bronx@proyectox.com'),
    (2,'Luis', 'Morrobel', 'Masculino', '1997-07-07','Soltero','8093546765', 'kiruleisy@proyectox.com')
    ON CONFLICT DO NOTHING;

    INSERT INTO "membership"."event" 
    ("title", "type", "description", "startDate", "endDate", "organizerUserId")
    VALUES
    (
        'Congreso de Damas', 
        'Congreso', 
        'El evento anual más esperado de las damas.', 
        '2026-09-05 02:00:00+00', 
        '2026-09-05 13:30:00+00', 
        1
    ),
    (
        'Culto DominicaL', 
        'Culto', 
        'Reunion congregacional para alabanzas y enseñanza biblica.', 
        '2026-09-05 04:00:00+00', 
        '2026-09-05 07:30:00+00', 
        2
    ),
    (
        'Congreso de caballleros', 
        'Congreso', 
        'El evento anual más esperado de los Caballeros.', 
        '2026-09-05 12:00:00+00', 
        '2026-09-05 17:30:00+00', 
        1
    ),
    (
        'Culto unido Previsterial', 
        'Reunion entre iglesias seccion Bani-Ocoa', 
        'Reunion congregacional para alabanzas, enseñanza biblica e informaciones.', 
        '2026-09-05 16:00:00+00', 
        '2026-09-05 19:30:00+00',
        3
    ),
    (
        'EBDV', 
        'Escuela biblica para niños', 
        'Escuela biblica de verano para niños de 4 a 12 años.', 
        '2026-09-05 05:00:00+00', 
        '2026-09-05 10:30:00+00', 
        2
    );
