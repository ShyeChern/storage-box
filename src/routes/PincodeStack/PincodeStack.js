import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChangePincode from 'src/views/Pincode/ChangePincode';
import DrawerToggle from 'src/routes/components/DrawerToggle';

const Stack = createStackNavigator();

export default function PincodeStack({ navigation }) {
	return (
		<Stack.Navigator initialRouteName={'Pincode'}>
			<Stack.Screen
				name="Pincode"
				component={ChangePincode}
				options={{
					headerLeft: (props) => <DrawerToggle props={props} navigation={navigation} />,
				}}
			/>
		</Stack.Navigator>
	);
}
