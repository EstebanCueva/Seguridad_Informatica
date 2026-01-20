import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";

const drawerWidth = 260;

const navItemStyle = ({ isActive }) => ({
  borderRadius: 12,
  margin: "6px 10px",
  background: isActive ? "rgba(59,130,246,0.18)" : "transparent",
  transition: "all .15s ease",
});

export default function AppShell({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#0B1220",
            color: "rgba(255,255,255,0.85)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        {/* Brand */}
        <Box sx={{ p: 2.2, display: "flex", alignItems: "center", gap: 1.2 }}>
          <Avatar sx={{ bgcolor: "#111827" }}>E</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
              Risk MVP
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
              .NET + React
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* Nav */}
        <List sx={{ mt: 1 }}>
          <ListItemButton
            component={NavLink}
            to="/"
            style={navItemStyle}
            sx={{ "&:hover": { background: "rgba(255,255,255,0.06)" } }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/assets"
            style={navItemStyle}
            sx={{ "&:hover": { background: "rgba(255,255,255,0.06)" } }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/risks"
            style={navItemStyle}
            sx={{ "&:hover": { background: "rgba(255,255,255,0.06)" } }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <WarningAmberIcon />
            </ListItemIcon>
            <ListItemText primary="Risks" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/treatments"
            style={navItemStyle}
            sx={{ "&:hover": { background: "rgba(255,255,255,0.06)" } }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <PlaylistAddCheckIcon />
            </ListItemIcon>
            <ListItemText primary="Treatments" />
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/reports"
            style={navItemStyle}
            sx={{ "&:hover": { background: "rgba(255,255,255,0.06)" } }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>
        </List>

        <Box sx={{ flex: 1 }} />

        {/* Bottom */}
        <Box sx={{ p: 2 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              color: "rgba(255,255,255,0.85)",
              "&:hover": { background: "rgba(255,255,255,0.06)" },
            }}
          >
            <ListItemIcon sx={{ color: "rgba(255,255,255,0.8)", minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Content */}
      <Box sx={{ flex: 1, width: "100%" }}>
        {/* Topbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            borderBottom: "1px solid rgba(15,23,42,0.06)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff",
                border: "1px solid rgba(15,23,42,0.06)",
                borderRadius: 999,
                px: 2,
                py: 0.7,
                boxShadow: "0 8px 22px rgba(2,6,23,0.06)",
              }}
            >
              <SearchIcon sx={{ color: "text.secondary" }} />
              <InputBase placeholder="Search..." sx={{ flex: 1 }} />
            </Box>

            <IconButton>
              <SettingsIcon />
            </IconButton>

            <Avatar sx={{ width: 34, height: 34 }}>S</Avatar>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ maxWidth: 1400, mx: "auto", width: "100%" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
