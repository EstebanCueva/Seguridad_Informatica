import { useEffect, useState } from "react";
import { api } from "../api";
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Stack
} from "@mui/material";

const empty = {
  id: 0, name: "", owner: "",
  confidentiality: 3, integrity: 3, availability: 3,
  assetValue: 3, description: ""
};

export default function Assets() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const load = () => api.get("/assets").then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name.trim()) return;

    if (form.id && form.id !== 0) {
      await api.put(`/assets/${form.id}`, form);
    } else {
      await api.post("/assets", { ...form, id: 0 });
    }
    setOpen(false);
    setForm(empty);
    load();
  };

  const del = async (id) => {
    await api.delete(`/assets/${id}`);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>Assets</Typography>
          <Typography sx={{ color: "text.secondary" }}>CRUD de activos y valoración CIA</Typography>
        </Box>
        <Button variant="contained" onClick={() => { setForm(empty); setOpen(true); }}>
          + Nuevo Asset
        </Button>
      </Box>

      <Card sx={{ border: "1px solid rgba(15,23,42,0.06)" }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Owner</b></TableCell>
                <TableCell><b>C</b></TableCell>
                <TableCell><b>I</b></TableCell>
                <TableCell><b>A</b></TableCell>
                <TableCell><b>Valor</b></TableCell>
                <TableCell><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(x => (
                <TableRow key={x.id}>
                  <TableCell>{x.id}</TableCell>
                  <TableCell>{x.name}</TableCell>
                  <TableCell>{x.owner}</TableCell>
                  <TableCell>{x.confidentiality}</TableCell>
                  <TableCell>{x.integrity}</TableCell>
                  <TableCell>{x.availability}</TableCell>
                  <TableCell>{x.assetValue}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => { setForm(x); setOpen(true); }}>
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
                <TableRow><TableCell colSpan={8}>No hay assets aún.</TableCell></TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Editar Asset" : "Nuevo Asset"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField label="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Owner" value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} />
          <TextField label="Confidentiality (1-5)" type="number" value={form.confidentiality}
            onChange={e => setForm({ ...form, confidentiality: Number(e.target.value) })} />
          <TextField label="Integrity (1-5)" type="number" value={form.integrity}
            onChange={e => setForm({ ...form, integrity: Number(e.target.value) })} />
          <TextField label="Availability (1-5)" type="number" value={form.availability}
            onChange={e => setForm({ ...form, availability: Number(e.target.value) })} />
          <TextField label="Asset Value (1-5)" type="number" value={form.assetValue}
            onChange={e => setForm({ ...form, assetValue: Number(e.target.value) })} />
          <TextField label="Descripción" value={form.description ?? ""} multiline minRows={2}
            onChange={e => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={save}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
