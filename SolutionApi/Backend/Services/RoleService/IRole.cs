using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    public interface IRole
    {
        Task<IEnumerable<RolesResponseDTO>> ListAll();
        Task Persist(RoleCreateDTO request);
        Task Update(int id);
        Task Delete(int id);

    }
}