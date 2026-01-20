import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart, Area,
  XAxis, YAxis, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell, Legend,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    api.get("/dashboard/summary").then(r => setSummary(r.data));
    api.get("/dashboard/trend?days=14").then(r => setTrend(r.data));
  }, []);

  const byLevel = useMemo(
    () => (summary?.byLevel ?? []).map(x => ({ name: x.level, value: x.count })),
    [summary]
  );

  const byStatus = useMemo(
    () => (summary?.byStatus ?? []).map(x => ({ name: x.status, value: x.count })),
    [summary]
  );

  const kpi = useMemo(() => {
    const get = (lvl) => summary?.byLevel?.find(x => x.level === lvl)?.count ?? 0;
    return {
      total: summary?.total ?? 0,
      high: get("High"),
      critical: get("Critical"),
      controlsTotal: summary?.controlsTotal ?? 0,
      controlsImplemented: summary?.controlsImplemented ?? 0
    };
  }, [summary]);

  return (
    <Box sx={{ width: 1400 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
        Dashboard
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        Dashboard de riesgos y controles
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
        <KpiFill title="Total riesgos" value={kpi.total} />
        <KpiFill title="High" value={kpi.high} chip="Priority" />
        <KpiFill title="Critical" value={kpi.critical} chip="Urgent" />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
        <KpiFill title="Controles total" value={kpi.controlsTotal} />
        <KpiFill title="Controles implementados" value={kpi.controlsImplemented} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <CardPro title="Risk Trend (últimos 14 días)" h={420}>
          <Box sx={{ height: 330 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3D7F" stopOpacity={0.9} />
                    <stop offset="55%" stopColor="#F59E0B" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#FF3D7F" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardPro>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2, mt: 2 }}>
        <CardPro title="Riesgos por nivel" h={380}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byLevel.length ? byLevel : [{ name: "Low", value: 0 }]}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Cantidad" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardPro>

        <CardPro title="Riesgos por estado" h={380}>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus.length ? byStatus : [{ name: "Pending", value: 0 }]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {(byStatus.length ? byStatus : [1]).map((_, i) => <Cell key={i} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardPro>
      </Box>
    </Box>
  );
}

function KpiFill({ title, value, chip }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: 150,
        borderRadius: 3,
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>{title}</Typography>
          {chip ? <Chip size="small" label={chip} /> : null}
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function CardPro({ title, h, children }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: h,
        borderRadius: 3,
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Typography sx={{ fontWeight: 900, mb: 1 }}>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}
