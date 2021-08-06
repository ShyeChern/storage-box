import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DeletedItems from 'src/views/DeletedItems/DeletedItems';
import DrawerToggle from 'src/routes/components/DrawerToggle';

const Stack = createStackNavigator();

export default function DeletedItemsStack({ navigation }) {
	return (
		<Stack.Navigator initialRouteName={'Deleted Items'}>
			<Stack.Screen
				name="Deleted Items"
				component={DeletedItems}
				options={{
					headerLeft: (props) => <DrawerToggle props={props} navigation={navigation} />,
				}}
			/>
		</Stack.Navigator>
	);
}
