using Backend.DTOs;

namespace Backend.interfaces;

public interface IDonationService
{
    Task<IEnumerable<DonationResponseDTO>> ListAll();
    Task<IEnumerable<DonationResponseDTO>> ListByMember(int memberId);
    Task<DonationResponseDTO> GetById(int id);
    Task<int> CreateDonation(DonationCreateDTO request);
    Task Update(int id, DonationUpdateDTO request);
    Task Delete(int id);
}
