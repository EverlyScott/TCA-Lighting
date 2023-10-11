"use client";

import { Button, Divider } from "@mui/material";
import type { Set } from "../../src/types";

interface IProps {
  currentSet: Set;
  sets: Set[];
}

const CurrentSetControls: React.FC<IProps> = ({ currentSet, sets }) => {
  const handlePrevious = () => {};

  const handleNext = () => {};

  return (
    <div style={{ display: "flex" }}>
      <Button variant="contained" onClick={handlePrevious} sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
        Previous
      </Button>
      <Divider orientation="vertical" sx={{ margin: 0 }} />
      <Button variant="contained" onClick={handleNext} sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
        Next
      </Button>
    </div>
  );
};

export default CurrentSetControls;
