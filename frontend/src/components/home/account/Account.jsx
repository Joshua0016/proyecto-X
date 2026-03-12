import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

export default function MenuPopupState() {
    const navigate = useNavigate();
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <React.Fragment>
                    <Button variant="contained" {...bindTrigger(popupState)}>
                        <PersonIcon></PersonIcon>
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={popupState.close}>Profile</MenuItem>
                        <MenuItem onClick={popupState.close}>My account</MenuItem>
                        <MenuItem onClick={() => {
                            popupState.close;
                            localStorage.removeItem("token");
                            navigate("/")
                        }}>Logout</MenuItem>
                    </Menu>
                </React.Fragment>
            )}
        </PopupState>
    );
}