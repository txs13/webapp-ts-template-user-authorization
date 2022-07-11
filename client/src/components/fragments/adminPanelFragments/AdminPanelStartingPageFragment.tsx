import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Container, Grid } from "@mui/material";
import { PieChart, AreaChart, Pie, PieLabel } from "recharts";

import styles from "../../styles/adminPanelStyles/adminPanelStartingPageStyles";
import {
  RoleDocument,
  UserDocument,
} from "../../../interfaces/inputInterfaces";

import { RootState } from "../../../app/store";
import getTextResources from "../../../res/textResourcesFunction";
import { LocalizedTextResources } from "../../../res/textResourcesFunction";

interface AdminPanelStartingPageFragmentPropsTypes {
  users: UserDocument[] | undefined;
  roles: RoleDocument[] | undefined;
  dataUpdate: Function;
}

const AdminPanelStartingPageFragment: React.FunctionComponent<
  AdminPanelStartingPageFragmentPropsTypes
> = ({ users, roles, dataUpdate }) => {
  // get data from app settings store and get text resources in proper language
  const appSettings = useSelector(
    (state: RootState) => state.appSettings.value
  );
  const [textResourses, setTextResourses] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResourses(getTextResources(appSettings.language));
  }, [appSettings]);

  // charts ref variables in order to handle box sizes
  const rolesPieChartBox = useRef<HTMLElement>();
  const [chartSize, setChartSize] = useState<number>(300);
  useEffect(() => {
    console.log(rolesPieChartBox);
    setChartSize(Math.floor(rolesPieChartBox.current?.offsetWidth || 300 * 0.9))
  }, [rolesPieChartBox]);

  return (
    <Box sx={styles.fragmentFrame}>
      <Container maxWidth="lg" sx={styles.container}>
        <Typography sx={styles.textParagraph}>
          {textResourses.aboutRolesDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResourses.aboutAdminsDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResourses.aboutUsersDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResourses.aboutAdminPanelStatistics}
        </Typography>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={1}
          alignItems="center"
          columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
        >
          <Grid item sx={styles.gridItem}>
            <Box
              sx={{ ...styles.chartBox, width: chartSize, height: chartSize }}
              ref={rolesPieChartBox}
            >
              <PieChart width={chartSize} height={chartSize}>
                <Pie
                  data={[
                    { name: "Group A", value: 400 },
                    { name: "Group B", value: 300 },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                />
              </PieChart>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={styles.chartBox}>
              <AreaChart width={chartSize} height={chartSize}></AreaChart>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={styles.chartBox}>
              <AreaChart width={chartSize} height={chartSize}></AreaChart>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminPanelStartingPageFragment;
