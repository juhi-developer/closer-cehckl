const styles = {
    container: { flex: 1, backgroundColor: "#FFF", marginTop: 40 },
    headerContainer: { padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    headerContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", position: "relative" },
    labelContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, gap: 10 },
    headerBottomContainer: { marginBottom: 10 },
    rounderBorder: { borderRadius: 15 },
    headerText: { fontSize: 12, fontWeight: "bold", color: "#343434" },
    closeButton: { padding: 5, position: 'absolute', right: 0 },
    closeIcon: { width: 24, height: 24, resizeMode: "contain" },
    paginationContainer: {
        display: "flex", // Ensures the container uses flexbox
        flexDirection: "row", // Aligns items in a row
        alignItems: "flex-start", // Aligns items to the start (top)
    },

    paginationStyle: { paddingVertical: 2 },
    dotStyle: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#124698" },
    inactiveDotStyle: { backgroundColor: "#CCC" },
    carouselContainer: { flex: 1, width: "100%" },
    questionSlide: { alignItems: "flex-start", paddingHorizontal: 20, borderRadius: 10 },
    questionText: {
        fontSize: 18, fontWeight: "600", color: "#333", marginTop: 20, marginBottom: 20,
    },
    blurredText: {
        color: 'transparent', // Make the text color transparent
        textShadowColor: 'black', // Add shadow color
        textShadowOffset: { width: 0, height: 0 }, // Adjust shadow position
        textShadowRadius: 20, // Adjust shadow blur intensity
        filter: 'blur(5px)', // Apply blur effect
        // color: "rgba(0, 0, 0, 0.01)", // Extremely low opacity to make the text almost invisible
        // textShadowColor: "rgba(0, 0, 0, 0.7)", // Shadow color with very low opacity
        //  textShadowRadius: 50, // Very high radius for maximum blur

    },
    inputContainer: {

        // position: "absolute", bottom: 10, left: 0, right: 0, padding: 10,
        // marginHorizontal: 20, borderRadius: 5
    },
    input: { fontSize: 16, color: "#333", padding: 10, borderRadius: 5 },
    submitButton: {
        backgroundColor: "#72bd90",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    submitButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 1,
    },


    inputWrapper: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
        borderRadius: 5,
        paddingHorizontal: 10,
    },

    input: {
        flex: 1, // Take up remaining space
        fontSize: 16,
        color: "#333",
        paddingVertical: 10,
    },
    iconContainer: {
        padding: 5,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },

    answerContainer: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
        paddingVertical: 10,
        borderBottomWidth: 1, // Add a bottom border
        borderBottomColor: '#CCC', // Gray color for the border
    },
    senderPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20, // Make the photo circular
        marginRight: 10,
    },
    answerContent: {
        flex: 1, // Take up remaining space
    },

    sendTime: {
        fontSize: 12,
        color: '#999', // Lighter color for the time
        marginTop: 5,
        marginBottom: 5,
        alignSelf: 'flex-end', // Align the text to the right

    },
    bottomBorder: {
        height: 1,
        backgroundColor: '#CCC', // Gray color for the border
        marginTop: 10,
    },
    multiAnswerContainer: {
        padding: 10,
    },




    option: {
        width: '45%',
        aspectRatio: 1, // Makes the option a square
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
    },
    leftOption: {
        marginRight: '2%',
    },
    rightOption: {
        marginLeft: '2%',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
    },
    emoji: {
        fontSize: 30,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    maincontainer: {
        display: 'flex',
        flexDirection: 'row',
        // flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },

    selectedOption: {
        backgroundColor: '#D3D3D3', // Gray background for selected option
        opacity: 0.6, // Make it visually distinct
    },


    answerText: {
         color: '#333',
    },
     

};

export default styles;
