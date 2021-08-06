import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from 'src/routes/components/DrawerContent';
import HomeStackTab from 'src/routes/HomeStackTab/HomeStackTab';
import DeletedItemsStack from 'src/routes/DeletedItemsStack/DeletedItemsStack';
import PincodeStack from 'src/routes/PincodeStack/PincodeStack';

const Drawer = createDrawerNavigator();
export default function MainNavigator() {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName="Home"
				drawerContent={(props) => <DrawerContent {...props} />}
			>
				<Drawer.Screen name="Home" component={HomeStackTab} />
				<Drawer.Screen name="Deleted Items" component={DeletedItemsStack} />
				<Drawer.Screen name="Pincode" component={PincodeStack} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}
