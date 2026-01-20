namespace RiskApi.Models;

public class Risk
{
    public int Id { get; set; }
    public int AssetId { get; set; }
    public Asset? Asset { get; set; }

    public string Threat { get; set; } = "";
    public string Vulnerability { get; set; } = "";
    public string? ExistingControls { get; set; }

    public int Probability { get; set; } 
    public int Impact { get; set; }      
    public int Score { get; set; }       
    public string Level { get; set; } = "Low"; 
    public string Status { get; set; } = "Pending"; 

    public int? ResidualProbability { get; set; }
    public int? ResidualImpact { get; set; }
    public int? ResidualScore { get; set; }
    public string? ResidualLevel { get; set; }

    public TreatmentPlan? TreatmentPlan { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? Observations { get; set; }   // comunicación/consulta
    public string? Recommendations { get; set; } // comunicación/consulta

}
