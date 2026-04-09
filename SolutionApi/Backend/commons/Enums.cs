using NpgsqlTypes;

namespace Backend.commons;

public enum Gender
{
    Masculino,
    Femenino
}

public enum MaritalStatus
{
    Soltero,
    Casado,
    Viudo,
    Divorciado
}

public enum MemberType
{
    Comunion,
    Activos,
    Pasivos,
    Visitantes,
    Ministeriales,
    Catecumenos,
    Adherentes
}

public enum AcademicLevel
{
    Primaria,
    Secundaria,
    Grado,
    Postgrado
}

public enum DonationStatus
{
    Pendiente,
    Confirmado,
    Rechazado
}

public enum PaymentMethod
{
    Efectivo,
    Transferencia,
    Cheque,
    Deposito
}

public enum UnitOfMeasure
{
    libras,
    galones,
    unidades,
    litros,
    kilogramos,
    otros
}

public enum CategoryItem
{
    Dinero,
    Comida,
    Ropa,
    Combustible,
    Medicamentos,

    [PgName("Materiales de construcción")]
    MaterialesDeConstruccion,

    Muebles,

    [PgName("Electrodomésticos")]
    Electrodomesticos,

    Juguetes,
    Libros,
    Otros
}
