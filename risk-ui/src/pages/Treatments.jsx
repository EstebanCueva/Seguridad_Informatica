import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import {
  Box, Card, CardContent, Typography, MenuItem, TextField, Button,
  FormControlLabel, Checkbox, Stack, Divider
} from "@mui/material";

export default function Treatments() {
  const [risks, setRisks] = useState([]);
  const [controls, setControls] = useState([]);
  const [riskId, setRiskId] = useState("");
  const [plan, setPlan] = useState({
    strategy: "Mitigate",
    owner: "",
    dueDate: "",
    notes: "",
    residualProbability: "",
    residualImpact: "",
    selectedControls: {} 
  });

  useEffect(() => {
    Promise.all([api.get("/risks"), api.get("/controls")]).then(([r1, r2]) => {
      setRisks(r1.data);
      setControls(r2.data);
      if (r1.data?.length) setRiskId(String(r1.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!riskId) return;
    api.get(`/treatmentplans/by-risk/${riskId}`)
      .then(r => {
        const p = r.data;
        const selected = {};
        (p.treatmentControls || []).forEach(tc => {
          selected[tc.control27002Id] = {
            checked: true,
            status: tc.status || "Planned",
            evidence: tc.evidence || ""
          };
        });

        setPlan(prev => ({
          ...prev,
          strategy: p.strategy || "Mitigate",
          owner: p.owner || "",
          dueDate: p.dueDate ? p.dueDate.substring(0, 10) : "",
          notes: p.notes || "",
          selectedControls: selected
        }));
      })
      .catch(() => {
        setPlan(prev => ({ ...prev, selectedControls: {} }));
      });
  }, [riskId]);

  const riskTitle = useMemo(() => {
    const r = risks.find(x => String(x.id) === String(riskId));
    if (!r) return "";
    return `#${r.id} - ${r.threat} (${r.level}/${r.status})`;
  }, [risks, riskId]);

  const toggleControl = (id) => {
    setPlan(prev => {
      const next = { ...prev.selectedControls };
      const cur = next[id] || { checked: false, status: "Planned", evidence: "" };
      next[id] = { ...cur, checked: !cur.checked };
      return { ...prev, selectedControls: next };
    });
  };

  const setControlField = (id, field, value) => {
    setPlan(prev => {
      const next = { ...prev.selectedControls };
      const cur = next[id] || { checked: true, status: "Planned", evidence: "" };
      next[id] = { ...cur, [field]: value, checked: true };
      return { ...prev, selectedControls: next };
    });
  };

  const save = async () => {
    if (!riskId) return;

    const controlsPayload = Object.entries(plan.selectedControls)
      .filter(([_, v]) => v.checked)
      .map(([id, v]) => ({
        control27002Id: Number(id),
        status: v.status || "Planned",
        evidence: v.evidence || null
      }));

    await api.post("/treatmentplans", {
      riskId: Number(riskId),
      strategy: plan.strategy,
      owner: plan.owner,
      dueDate: plan.dueDate ? `${plan.dueDate}T00:00:00` : null,
      notes: plan.notes || null,
      residualProbability: plan.residualProbability === "" ? null : Number(plan.residualProbability),
      residualImpact: plan.residualImpact === "" ? null : Number(plan.residualImpact),
      controls: controlsPayload
    });

    alert("Tratamiento guardado ✅");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>Treatments</Typography>
      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        Estrategia de tratamiento de riesgos y controles asociados
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              label="Riesgo"
              value={riskId}
              onChange={(e) => setRiskId(e.target.value)}
              sx={{ flex: 1 }}
            >
              {risks.map(r => (
                <MenuItem key={r.id} value={r.id}>
                  #{r.id} - {r.threat} ({r.level}/{r.status})
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" onClick={save} disabled={!riskId}>
              Guardar
            </Button>
          </Stack>

          {riskTitle && (
            <Typography sx={{ mt: 1, color: "text.secondary" }}>
              Seleccionado: <b>{riskTitle}</b>
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Estrategia"
              value={plan.strategy}
              onChange={(e) => setPlan(p => ({ ...p, strategy: e.target.value }))}
              sx={{ width: 240 }}
            >
              {["Mitigate", "Transfer", "Accept", "Avoid"].map(x => (
                <MenuItem key={x} value={x}>{x}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Responsable"
              value={plan.owner}
              onChange={(e) => setPlan(p => ({ ...p, owner: e.target.value }))}
              sx={{ flex: 1 }}
            />

            <TextField
              type="date"
              label="Fecha límite"
              InputLabelProps={{ shrink: true }}
              value={plan.dueDate}
              onChange={(e) => setPlan(p => ({ ...p, dueDate: e.target.value }))}
              sx={{ width: 220 }}
            />
          </Stack>

          <TextField
            label="Notas / Comunicación"
            multiline
            minRows={2}
            value={plan.notes}
            onChange={(e) => setPlan(p => ({ ...p, notes: e.target.value }))}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 900, mb: 1 }}>Riesgo residual (opcional)</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Probabilidad residual (1-5)"
              type="number"
              value={plan.residualProbability}
              onChange={(e) => setPlan(p => ({ ...p, residualProbability: e.target.value }))}
              sx={{ width: 260 }}
            />
            <TextField
              label="Impacto residual (1-5)"
              type="number"
              value={plan.residualImpact}
              onChange={(e) => setPlan(p => ({ ...p, residualImpact: e.target.value }))}
              sx={{ width: 260 }}
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 900, mb: 1 }}>Controles ISO (check + estado + evidencia)</Typography>

          <Box sx={{ maxHeight: 360, overflow: "auto", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 2 }}>
            {controls.map(c => {
              const st = plan.selectedControls[c.id] || { checked: false, status: "Planned", evidence: "" };

              return (
                <Box key={c.id} sx={{ p: 1.2, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <FormControlLabel
                    control={<Checkbox checked={!!st.checked} onChange={() => toggleControl(c.id)} />}
                    label={`${c.code} - ${c.name}`}
                  />

                  {st.checked && (
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <TextField
                        select
                        label="Estado"
                        value={st.status}
                        onChange={(e) => setControlField(c.id, "status", e.target.value)}
                        sx={{ width: 200 }}
                      >
                        {["Planned", "InProgress", "Implemented"].map(x => (
                          <MenuItem key={x} value={x}>{x}</MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Evidencia (link/texto)"
                        value={st.evidence}
                        onChange={(e) => setControlField(c.id, "evidence", e.target.value)}
                        sx={{ flex: 1 }}
                      />
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
