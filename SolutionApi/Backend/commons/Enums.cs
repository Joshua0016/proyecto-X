using NpgsqlTypes;

namespace Backend.commons;

public enum Gender
{
    M,
    F
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

public enum CaseStatus
{
    EnProceso,
    Resuelto,
    apelado,
    archivado
}

public enum EventStatus
{
    Programado,
    [PgName("En curso")]
    EnCurso,
    Finalizado,
    Cancelado
}

public enum Municipio
{
    Bani,
    Matanzas,
    Nizao
}

public enum Distrito
{
    Baní,
    Catalina,
    ElCarreton,
    ElLimonal,
    Paya,
    VillaFundacion,
    Matanzas,
    SabanaBuey,
    VillaSombrero,
    Nizao,
    Pizarrete,
    Santana
}

public enum RelationShip
{
    Padre, Madre, Hijo, Hija, Abuelo, Abuela, Nieto, Nieta,
    Hermano, Hermana, Tío, Tía, Sobrino, Sobrina, Primo, Prima, Cónyuge, Suegro, Suegra, Yerno, Nuera,
    Cuñado, Cuñada, Padrastro, Madrastra, Hijastro, Hijastra, Tutor, Pupilo, Otro
}
