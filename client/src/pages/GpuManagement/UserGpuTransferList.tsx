import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { GpuModel } from "../../features/gpu";
import { getFakeGpuNameAndModelFromID } from "../GpuMonitoring/GpuMonitoring";
import { Stack } from "@mui/material";

function not(a: readonly GpuModel[], b: readonly GpuModel[]) {
  return a.filter(
    (valueA) => b.findIndex((valueB) => valueA.id === valueB.id) === -1
  );
}

function intersection(a: readonly GpuModel[], b: readonly GpuModel[]) {
  return a.filter(
    (valueA) => b.findIndex((valueB) => valueA.id === valueB.id) !== -1
  );
}

function union(a: readonly GpuModel[], b: readonly GpuModel[]) {
  return [...a, ...not(b, a)];
}

interface UserGpuTransferListProps {
  initLeft: GpuModel[];
  initRight: GpuModel[];
  onConfirm?: (left: GpuModel[], right: GpuModel[]) => void;
}

export default function UserGpuTransferList(props: UserGpuTransferListProps) {
  const { initLeft, initRight, onConfirm = () => {} } = props;

  const [checked, setChecked] = React.useState<readonly GpuModel[]>([]);
  const [left, setLeft] = React.useState<readonly GpuModel[]>([]);
  const [right, setRight] = React.useState<readonly GpuModel[]>([]);

  React.useEffect(() => {
    setLeft([...initLeft]);
    setRight([...initRight]);
  }, [initLeft, initRight]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: GpuModel) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly GpuModel[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly GpuModel[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: readonly GpuModel[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: "24rem",
          height: "30rem",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: GpuModel) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value.id}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${getFakeGpuNameAndModelFromID(value.id).name}`}
                secondary={`${value.host}:${value.port}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
      <Grid
        container
        spacing={"1.6rem"}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>{customList("Permission Granted", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("Permission Denied", right)}</Grid>
      </Grid>
      <Stack width={"100%"} alignItems={"center"}>
        <Stack
          marginTop={"3.2rem"}
          direction={"row"}
          width={"24rem"}
          justifyContent={"space-between"}
        >
          <Button variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            onClick={() => onConfirm([...left], [...right])}
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
