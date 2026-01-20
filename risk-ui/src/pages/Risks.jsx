import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  MenuItem,
} from "@mui/material";

const empty = {
  id: 0,
  assetId: 0,
  threat: "",
  vulnerability: "",
  existingControls: "",
  probability: 3,
  impact: 3,
  status: "Pending",
  residualProbability: null,
  residualImpact: null,
  observations: "",
  recommendations: "",
};

export default function Risks() {
  const [rows, setRows] = useState([]);
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const [r1, r2] = await Promise.all([api.get("/risks"), api.get("/assets")]);
    setRows(r1.data);
    setAssets(r2.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.assetId) return;

    const payload = { ...form };

    payload.existingControls = payload.existingControls ?? "";
    payload.observations = payload.observations ?? "";
    payload.recommendations = payload.recommendations ?? "";

    if (payload.id && payload.id !== 0) {
      await api.put(`/risks/${payload.id}`, payload);
    } else {
      await api.post("/risks", { ...payload, id: 0 });
    }

    setOpen(false);
    setForm(empty);
    load();
  };

  const del = async (id) => {
    await api.delete(`/risks/${id}`);
    load();
  };

  const assetName = (id) => assets.find((a) => a.id === id)?.name ?? `Asset ${id}`;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Risks
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            CRUD de riesgos y evaluación
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => {
            setForm({ ...empty, assetId: assets[0]?.id ?? 0 });
            setOpen(true);
          }}
          disabled={assets.length === 0}
        >
          + Nuevo Risk
        </Button>
      </Box>

      {assets.length === 0 ? (
        <Card sx={{ border: "1px solid rgba(15,23,42,0.06)", borderRadius: 3, mb: 2 }}>
          <CardContent>
            <Typography>Primero crea al menos 1 Asset para poder registrar riesgos.</Typography>
          </CardContent>
        </Card>
      ) : null}

      <Card sx={{ border: "1px solid rgba(15,23,42,0.06)", borderRadius: 3 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Asset</b>
                </TableCell>
                <TableCell>
                  <b>Amenaza</b>
                </TableCell>
                <TableCell>
                  <b>Vulnerabilidad</b>
                </TableCell>
                <TableCell>
                  <b>P</b>
                </TableCell>
                <TableCell>
                  <b>I</b>
                </TableCell>
                <TableCell>
                  <b>Score</b>
                </TableCell>
                <TableCell>
                  <b>Nivel</b>
                </TableCell>
                <TableCell>
                  <b>Estado</b>
                </TableCell>
                <TableCell>
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{x.id}</TableCell>
                  <TableCell>{assetName(x.assetId)}</TableCell>
                  <TableCell>{x.threat}</TableCell>
                  <TableCell>{x.vulnerability}</TableCell>
                  <TableCell>{x.probability}</TableCell>
                  <TableCell>{x.impact}</TableCell>
                  <TableCell>{x.score}</TableCell>
                  <TableCell>{x.level}</TableCell>
                  <TableCell>{x.status}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setForm({
                            ...x,
                            observations: x.observations ?? "",
                            recommendations: x.recommendations ?? "",
                          });
                          setOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => del(x.id)}>
                        Eliminar
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>No hay riesgos aún.</TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Editar Risk" : "Nuevo Risk"}</DialogTitle>

        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Asset"
            value={form.assetId}
            onChange={(e) => setForm({ ...form, assetId: Number(e.target.value) })}
          >
            {assets.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Threat (Amenaza)"
            value={form.threat}
            onChange={(e) => setForm({ ...form, threat: e.target.value })}
          />

          <TextField
            label="Vulnerability (Vulnerabilidad)"
            value={form.vulnerability}
            onChange={(e) => setForm({ ...form, vulnerability: e.target.value })}
          />

          <TextField
            label="Existing Controls"
            value={form.existingControls ?? ""}
            onChange={(e) => setForm({ ...form, existingControls: e.target.value })}
          />

          <TextField
            label="Probability (1-5)"
            type="number"
            value={form.probability}
            onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })}
          />

          <TextField
            label="Impact (1-5)"
            type="number"
            value={form.impact}
            onChange={(e) => setForm({ ...form, impact: Number(e.target.value) })}
          />

          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {["Pending", "InProgress", "Closed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          {/*  Comunicación / consulta */}
          <TextField
            label="Observations (Observaciones)"
            value={form.observations ?? ""}
            multiline
            minRows={2}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
          />

          <TextField
            label="Recommendations (Recomendaciones)"
            value={form.recommendations ?? ""}
            multiline
            minRows={2}
            onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
          />

          <Typography sx={{ fontWeight: 900, mt: 1 }}>Residual (opcional)</Typography>

          <TextField
            label="Residual Probability (1-5)"
            type="number"
            value={form.residualProbability ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                residualProbability: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />

          <TextField
            label="Residual Impact (1-5)"
            type="number"
            value={form.residualImpact ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                residualImpact: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
