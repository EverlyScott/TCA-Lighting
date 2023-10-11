"use client";

import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type { Set } from "../../src/types";
import { useRouter } from "next/navigation";

interface IProps {
  sets: Set[];
}

const SetsList: React.FC<IProps> = ({ sets }) => {
  return (
    <List>
      {sets.map((set) => {
        return <SetsListItem set={set} key={set.id} />;
      })}
    </List>
  );
};

interface ISetItemProps {
  set: Set;
}

const SetsListItem: React.FC<ISetItemProps> = ({ set }) => {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(`/set/${set.id}`);
  };

  const handleClick = () => {
    router.push(`/set/${set.id}`);
  };

  return (
    <ListItem onMouseEnter={handleMouseEnter} onClick={handleClick} disablePadding>
      <ListItemButton>
        <ListItemIcon>{set.order + 1}.</ListItemIcon>
        <ListItemText>{set.name}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default SetsList;
