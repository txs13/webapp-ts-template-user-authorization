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
  const [textResources, setTextResources] = useState<LocalizedTextResources>(
    {}
  );
  useEffect(() => {
    setTextResources(getTextResources(appSettings.language));
  }, [appSettings]);

  // the intention is diagrams size to fit grid width
  // due to the thing that rechart object requires exact width value,
  // it is needed to calculate it "manually"
  // charts ref variables in order to handle box sizes
  const rolesPieChartBox = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState<number>(300);
  // function which changes chart box size depending on the grid cell size
  const updateDimensions = () => {
    if (rolesPieChartBox) {
      setChartSize(
        Math.floor((rolesPieChartBox.current?.clientWidth || 300) * 0.9)
      );
    }
  };
  // rendering the form for the first time, listener is added in order
  // to update the chart size depending on the grid item size
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    setChartSize(
      Math.floor((rolesPieChartBox.current?.clientWidth || 300) * 0.9)
    );
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);


  return (
    <Box sx={styles.fragmentFrame}>
      <Container maxWidth="lg" sx={styles.container}>
        <Typography sx={styles.textParagraph}>
          {textResources.aboutRolesDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResources.aboutAdminsDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResources.aboutUsersDesc}
        </Typography>
        <Typography sx={styles.textParagraph}>
          {textResources.aboutAdminPanelStatistics}
        </Typography>
        <Grid
          container
          spacing={1}
          sx={styles.gridFrame}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
        >
          <Grid xs={12} sm={8} md={6} lg={4} item sx={styles.gridItem}>
            <Box sx={styles.chartBox} ref={rolesPieChartBox}>
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
                  outerRadius={Math.floor(chartSize * 0.4)}
                  innerRadius={Math.floor(chartSize * 0.25)}
                  fill="#8884d8"
                />
              </PieChart>
            </Box>
          </Grid>
          <Grid xs={12} sm={8} md={6} lg={4} item sx={styles.gridItem}>
            <Box sx={styles.chartBox}>
              <AreaChart width={chartSize} height={chartSize}></AreaChart>
            </Box>
          </Grid>
          <Grid xs={12} sm={8} md={6} lg={4} item sx={styles.gridItem}>
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
