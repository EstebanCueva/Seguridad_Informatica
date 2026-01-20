namespace RiskApi.Models;

public class Asset
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Owner { get; set; } = "";
    public int Confidentiality { get; set; } 
    public int Integrity { get; set; }       
    public int Availability { get; set; }    
    public int AssetValue { get; set; }      
    public string? Description { get; set; }

    public List<Risk> Risks { get; set; } = new();
}
