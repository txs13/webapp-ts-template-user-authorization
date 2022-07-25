import React, { useEffect, useState } from "react";
import { Grid, Card, ButtonGroup, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import styles from "../../styles/adminPanelStyles/adminPanelRoleCardStyles";
import { RoleItem } from "./AdminPanelRoleListFragment";
import { deleteRoleService } from "../../../app/services/roleServices";

interface RoleCardPropsTypes {
  roleItem: RoleItem;
  dataUpdate: Function;
  openRoleDetails: Function;
  openConfirmationDialog: Function;
  openRoleUsersList: Function;
}

const AdminPanelRoleCard: React.FunctionComponent<RoleCardPropsTypes> = ({
  roleItem,
  dataUpdate,
  openRoleDetails,
  openConfirmationDialog,
  openRoleUsersList,
}) => {
  // get data from app settings store and get text resources in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResources, setTextResources] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResources(getTextResources(appSettings.language));
  }, [appSettings]);

  //extended form visibility
  const [extended, setExtended] = useState(false);
  const onCardClickHandler = (e: React.MouseEvent<HTMLElement>) => {
    const { name } = e.target as HTMLButtonElement;
    if (!name) {
      setExtended(!extended);
    }
  };

  // click handlers
  const deleteRoleClickHandler = async () => {
    openConfirmationDialog(
      `${textResources.deleteRoleCardMessage} ${roleItem.role}`,
      () => deleteRoleApiServiceCall()
    );
  };

  const openRoleDetailsClickHandler = () => {
    openRoleDetails(roleItem._id);
  };

  const openRoleListClickHandler = () => {
    openRoleUsersList(roleItem._id);
  };

  // api service call functions
  const deleteRoleApiServiceCall = async () => {
    await deleteRoleService(roleItem._id);
  };

  return (
    <Card onClick={onCardClickHandler} sx={styles.cardFrame}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResources.roleNameCardlabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography fontWeight={600}>{roleItem.role}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResources.roleDescriptionCardlabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{roleItem.description}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResources.usersNumberWithRolelabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{roleItem.usersNumber}</Typography>
        </Grid>
      </Grid>
      {extended ? (
        <Grid item xs={12}>
          <ButtonGroup sx={styles.btnBox} variant="text">
            <Typography sx={styles.isPublic}>
              {roleItem.isPublic
                ? textResources.roleIsPubliclabel
                : textResources.roleIsNotPubliclabel}
            </Typography>
            <Button
              name="delete"
              variant="contained"
              color="error"
              size="small"
              sx={styles.btn}
              disabled={roleItem.usersNumber === 0 ? false : true}
              onClick={() => deleteRoleClickHandler()}
            >
              {textResources.deleteBtnLabel}
            </Button>
            <Button
              name="details"
              variant="contained"
              color="info"
              size="small"
              sx={styles.btn}
              onClick={() => openRoleDetailsClickHandler()}
            >
              {textResources.editBtnLabel}
            </Button>
            <Button
              name="users"
              variant="contained"
              color="info"
              size="small"
              sx={styles.btn}
              onClick={() => openRoleListClickHandler()}
            >
              {textResources.usersListCardlabel}
            </Button>
          </ButtonGroup>
        </Grid>
      ) : null}
    </Card>
  );
};

export default AdminPanelRoleCard;
