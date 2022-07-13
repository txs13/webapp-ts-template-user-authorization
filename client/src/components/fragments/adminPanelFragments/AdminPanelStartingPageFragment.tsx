import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Container, Grid } from "@mui/material";
import {
  PieChart,
  AreaChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  BarChart,
  Bar,
} from "recharts";

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

interface RenderCustomizedPieLabelPropsTypes {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  payload: any;
}

interface RoleStats {
  roleName: string;
  usersNumber: number;
}

interface RegistrationStats {
  timeFrame: string;
  usersNumber: number;
  frameMidDate: string;
  frameStart: Date;
  frameEnd: Date;
}

interface ConfirmedUserStats {
  name: string;
  usersNumber: number;
}

const RADIAN = Math.PI / 180;
const PIE_COLORS = [
  "#C0392B",
  "#2980B9",
  "#27AE60",
  "#F1C40F",
  "#95A5A6",
  "#9B59B6",
  "#E67E22",
];

const BAR_COLORS = ["#27AE60", "#CD6155"];

// TODO: extract to utils, test separately
const shortenDateRange = (minDate: Date, maxDate: Date): string => {
  const minDay = minDate.getDate();
  const minMonth = minDate.getMonth() + 1;
  const minYear = minDate.getFullYear();
  const maxDay = maxDate.getDate();
  const maxMonth = maxDate.getMonth() + 1;
  const maxYear = maxDate.getFullYear();

  if (minYear === maxYear) {
    if (minMonth === maxMonth) {
      if (minDay === maxDay) {
        return minDay + "/" + minMonth + "/" + minYear;
      } else {
        return minDay + "-" + maxDay + "/" + maxMonth + "/" + maxYear;
      }
    } else {
      return (
        minDay + "/" + minMonth + "-" + maxDay + "/" + maxMonth + "/" + maxYear
      );
    }
  } else {
    return (
      minDay +
      "/" +
      minMonth +
      "/" +
      minYear +
      "-" +
      maxDay +
      "/" +
      maxMonth +
      "/" +
      maxYear
    );
  }
};

const AdminPanelStartingPageFragment: React.FunctionComponent<
  AdminPanelStartingPageFragmentPropsTypes
> = ({ users, roles, dataUpdate }) => {
  // object for role chart labels rendering
  const renderPieCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
  }: RenderCustomizedPieLabelPropsTypes) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <>
        <text
          x={x}
          y={y - 7}
          fill="black"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize="14"
        >
          {`${payload.roleName}`}
        </text>
        <text
          x={x}
          y={y + 7}
          fill="black"
          fontSize="12"
          dominantBaseline="central"
          textAnchor="middle"
        >
          {`${payload.usersNumber} ${textResources.usersRoleStatsChartLabel}`}
        </text>
      </>
    );
  };

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
      Math.floor((rolesPieChartBox.current?.clientWidth || 300) * 0.95)
    );
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // role stats pie chart data
  const [rolesStats, setRolesStats] = useState<RoleStats[]>([]);
  useMemo(() => {
    if (users && roles) {
      let rolesStatsLocal: RoleStats[] = [];
      roles.forEach((role) => {
        rolesStatsLocal.push({
          roleName: role.role,
          usersNumber: users.filter((user) => user.userrole_id === role._id)
            .length,
        });
      });
      setRolesStats(rolesStatsLocal);
    }
  }, [users, roles]);

  // registration stats chart data
  const [registrationStats, setRegistrationStats] = useState<
    RegistrationStats[]
  >([]);
  useMemo(() => {
    if (users && roles) {
      const discretion = 10;
      let registrationStatsLocal: RegistrationStats[] = [];
      let minDate: Date = new Date(users[0].createdAt.toString());
      // if I decide to come back to the time frame up to the latest actual date of the
      // user registration, I will come back to the commented code
      //let maxDate: Date = new Date(users[0].createdAt.toString());
      let maxDate: Date = new Date();
      for (let i = 0; i < users.length; i++) {
        let userDate: Date = new Date(users[i].createdAt.toString());
        if (userDate.getTime() < minDate.getTime()) {
          minDate = userDate;
        }
        //if (userDate.getTime() > maxDate.getTime()) {
        //  maxDate = userDate;
        //}
      }
      const frameLength = Math.floor(
        (maxDate.getTime() - minDate.getTime()) / discretion
      );
      for (let i = 0; i < discretion; i++) {
        let minFrameDateNum: number = minDate.getTime() + i * frameLength;
        let maxFrameDateNum: number = minDate.getTime() + (i + 1) * frameLength;
        //let midFrameDateNum: number =
        //  minDate.getTime() + i * frameLength + frameLength / 2;
        registrationStatsLocal.push({
          timeFrame: `timeframe ${i + 1}`,
          usersNumber: users.filter(
            (user) =>
              new Date(user.createdAt.toString()).getTime() >=
                minFrameDateNum &&
              new Date(user.createdAt.toString()).getTime() < maxFrameDateNum
          ).length,
          frameStart: new Date(minFrameDateNum),
          frameEnd: i === discretion - 1 ? maxDate : new Date(maxFrameDateNum),
          frameMidDate: shortenDateRange(new Date(minFrameDateNum), new Date(maxFrameDateNum))
        });
      }
      setRegistrationStats(registrationStatsLocal);
    }
  }, [users, roles]);

  // confirmation stats chart data
  const [confirmedStats, setConfirmedStats] = useState<ConfirmedUserStats[]>(
    []
  );
  useMemo(() => {
    if (users && textResources) {
      let confirmedStatsLocal: ConfirmedUserStats[] = [];
      confirmedStatsLocal.push({
        name: textResources.confirmedUsersChartLabel,
        usersNumber: users.filter((it) => it.isConfirmed).length,
      });
      confirmedStatsLocal.push({
        name: textResources.notConfirmedUsersChartLabel,
        usersNumber: users.filter((it) => !it.isConfirmed).length,
      });
      setConfirmedStats(confirmedStatsLocal);
    }
  }, [users, textResources]);

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
          <Grid xs={12} sm={8} md={6} lg={4} xl={4} item sx={styles.gridItem}>
            <Box sx={styles.chartBox}>
              <BarChart
                width={chartSize}
                height={chartSize}
                data={confirmedStats}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="usersNumber" />
                <Tooltip />
                <Bar dataKey="usersNumber" fill="#27AE60">
                  {confirmedStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index]} />
                  ))}
                </Bar>
                <text
                  x={chartSize / 2}
                  y={chartSize - 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="700"
                  fontSize="18"
                >
                  {textResources.confirmedUsersChartHeader}
                </text>
              </BarChart>
            </Box>
          </Grid>
          <Grid xs={12} sm={8} md={6} lg={4} xl={4} item sx={styles.gridItem}>
            <Box sx={styles.chartBox} ref={rolesPieChartBox}>
              <PieChart width={chartSize} height={chartSize}>
                <Pie
                  data={rolesStats}
                  dataKey="usersNumber"
                  nameKey="roleName"
                  color="color"
                  cx="50%"
                  cy="50%"
                  outerRadius={Math.floor(chartSize * 0.3)}
                  innerRadius={Math.floor(chartSize * 0.2)}
                  fill="#8884d8"
                  label={renderPieCustomizedLabel}
                >
                  {rolesStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <text
                  x={chartSize / 2}
                  y={chartSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="700"
                  fontSize="18"
                >
                  {textResources.roleStatsChartHeader}
                </text>
              </PieChart>
            </Box>
          </Grid>
          <Grid xs={12} sm={8} md={6} lg={4} xl={4} item sx={styles.gridItem}>
            <Box sx={styles.chartBox}>
              <AreaChart
                width={chartSize}
                height={chartSize}
                data={registrationStats}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 40,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="frameMidDate" />
                <YAxis dataKey="usersNumber" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usersNumber"
                  stroke="#063970"
                  fill="#2596be"
                />
                <text
                  x={chartSize / 2}
                  y={chartSize - 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontWeight="700"
                  fontSize="18"
                >
                  {textResources.registrationStatsChartHeader}
                </text>
              </AreaChart>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminPanelStartingPageFragment;
