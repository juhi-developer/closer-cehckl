import { Dimensions, Platform } from 'react-native'; // Import Dimensions and Platform

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const styles = {
    container: {
        flex: 1,
        margin: 0,
        padding: width > 768 ? 24 : 16, // Adjust padding for larger screens
        // backgroundColor: '#F9F9F9',
    },
    item40: {
        width: '38%',
    },
    item60: {
        width: '58%',
    },
    playSection: {
        backgroundColor: 'transparent',
        padding: 20,
        borderRadius: 15,
        marginTop: 10,
    },
    playHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    playTitle: {
        fontSize: width > 768 ? 26 : 22, // Larger font size for tablets
        fontWeight: 'bold',
        color: '#343434',
    },
    fireIcon: {
        backgroundColor: '#ffffff',
        paddingVertical: width > 768 ? 12 : 8, // Adjust padding for larger screens
        paddingHorizontal: width > 768 ? 24 : 20,
        borderRadius: 50,
        color: '#343434',
        fontSize: width > 768 ? 18 : 16,
        fontWeight: 'bold',
    },
    goalCard: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 10,
        height: width > 768 ? 120 : 100, // Adjust height for larger screens
    },
    goalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#343434',
    },
    subText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    progressCircle: {
        width: width > 768 ? 60 : 50, // Adjust size for larger screens
        height: width > 768 ? 60 : 50,
        borderRadius: width > 768 ? 30 : 25,
        borderWidth: 4,
        borderColor: '#FF5733',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    turnButton: {
        backgroundColor: '#FF6B6B',
        padding: width > 768 ? 12 : 10, // Adjust padding for larger screens
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        marginRight: 5,
    },
    archiveButton: {
        backgroundColor: '#FFB6B6',
        padding: width > 768 ? 12 : 10, // Adjust padding for larger screens
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        marginLeft: 5,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    taskCard: {
        backgroundColor: '#D0F0C0',
        padding: 15,
        borderRadius: 15,
    },
    taskTitle: {
        fontSize: width > 768 ? 16 : 14, // Adjust font size for larger screens
        fontWeight: 'bold',
        color: '#388E3C',
    },
    taskSubtitle: {
        fontSize: width > 768 ? 20 : 18, // Adjust font size for larger screens
        fontWeight: 'bold',
        marginBottom: 5,
    },
    taskDescription: {
        fontSize: 14,
        color: '#444',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#343434',
    },
    iconRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconButton: {
        height: 50,
        borderRadius: 10,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelWrap: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
        justifyContent: 'center', // Align items to the start
        gap: 10,
    },
    iconImage: {
        width: 30,
        height: 30,
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
        justifyContent: 'center', // Align items to the start
    },
    iconText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        maxWidth: 100, // Set the maximum width for the text
        flexWrap: 'wrap', // Allow text to wrap to the next line
        textAlign: 'center', // Optional: Center-align the text
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 2,
        borderRadius: 15,
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: 100,
    },
    icon: {
        fontSize: 18,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'capitalize', // Capitalize the text
        flexWrap: 'wrap', // Allow text to wrap to the next line
        alignSelf: 'flex-start',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1, // Takes up remaining space
        padding: 2,
    },
    iconContainer: {
        width: '20%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    image: {
        width: '100%', // Ensures it fits inside the container
        // height: 40, // Adjust height as needed
        resizeMode: 'contain',
    },
    quizCardMain: {
        marginBottom: 2,
    },
    playMainContainr: {
        marginTop: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        gap: 10,
        borderRadius: 25,
        borderColor: '#ff9c7d',
        borderWidth: 2,
        marginBottom: 20,
        marginHorizontal: 35,
    },
    switchButton: {
        flexDirection: 'row',
        paddingVertical: width > 768 ? 8 : 5, // Adjust padding for larger screens
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: width > 768 ? '25%' : '20%', // Adjust width for larger screens
    },
    activeSwitchButton: {
        backgroundColor: '#FF9A8B',
        width: '50%',
    },
    switchImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    switchText: {
        fontSize: 16,
        color: '#FF9A8B',
        fontWeight: 'bold',
    },
    activeSwitchText: {
        color: '#FFFFFF',
    },
    newContainer: {
        borderRadius: 15,
    },
    playButtonMain: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    shuffleButtonMain: {
        position: 'relative',
    },
    playButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-end",
        backgroundColor: "#FF9A8B",
        paddingVertical: width > 768 ? 8 : 6, // Adjust padding for larger screens
        paddingHorizontal: width > 768 ? 16 : 12,
        borderRadius: 20,
        width: width > 768 ? 100 : 80, // Adjust width for larger screens
        justifyContent: 'center',
        marginTop: 10,
    },
    shuffleText: {
        padding: 5,
        color: "#fff",
        fontSize: width > 768 ? 18 : 16, // Adjust font size for larger screens
        fontWeight: "bold",
    },
    card: {
        padding: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardContent: {
        padding: 20,
        borderRadius: 10,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#7e6d5e",
    },
    quizTitle: {
        fontSize: width > 768 ? 20 : 18, // Adjust font size for larger screens
        fontWeight: "bold",
        color: "#343434",
        marginVertical: 5,
    },
    description: {
        fontSize: width > 768 ? 16 : 14, // Adjust font size for larger screens
        color: "#242424",
        padding: 2,
        marginBottom: 20,
        fontWeight: '500', // Medium weight
        lineHeight: width > 768 ? 24 : 20, // Adjust line height for larger screens
        maxWidth: '90%',
        alignSelf: 'flex-start',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1, // Takes up remaining space
        padding: 2,
    },
    iconContainer: {
        width: '20%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    image: {
        width: '100%', // Ensures it fits inside the container
        // height: 40, // Adjust height as needed
        resizeMode: 'contain',
    },
    quizCardMain: {
        marginBottom: 20,
    }
};

export default styles;
