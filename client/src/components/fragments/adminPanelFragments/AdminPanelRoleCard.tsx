import React, { useEffect, useState } from "react";
import { Grid, Card, ButtonGroup, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import styles from "../../styles/adminPanelStyles/adminPanelRoleCardStyles"
import { RoleItem } from "./AdminPanelRoleListFragment"

interface RoleCardPropsTypes {
    roleItem: RoleItem;
} 

const AdminPanelRoleCard: React.FunctionComponent<RoleCardPropsTypes> = ({roleItem}) => {
  // get data from app settings store and get text resouses in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResourses, setTextResourses] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResourses(getTextResources(appSettings.language));
  }, [appSettings]);

  //extended form visibility
  const [extended, setExtended] = useState(false);
  const onCardClickHandler = () => {
    setExtended(!extended);
  };

  // click handlers
  const deleteRoleClickHandler = (id: string) => {
    // TODO: delete role click handler
  };

  const openRoleDetails = (id: string) => {
    // TODO : open role details handler
  };

  const openRoleList = (id: string) => {
    // TODO : oper user list handler
  };

  return (
    <Card onClick={onCardClickHandler} sx={styles.cardFrame}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.roleNameCardlabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography fontWeight={600}>{roleItem.role}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.roleDescriptionCardlabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{roleItem.description}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.usersNumberWithRolelabel}:`}</Typography>
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
                ? textResourses.roleIsPubliclabel
                : textResourses.roleIsNotPubliclabel}
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={styles.btn}
              onClick={() => deleteRoleClickHandler("role._id")}
            >
              {textResourses.deleteBtnLabel}
            </Button>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={styles.btn}
              onClick={() => openRoleDetails("role._id")}
            >
              {textResourses.editBtnLabel}
            </Button>
            <Button
              variant="contained"
              color="info"
              size="small"
              sx={styles.btn}
              onClick={() => openRoleList("role._id")}
            >
              {textResourses.usersListCardlabel}
            </Button>
          </ButtonGroup>
        </Grid>
      ) : null}
    </Card>
  );
};

export default AdminPanelRoleCard;
