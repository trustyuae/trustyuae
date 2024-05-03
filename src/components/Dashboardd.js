import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import IconButton from "@mui/material/IconButton";
// import Badge from "@mui/material/Badge";
// import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Paper from "@mui/material/Paper";
// import Link from "@mui/material/Link";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import { InputAdornment, TextField } from "@mui/material";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import AppsIcon from "@mui/icons-material/Apps";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logoutUser, userLogout } from "../redux/actions/UserActions";
import { logoutURL } from "../utils/constants";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ListSubheader from "@mui/material/ListSubheader";
// import List from '@mui/material/List';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogOut = async () => {
    try {
      await axios.post(`${logoutURL}`, null, {
        headers: {
          "Content-type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });
      dispatch(userLogout(navigate));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="absolute"
          open={open}
          style={{ width: "100%", backgroundColor: "#f6f1eb" }}
        >
          <Toolbar
            sx={{
              pr: "24px",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <img
                src={require("../assets/logo-large-main.webp")}
                alt="Logo"
                style={{ height: "40px", marginRight: "8px" }}
              />
            </Box>
            <TextField
              id="standard-basic"
              placeholder="Search"
              sx={{
                border: "none",
                "& .MuiInputBase-root": {
                  borderColor: "#fff",
                  height: "40px",
                  borderRadius: "20px",
                  "&:hover": {
                    borderColor: "#fff",
                  },
                },
              }}
              InputProps={{
                type: "search",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 10"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                        />
                      </svg>
                    </SearchIcon>
                  </InputAdornment>
                ),
              }}
              className="inputt"
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <IconButton color="inherit">
                <Badge
                  badgeContent={4}
                  color="secondary"
                  sx={{ color: "black" }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ color: "black" }}>
                <LightModeIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ color: "black" }}>
                <AppsIcon />
              </IconButton> */}
              <Box
                sx={{
                  height: "50px",
                  width: "50px",
                }}
              >
                <Dropdown>
                  <Dropdown.Toggle
                    className="bg-transparent border-0 p-0"
                    split
                    variant="success"
                  >
                    <img
                      //   src={require("../assets/logo-large-main.webp")}
                      src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      alt="Logo"
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0">
                    <Dropdown.Item onClick={handleLogOut}>
                      <LogoutIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 10"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                          />
                        </svg>
                      </LogoutIcon>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          style={{ marginTop: "64px", backgroundColor: "#f6f1eb" }}
        >
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: "column", // Set flex direction to column
              alignItems: "flex-start", // Align items to start
              justifyContent: "flex-start", // Justify content to start
              px: [1],
              backgroundColor: "#f6f1eb",
              height: "100%",
            }}
          >
            <List component="nav" sx={{ justifyContent: "space-between",width:'100%',textWrap:'wrap' }}>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="P1 System"/>
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon> 
                    <ListItemText primary="ordersystem"  onClick={() => handleLinkClick("/ordersystem")}/>
                  </ListItemButton>
                </List>
              </Collapse>
              <ListItemButton>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="P2 System"/>
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText
                      primary="Order Management System"
                      onClick={() =>
                        handleLinkClick("/order_management_system")
                      }
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText
                      primary="PO management System"
                      sx={{textWrap:'wrap'}}  
                      onClick={() => handleLinkClick("/PO_ManagementSystem")}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText
                      primary="PO details"
                      onClick={() => handleLinkClick("/PO_details")}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText
                      primary="Order Not Available"
                      onClick={() => handleLinkClick("/order_not_available")}
                    />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="P3 System" />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="All factory"
                      onClick={() => handleLinkClick("/all_factory")}
                    />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="All Products"
                      onClick={() => handleLinkClick("/all_products_list")}
                    />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <SendIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Factory Form"
                      onClick={() => handleLinkClick("/factory_form")}
                    />
                  </ListItemButton>
                  <ListItemButton>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Order Details"
                      onClick={() => handleLinkClick("/order_details")}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Toolbar>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        ></Box>
      </Box>
    </ThemeProvider>
  );
}
