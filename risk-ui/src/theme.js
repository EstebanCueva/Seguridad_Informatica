import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F5F7FB", paper: "#FFFFFF" },
    primary: { main: "#3B82F6" },
    text: { primary: "#0F172A", secondary: "#64748B" },
  },
  shape: { borderRadius: 14 },
  typography: { fontFamily: ["Inter", "Segoe UI", "Arial"].join(",") },
});
