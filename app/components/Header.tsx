import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { removeFromLocalStorage } from "../Context/Actions";
import { localVariable, userRolesOptions } from "@/data";
import { AuthContext } from "../Context/AuthContext";
import Link from "next/link";
import { Add, List, Logout, Person } from "@mui/icons-material";
import UserCreateForm from "./UserCreateForm";

function Header() {
  const authContext = useContext(AuthContext);
  const [showUserModal, setShowUserModal] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    window.location.replace("/");
    removeFromLocalStorage(localVariable.accessToken);
    removeFromLocalStorage(localVariable.user);
    setTimeout(() => {
      authContext.setUser(null);
      authContext.setAccessToken(null);
    }, 1000);
  };
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              PGL
            </Typography>

            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            ></Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar src="assets/user.png" alt="PGL" />
                  {/* <img src="assets/user.png" alt="PGL" /> */}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  {authContext?.user?.name} ({authContext.user?.role})
                </MenuItem>
                <MenuItem>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "#000",
                    }}
                    href="/profile"
                  >
                    <Person /> Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "#000",
                    }}
                    href="/user"
                  >
                    <List style={{ color: "blue" }} /> Users List
                  </Link>
                </MenuItem>
                {authContext?.user?.role === userRolesOptions[0] && (
                  <MenuItem
                    onClick={() => {
                      setShowUserModal(true);
                      setAnchorElUser(null);
                    }}
                  >
                    <Add style={{ color: "green" }} /> Create User
                  </MenuItem>
                )}
                <hr style={{ margin: 0 }} />
                <MenuItem onClick={() => logout()}>
                  <Logout style={{ color: "red" }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {showUserModal && <UserCreateForm setShowUserModal={setShowUserModal} />}
    </>
  );
}
export default Header;
