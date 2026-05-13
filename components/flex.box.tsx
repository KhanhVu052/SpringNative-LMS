import { StyleSheet, View, Text } from 'react-native'

const FlexBox = () => {
  return (
    <View style={styles.container}>
        <View style={styles.item1}><Text>item 1</Text></View>
        <View style={styles.item2}><Text>item 2</Text></View>
        <View style={styles.item3}><Text>item 3</Text></View>
        <View style={styles.item4}><Text>item 4</Text></View>
    </View> 
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    item1: {
        backgroundColor: 'violet',
    },
    item2: {
        backgroundColor: 'indigo',
    },
    item3: {
        backgroundColor: 'blue',
    },
    item4: {
        backgroundColor: 'green',
    },
});
export default FlexBox;