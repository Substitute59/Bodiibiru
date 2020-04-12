import React from 'react';
import { DrawerActions } from "react-navigation-drawer";
import { Appbar } from 'react-native-paper';

export default function Header(props) {
  return (
    <Appbar.Header>
      <Appbar.Action
        icon="menu"
        onPress={() =>
          props.navigation.dispatch(DrawerActions.toggleDrawer())
        }
      />
      <Appbar.Content title={props.title} />
    </Appbar.Header>
  );
}
