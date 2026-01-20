namespace RiskApi.Models;

public class TreatmentPlan
{
    public int Id { get; set; }
    public int RiskId { get; set; }
    public Risk? Risk { get; set; }

    public string Strategy { get; set; } = "Mitigate"; // Avoid/Mitigate/Transfer/Accept
    public string Owner { get; set; } = "";
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }

    public List<TreatmentControl> TreatmentControls { get; set; } = new();
}
