using Microsoft.EntityFrameworkCore;
using RiskApi.Models;

namespace RiskApi.Data;

public class RiskDbContext : DbContext
{
    public RiskDbContext(DbContextOptions<RiskDbContext> options) : base(options) { }

    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Risk> Risks => Set<Risk>();
    public DbSet<TreatmentPlan> TreatmentPlans => Set<TreatmentPlan>();
    public DbSet<Control27002> Controls => Set<Control27002>();
    public DbSet<TreatmentControl> TreatmentControls => Set<TreatmentControl>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TreatmentControl>()
            .HasKey(x => new { x.TreatmentPlanId, x.Control27002Id });

        modelBuilder.Entity<TreatmentControl>()
            .HasOne(x => x.TreatmentPlan)
            .WithMany(p => p.TreatmentControls)
            .HasForeignKey(x => x.TreatmentPlanId);

        modelBuilder.Entity<TreatmentControl>()
            .HasOne(x => x.Control)
            .WithMany()
            .HasForeignKey(x => x.Control27002Id);

        // Default timestamps (SQL Server)
        modelBuilder.Entity<Risk>()
            .Property(r => r.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<Risk>()
            .Property(r => r.UpdatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        // Seed ISO 27002 (lista corta para MVP)
        modelBuilder.Entity<Control27002>().HasData(
            new Control27002
            {
                Id = 1,
                Code = "5.1",
                Name = "Policies for information security",
                Type = "Organizational",
                Description = "Define and maintain information security policies."
            },
            new Control27002
            {
                Id = 2,
                Code = "5.15",
                Name = "Access control",
                Type = "Technological",
                Description = "Control access to information and systems."
            },
            new Control27002
            {
                Id = 3,
                Code = "8.9",
                Name = "Configuration management",
                Type = "Technological",
                Description = "Manage secure configurations for systems and services."
            },
            new Control27002
            {
                Id = 4,
                Code = "8.16",
                Name = "Monitoring activities",
                Type = "Technological",
                Description = "Log and monitor security events."
            },
            new Control27002
            {
                Id = 5,
                Code = "8.12",
                Name = "Data leakage prevention",
                Type = "Technological",
                Description = "Prevent unauthorized data exfiltration."
            }
        );
    }
}
