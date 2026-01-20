namespace RiskApi.Models;

public class TreatmentControl
{
    public int TreatmentPlanId { get; set; }
    public TreatmentPlan? TreatmentPlan { get; set; }

    public int Control27002Id { get; set; }
    public Control27002? Control { get; set; }

    public string Status { get; set; } = "Planned";
    public string? Evidence { get; set; }
    public DateTime? ImplementedAt { get; set; }
}
