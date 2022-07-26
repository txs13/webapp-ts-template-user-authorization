import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  ButtonGroup,
  Button,
  Card,
  Link,
} from "@mui/material";

import { LocalizedTextResources } from "../../../res/textResourcesFunction";
import getTextResources from "../../../res/textResourcesFunction";
import { RootState } from "../../../app/store";
import { OpenRoleUserListStatus } from "./AdminPanelRoleListFragment";
import styles from "../../styles/adminPanelStyles/adminPanelRoleUserListDialogStyles";

export interface AdminPanelRoleUserListDialogPropsTypes {
  openStatus: OpenRoleUserListStatus;
  closeDialog: Function;
}

interface UserItem {
  id: string;
  fullName: string;
  email: string;
}

const AdminPanelRoleUserListDialog: React.FunctionComponent<
  AdminPanelRoleUserListDialogPropsTypes
> = ({ openStatus, closeDialog }) => {
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

  // keep and process user list
  const [userList, setUserList] = useState<UserItem[]>([]);
  // user list to contain this max number of records
  const listLength = 7;
  useMemo(() => {
    if (openStatus.roleUsers) {
      if (openStatus.roleUsers.length === 0) {
        setUserList([
          {
            fullName: `${textResources.noRoleUsersRecordText}`,
            email: textResources.emailRecordForNoUser,
            id: "no_users_id",
          },
        ]);
      } else {
        let userListLocal: UserItem[] = [];
        for (
          let i = 0;
          i < openStatus.roleUsers.length && i < listLength;
          i++
        ) {
          if (
            i < listLength - 1 ||
            openStatus.roleUsers.length === listLength
          ) {
            userListLocal.push({
              id: `${openStatus.roleUsers[i]._id}`,
              fullName: openStatus.roleUsers[i].familyname
                ? `${openStatus.roleUsers[i].name} ${openStatus.roleUsers[i].familyname}`
                : openStatus.roleUsers[i].name,
              email: openStatus.roleUsers[i].email,
            });
          } else {
            userListLocal.push({
              id: "last_row_id",
              fullName: textResources.anotherNumberOfUsersBeginning,
              email: `${openStatus.roleUsers.length - listLength + 1} ${
                textResources.anotherNumberOfUsersEnding
              }`,
            });
          }
        }
        setUserList(userListLocal);
      }
    }
  }, [openStatus, textResources]);

  // click handlers
  const closeClickHandler = () => {
    closeDialog();
  };

  return (
    <Dialog open={openStatus.open}>
      <DialogTitle>
        <Typography>
          {`${textResources.roleUsersListHeader} "${openStatus.currentRole?.role}"`}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {userList.map((userItem) => (
          <Card key={userItem.id} sx={styles.userCard}>
            <Typography noWrap variant="subtitle1" sx={styles.fullNameText}>
              {userItem.fullName}
            </Typography>
            {userItem.id === "last_row_id" || userItem.id === "no_users_id" ? (
              <Typography variant="subtitle2" sx={styles.emailText}>
                {userItem.email}
              </Typography>
            ) : (
              <Link
                href={`mailto:${userItem.email}`}
                variant="subtitle2"
                sx={styles.emailText}
              >
                {userItem.email}
              </Link>
            )}
          </Card>
        ))}
      </DialogContent>
      <DialogActions>
        <ButtonGroup>
          <Button onClick={closeClickHandler}>
            {textResources.roleUsersListCloseBtnLabel}
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

export default AdminPanelRoleUserListDialog;
