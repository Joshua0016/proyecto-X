namespace Backend.interfaces;

using Backend.DTOs;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;


public interface IDonationItemTypeService
{
    Task<IEnumerable<DonationItemTypeResponseDTO>> GetAllsAsync();
    Task<DonationItemType?> GetByIdAsync(int id);
    Task AddAsync(DonationItemTypeCreateDTO dto);
    Task UpdateAsync(DonationItemTypeResponseDTO dto, int id);
    Task DeleteAsync(int id);
}