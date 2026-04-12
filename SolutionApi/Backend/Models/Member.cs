using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.commons;

namespace Backend.Models;

public partial class Member
{
    [Key]
    public int MemberId { get; set; }

    [StringLength(20)]
    public string? NationalId { get; set; }

    [StringLength(20)]
    public string? PassportNumber { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = null!;

    [StringLength(50)]
    public string? SecondName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = null!;

    [StringLength(50)]
    public string? SecondLastName { get; set; }

    [Required]
    public Gender Gender { get; set; }

    [Required]
    public DateTime BirthDate { get; set; }

    [StringLength(50)]
    public string? BirthPlace { get; set; }

    [StringLength(50)]
    public string? Nationality { get; set; }

    [Required]
    public MaritalStatus MaritalStatus { get; set; }

    public string? PhotoUrl { get; set; }

    [StringLength(15)]
    public string? PhoneNumber { get; set; }

    [EmailAddress]
    [StringLength(150)]
    public string? Email { get; set; }

    public string? Address { get; set; }

    public int? SectorId { get; set; }

    [StringLength(100)]
    public string? EmergencyContactName { get; set; }

    [StringLength(15)]
    public string? EmergencyContactPhone { get; set; }

    // public int? FamilyId { get; set; }

    public string? MedicalCondition { get; set; }

    [StringLength(5)]
    public string? BloodType { get; set; }

    public MemberType? MemberType { get; set; }

    public bool IsActive { get; set; } = true; // Nuevo

    public DateTime? JoinDate { get; set; }

    public DateTime? ConversionDate { get; set; }

    [StringLength(100)]
    public string? OriginChurch { get; set; }

    public bool Baptized { get; set; }

    public DateTime? BaptismDate { get; set; }

    [StringLength(100)]
    public string? BaptismPlace { get; set; }

    [StringLength(50)]
    public string? DiscipleshipLevel { get; set; }

    public int? SmallGroupId { get; set; }

    public int? ChurchRoleId { get; set; }

    public string? MemberSkills { get; set; }

    public bool Discipline { get; set; }

    public bool CourtCase { get; set; }


    public DateTime? TransferDate { get; set; } // Nuevos

    public string? TransferDestination { get; set; } //Nuevos

    public AcademicLevel? AcademicLevel { get; set; }

    [StringLength(100)]
    public string? Profession { get; set; }

    [StringLength(100)]
    public string? Occupation { get; set; }

    public string? MemberCourses { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    // public virtual Family? Family { get; set; }
    public virtual Sector? Sector { get; set; }
    public virtual SmallGroup? SmallGroup { get; set; }
    public virtual ChurchRole? ChurchRole { get; set; }

    // Collection navigation properties
    public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public virtual ICollection<MemberSmallGroup> MemberSmallGroups { get; set; } = new List<MemberSmallGroup>();
    public virtual ICollection<MemberChurchRole> MemberChurchRoles { get; set; } = new List<MemberChurchRole>();
    public virtual ICollection<CourtCaseInfo> CourtCaseInfos { get; set; } = new List<CourtCaseInfo>();
    public virtual ICollection<DisciplinaryInfo> DisciplinaryInfos { get; set; } = new List<DisciplinaryInfo>();

    public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();

}
