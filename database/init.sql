
-- 1. CREACIÓN DE ESQUEMAS

CREATE SCHEMA IF NOT EXISTS seguridad;
CREATE SCHEMA IF NOT EXISTS membresia;
CREATE SCHEMA IF NOT EXISTS finanzas;


-- 2. ESQUEMA SEGURIDAD

CREATE TABLE seguridad.rol (
    id_rol int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(50) UNIQUE NOT NULL,
);

CREATE TABLE seguridad.usuario (
    id_usuario int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email varchar(150) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password text NOT NULL,
    id_rol int NOT NULL REFERENCES seguridad.rol(id_rol),
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE seguridad.log_auditoria (
    id_log int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    id_usuario int NOT NULL REFERENCES seguridad.usuario(id_usuario),
    operacion varchar(50) NOT NULL,
    tabla_afectada varchar(100) NOT NULL,
    detalle text NOT NULL,
    ip_origen varchar(50) NOT NULL
);


-- 3. ESQUEMA MEMBRESIA

CREATE TABLE membresia.familia (
    id_familia int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_familia varchar(100) NOT NULL,
    direccion text NOT NULL,
    telefono varchar(15)
);

CREATE TABLE membresia.miembro (
    id_miembro int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    apellido varchar(50) NOT NULL,
    foto_url text,
    fecha_nacimiento date NOT NULL,
    id_usuario int NOT NULL REFERENCES seguridad.usuario(id_usuario),
    id_familia int NOT NULL REFERENCES membresia.familia(id_familia)
);

CREATE TABLE membresia.evento (
    id_evento int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo varchar(100) NOT NULL,
    tipo varchar(50) NOT NULL,
    descripcion text,
    fecha_inicio timestamptz NOT NULL,
    fecha_fin timestamptz NOT NULL,
    id_usuario_organizador int REFERENCES seguridad.usuario(id_usuario),
    CONSTRAINT check_fechas CHECK (fecha_fin > fecha_inicio)
);

CREATE TABLE membresia.asistencia (
    id_asistencia int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_evento int NOT NULL REFERENCES membresia.evento(id_evento),
    id_miembro int NOT NULL REFERENCES membresia.miembro(id_miembro),
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    presente boolean NOT NULL,
    hora_entrada timestamptz,
    hora_salida timestamptz
);


-- 4. ESQUEMA FINANZAS

CREATE TABLE finanzas.cuenta_contable (
    codigo_cuenta varchar(20) PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    tipo varchar(50) NOT NULL,
    subtipo varchar(50) NOT NULL,
    saldo_actual decimal(12,2) DEFAULT 0 NOT NULL,
    activa boolean DEFAULT true NOT NULL
);

CREATE TABLE finanzas.asiento_contable (
    id_asiento int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha timestamptz DEFAULT NOW() NOT NULL,
    glosa text NOT NULL,
    referencia varchar(50) NOT NULL,
    cuadrado boolean DEFAULT false,
    id_usuario_registrador int NOT NULL REFERENCES seguridad.usuario(id_usuario)
);

CREATE TABLE finanzas.movimiento_contable (
    id_movimiento int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asiento int NOT NULL REFERENCES finanzas.asiento_contable(id_asiento),
    codigo_cuenta varchar(20) NOT NULL REFERENCES finanzas.cuenta_contable(codigo_cuenta),
    debe decimal (12,2) DEFAULT 0 NOT NULL,
    haber decimal(12,2) DEFAULT 0 NOT NULL
);

CREATE TABLE finanzas.donacion (
    id_donacion int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_miembro int NOT NULL REFERENCES membresia.miembro(id_miembro),
    monto decimal (12,2) NOT NULL,
    fecha timestamptz DEFAULT NOW() NOT NULL,
    tipo varchar(50) NOT NULL,
    metodo_pago varchar(50) NOT NULL,
    estado varchar(20) NOT NULL
);

CREATE TABLE finanzas.recibo_fiscal (
    id_recibo_fiscal int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo varchar(50) UNIQUE NOT NULL, 
    fecha_emision timestamptz DEFAULT NOW() NOT NULL,
    id_donacion int NOT NULL REFERENCES finanzas.donacion(id_donacion)
);

CREATE TABLE finanzas.proveedor (
    id_proveedor int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    ruc varchar(20) NOT NULL,
    direccion text NOT NULL,
    telefono varchar(12) NOT NULL
);

CREATE TABLE finanzas.factura_gasto (
    id_factura_gasto int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor int NOT NULL REFERENCES finanzas.proveedor(id_proveedor),
    numero_factura varchar(50) NOT NULL,
    total decimal(12,2) NOT NULL,
    fecha_emision timestamptz NOT NULL,
    fecha_vencimiento timestamptz NOT NULL,
    estado varchar(20) NOT NULL,
    id_asiento int NOT NULL REFERENCES finanzas.asiento_contable(id_asiento)
);


-- 5. FUNCIONES ACTUALIZADAS CON ESQUEMAS
		
CREATE OR REPLACE FUNCTION finanzas.registrar_donacion(
    p_miembro int,
    p_monto decimal,
    p_cuenta varchar,
    p_usuario_id int,
    p_metodo_pago varchar,
    p_tipo varchar
)
RETURNS int AS $$
DECLARE
    v_asiento int;
    v_donacion int;
BEGIN
    INSERT INTO finanzas.asiento_contable (glosa, referencia, id_usuario_registrador)
    VALUES ('Donación Recibida', 'DON-MB-' || p_miembro, p_usuario_id)
    RETURNING id_asiento INTO v_asiento;

    INSERT INTO finanzas.movimiento_contable (id_asiento, codigo_cuenta, debe, haber)
    VALUES (v_asiento, p_cuenta, p_monto, 0);

    UPDATE finanzas.cuenta_contable
    SET saldo_actual = saldo_actual + p_monto
    WHERE codigo_cuenta = p_cuenta;

    INSERT INTO finanzas.donacion (id_miembro, monto, tipo, metodo_pago, estado)
    VALUES (p_miembro, p_monto, p_tipo, p_metodo_pago, 'CONFIRMADA')
    RETURNING id_donacion INTO v_donacion;

    RETURN v_donacion;
END;
$$ LANGUAGE plpgsql;


-- DATOS DE PRUEBA PARA LOGIN

INSERT INTO seguridad.rol (nombre, descripcion)
VALUES ('admin', 'Administrador con acceso total')
ON CONFLICT (nombre) DO NOTHING;

DO $$
DECLARE
    v_admin_id INT;
BEGIN
    SELECT id_rol INTO v_admin_id
    FROM seguridad.rol
    WHERE nombre = 'admin';

    IF v_admin_id IS NULL THEN
        RAISE EXCEPTION 'No se pudo crear ni encontrar el rol admin';
    END IF;

    INSERT INTO seguridad.usuario (email, password, id_rol) VALUES
    ('joshua@proyectox.com', 'admin123', v_admin_id),
    ('elias@proyectox.com', 'admin123', v_admin_id),
    ('gadiel@proyectox.com', 'admin123', v_admin_id)
    ON CONFLICT (email) DO NOTHING;
END $$;
