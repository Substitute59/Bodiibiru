import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { createAppContainer, SafeAreaView } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Divider, Drawer, Title } from "react-native-paper";
import Home from '../pages/home';
import Program from '../pages/program';
import Archives from '../pages/archives';
import Workouts from '../pages/workouts';
import Max from '../pages/max';
import Exercices from '../pages/exercices';
import Options from '../pages/options';

const Menu = createDrawerNavigator(
  {
    Home: { screen: Home },
    Program: { screen: Program },
    Archives: { screen: Archives },
    Workouts: { screen: Workouts },
    Max: { screen: Max },
    Exercices: { screen: Exercices },
    Options: { screen: Options }
  },
  {
    contentComponent: props => (
      <ScrollView>
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <Title
            style={styles.title}
            onPress={() => props.navigation.navigate("Home")}
          >Bodiibiru</Title>
          <Divider style={styles.divider} />
          <Drawer.Item
            label="Historique"
            onPress={() => props.navigation.navigate("Archives")} />
          <Drawer.Item
            label="Max (1RM)"
            onPress={() => props.navigation.navigate("Max")} />
          <Drawer.Item
            label="Exercices"
            onPress={() => props.navigation.navigate("Exercices")} />
          <Drawer.Item
            label="Options"
            onPress={() => props.navigation.navigate("Options")} />
        </SafeAreaView>
      </ScrollView>
    )
  }
);

const styles = StyleSheet.create({
  title: {
    paddingVertical: 10,
    paddingHorizontal: 18
  },

  divider: {
    marginBottom: 10
  }
});

const AppNav = createAppContainer(Menu);

export default AppNav;