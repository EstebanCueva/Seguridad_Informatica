import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { api } from "../api";

export default function Reports() {
  const downloadCsv = () => {
    window.open("/api/reports/risks.csv", "_blank");
  };

  const seedDemo = async () => {
    await api.post("/seed/demo?risks=30&days=30");
    alert("Demo cargada ✅ (30 riesgos)");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>Reports</Typography>
      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        Exportación
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={downloadCsv}>
              Descargar reporte CSV
            </Button>
            <Button variant="outlined" onClick={seedDemo}>
              Demo Quemada (30 riesgos)
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
