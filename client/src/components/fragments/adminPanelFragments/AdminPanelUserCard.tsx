import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Typography, Grid, ButtonGroup, Button } from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { UserItem } from "./AdminPanelUserListFragment";
import styles from "../../styles/adminPanelStyles/adminPanelUserCardStyles";

interface UserCardPropsTypes {
  user: UserItem;
  dataUpdate: Function;
  openUserDetails: Function;
  openConfirmationDialog: Function;
  confirmUserServiceCall: Function;
  deleteUserServiceCall: Function;
}

const AdminPanelUserCard: React.FunctionComponent<UserCardPropsTypes> = ({
  user,
  dataUpdate,
  openUserDetails,
  openConfirmationDialog,
  confirmUserServiceCall,
  deleteUserServiceCall,
}) => {
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

  // call confirmation dialog for the user confirmation buttton
  const confirmClickHandler = () => {
    openConfirmationDialog(
      `${textResourses.confirmUserCardMessage}: ${user.email}`,
      () => confirmUserServiceCall(user._id)
    );
  };

  // call confirmation dialog for the user deletion button
  const deleteUserClickHandler = () => {
    openConfirmationDialog(
      `${textResourses.deleteUserCardMessage}: ${user.email}`,
      () => deleteUserServiceCall(user._id)
    );
  };

  return (
    <Card onClick={onCardClickHandler} sx={styles.cardFrame}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.userNameLabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography fontWeight={600}>
            {user.familyname
              ? `${user.name} ${user.familyname}`
              : `${user.name}`}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.userEmailLabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{user.email}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.userCompanyLabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{user.company}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            sx={styles.labelText}
          >{`${textResourses.userPortalRoleLabel}:`}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography>{user.userrole}</Typography>
        </Grid>
        {extended ? (
          <Grid item xs={12}>
            <ButtonGroup sx={styles.btnBox} variant="text">
              <Typography sx={styles.isConfirmed}>
                {user.isConfirmed
                  ? textResourses.userYStatusLabel
                  : textResourses.userNStatusLabel}
              </Typography>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={styles.btn}
                onClick={() => deleteUserClickHandler()}
              >
                {textResourses.deleteBtnLabel}
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                sx={styles.btn}
                onClick={() => openUserDetails(user._id)}
              >
                {textResourses.editBtnLabel}
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={styles.btn}
                onClick={() => confirmClickHandler()}
              >
                {textResourses.confirmBtnLabel}
              </Button>
            </ButtonGroup>
          </Grid>
        ) : null}
      </Grid>
    </Card>
  );
};

export default AdminPanelUserCard;
