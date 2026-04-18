using Backend.DTOs;
using Backend.interfaces;
using Backend.Models;
using Backend.Repositories;
using Mapster;

namespace Backend.Services;

public class ExpenseInvoiceService(ExpenseInvoiceRepository repo) : IExpenseInvoiceService
{
    public async Task<IEnumerable<ExpenseInvoiceResponseDTO>> ListAll() =>
        (await repo.GetAllAsync()).Adapt<IEnumerable<ExpenseInvoiceResponseDTO>>();

    public async Task<IEnumerable<ExpenseInvoiceResponseDTO>> ListByVendor(int vendorId) =>
        (await repo.GetByVendorAsync(vendorId)).Adapt<IEnumerable<ExpenseInvoiceResponseDTO>>();

    public async Task<ExpenseInvoiceResponseDTO> GetById(int id)
    {
        var invoice = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Factura de gasto no encontrada");
        return invoice.Adapt<ExpenseInvoiceResponseDTO>();
    }

    public async Task<int> Persist(ExpenseInvoiceCreateDto request)
    {
        if (request.DueDate < request.IssueDate)
            throw new ArgumentException("La fecha de vencimiento debe ser igual o posterior a la fecha de emisión");

        if (!await repo.VendorExistsAsync(request.VendorId))
            throw new ArgumentException("El proveedor especificado no existe");

        if (!await repo.JournalEntryExistsAsync(request.JournalEntryId))
            throw new ArgumentException("El asiento contable especificado no existe");

        var invoice = request.Adapt<ExpenseInvoice>();
        invoice.IssueDate = request.IssueDate.ToDateTime(TimeOnly.MinValue);
        invoice.DueDate   = request.DueDate.ToDateTime(TimeOnly.MinValue);
        await repo.AddAsync(invoice);
        return invoice.ExpenseInvoiceId;
    }

    public async Task Update(int id, ExpenseInvoiceUpdateDto request)
    {
        var invoice = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Factura de gasto no encontrada");

        if (request.DueDate < request.IssueDate)
            throw new ArgumentException("La fecha de vencimiento debe ser igual o posterior a la fecha de emisión");

        if (invoice.Status == "Cancelled")
            throw new InvalidOperationException("No se puede modificar una factura cancelada");

        request.Adapt(invoice);
        invoice.IssueDate = request.IssueDate.ToDateTime(TimeOnly.MinValue);
        invoice.DueDate   = request.DueDate.ToDateTime(TimeOnly.MinValue);
        await repo.UpdateAsync(invoice);
    }

    public async Task Delete(int id)
    {
        var invoice = await repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Factura de gasto no encontrada");

        if (invoice.Status == "Paid")
            throw new InvalidOperationException("No se puede eliminar una factura pagada");

        await repo.DeleteAsync(invoice.ExpenseInvoiceId);
    }
}
