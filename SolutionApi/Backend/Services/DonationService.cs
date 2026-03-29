using Backend.commons;
using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class DonationService(DonationRepository repo) : IDonationService
{
    public async Task<IEnumerable<DonationResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Select(MapToResponse);

    public async Task<IEnumerable<DonationResponseDTO>> ListByMember(int memberId) =>
        (await repo.GetByMemberAsync(memberId)).Select(MapToResponse);

    public async Task<DonationResponseDTO> GetById(int id)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");
        return MapToResponse(donation);
    }

    public async Task<int> CreateDonation(DonationCreateDto request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("El monto debe ser mayor a cero");

        if (request.Date > DateTime.Now)
            throw new ArgumentException("La fecha no puede ser futura");

        var donation = new Donation
        {
            MemberId      = request.MemberId,
            Amount        = request.Amount,
            Date          = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc),
            Type          = request.Type.ToString(),
            PaymentMethod = request.PaymentMethod.ToString(),
            Status        = request.Status.ToString()
        };

        await repo.AddAsync(donation);
        return donation.DonationId;
    }

    public async Task Update(int id, DonationUpdateDto request)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");

        if (request.Amount <= 0)
            throw new ArgumentException("El monto debe ser mayor a cero");

        if (donation.Status == DonationStatus.Cancelled.ToString())
            throw new InvalidOperationException("No se puede modificar una donación cancelada");

        donation.Amount = request.Amount;
        donation.Status = request.Status.ToString();
        await repo.UpdateAsync(donation);
    }

    public async Task Delete(int id)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");
        await repo.DeleteAsync(donation.DonationId);
    }

    private static DonationResponseDTO MapToResponse(Donation d) => new(
        DonationId:     d.DonationId,
        MemberId:       d.MemberId,
        MemberName:     $"{d.Member?.FirstName} {d.Member?.LastName}".Trim(),
        Amount:         d.Amount,
        Date:           d.Date,
        Type:           d.Type,
        PaymentMethod:  d.PaymentMethod,
        Status:         d.Status,
        TaxReceiptCode: d.TaxReceipts.FirstOrDefault()?.Code
    );
}
