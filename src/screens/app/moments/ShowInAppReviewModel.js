import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ShowInAppReview = ({
  modalVisible,
  setModalVisible,
  handleYesPress,
  handleNoPress,
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
           <Text style={styles.message}>Enjoying Closer so far?</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.likeButton]}
              onPress={handleYesPress}
            >
              <Text style={styles.buttonText}>👍 Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dislikeButton]}
              onPress={handleNoPress}
            >
              <Text style={styles.buttonText}>👎 No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    color: '#363636',

  },
  likeButton: {
    backgroundColor: '#E0F7FA',
  },
  dislikeButton: {
    backgroundColor: '#ECEFF1',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#363636',
  },
});

export default ShowInAppReview;