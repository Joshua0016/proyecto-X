using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class DonationService(DonationRepository repo) : IDonationService
{
    public async Task<IEnumerable<DonationResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Select(d => d.Adapt<DonationResponseDTO>());

    public async Task<IEnumerable<DonationResponseDTO>> ListByMember(int memberId) =>
        (await repo.GetByMemberAsync(memberId)).Select(d => d.Adapt<DonationResponseDTO>());

    public async Task<DonationResponseDTO> GetById(int id)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");
        return donation.Adapt<DonationResponseDTO>();
    }

    public async Task<int> CreateDonation(DonationCreateDTO request)
    {
        if (request.Date > DateTime.Now)
            throw new ArgumentException("La fecha no puede ser futura");

        var donation = request.Adapt<Donation>();
        donation.Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);

        await repo.AddAsync(donation);
        return donation.DonationId;
    }

    public async Task Update(int id, DonationUpdateDTO request)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");

        donation.MemberId = request.MemberId;
        donation.Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);
        donation.Observation = request.Observation;

        await repo.UpdateAsync(donation);
    }

    public async Task Delete(int id)
    {
        var donation = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Donación no encontrada");
        await repo.DeleteAsync(donation.DonationId);
    }
}
