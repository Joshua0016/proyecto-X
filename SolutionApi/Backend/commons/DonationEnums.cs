namespace Backend.commons;

public enum DonationPaymentMethod
{
    Cash,
    Transfer,
    Check,
    CreditCard,
    DebitCard
}

public enum DonationStatus
{
    Pending,
    Completed,
    Cancelled
}

public enum DonationType
{
    Diezmo,
    Ofrenda,
    Campaña,
    Especial
}
