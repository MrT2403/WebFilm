import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import menuConfigs from "../../configs/menu.configs";
import { setUser } from "../../redux/features/userSlice";

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [anchorEL, setAnchorEL] = useState(null);

  const toggleMenu = (e) => {
    setAnchorEL(e.currentTarget);
  };

  return (
    <>
      {user && (
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={toggleMenu}
        >
          <Typography>Hi, {user.username}</Typography>
        </Typography>
      )}
      <Menu
        open={Boolean(anchorEL)}
        anchorEl={anchorEL}
        onClose={() => setAnchorEL(null)}
        PaperProps={{ sx: { padding: 0 } }}
      >
        {menuConfigs.user.map((item, index) => (
          <ListItemButton
            component={Link}
            to={item.path}
            key={index}
            onClick={() => setAnchorEL(null)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography textTransform="uppercase">
                  {item.display}
                </Typography>
              }
            />
          </ListItemButton>
        ))}
        <ListItemButton
          sx={{ borderRadius: "10px" }}
          onClick={() => dispatch(setUser(null))}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon></LogoutOutlinedIcon>
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography textTransform="uppercase">sign out</Typography>
            }
          ></ListItemText>
        </ListItemButton>
      </Menu>
    </>
  );
};

export default UserMenu;
