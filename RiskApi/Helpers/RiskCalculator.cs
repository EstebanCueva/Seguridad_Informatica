namespace RiskApi.Helpers;

public static class RiskCalculator
{
    public static int Score(int probability, int impact) => probability * impact;

    public static string Level(int score)
    {
        if (score >= 20) return "Critical";
        if (score >= 12) return "High";
        if (score >= 6) return "Moderate";
        return "Low";
    }
}
