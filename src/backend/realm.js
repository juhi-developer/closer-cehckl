import Realm from 'realm';
import RNFS from 'react-native-fs';
import {MessageSchema, QuotedMessages, ReactionSchema} from './schemas';

const backupFileName = 'closer_backup.realm';
export const backupPath = `${RNFS.DocumentDirectoryPath}/${backupFileName}`;
const defaultRealmPath = Realm.defaultPath;

// Your schema information
export const schema = [MessageSchema, ReactionSchema, QuotedMessages];
export const schemaVersion = 22;

export const appConfig = {
  schema: schema,
  schemaVersion: schemaVersion,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 20) {
      const oldObjects = oldRealm.objects('Message');
      const newObjects = newRealm.objects('Message');

      // loop through all objects and set the new field to a default value
      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i].downloadFailed = false; // or your default value
      }
    }
    // Handling migration for Reaction objects
    if (oldRealm.schemaVersion < 21) {
      const oldReactions = oldRealm.objects('Reaction');
      const newReactions = newRealm.objects('Reaction');

      for (let i = 0; i < oldReactions.length; i++) {
        newReactions[i].reactionNew = ''; // Set a default value for the new key
      }
    }
  },
};

// Backup function
async function backupRealm() {
  try {
    if (await RNFS.exists(backupPath)) {
      // Check if the backup file exists
      await RNFS.unlink(backupPath); // Delete the old backup
    }

    await RNFS.copyFile(defaultRealmPath, backupPath);

    console.log('Realm backup successful!');

    // Reopen the Realm with the restored data
    const newRealmConfig = {
      path: defaultRealmPath, // or whatever your config requires
      schema: schema,
      schemaVersion: schemaVersion,
    };

    realm = new Realm(newRealmConfig); // Create a new Realm instance with the restored data
    console.log('realmmmmmm,', realm.isClosed);
  } catch (error) {
    console.error('Realm backup failed:', error);
  }
}

// Restore function
async function restoreRealm() {
  //  console.log('before realm', realm.isClosed);
  //  realm.close(); // Close the current Realm instance
  // console.log('after realm', realm.isClosed);
  //  realm = null;

  try {
    if (await RNFS.exists(backupPath)) {
      if (await RNFS.exists(defaultRealmPath)) {
        // Check if the backup file exists
        await RNFS.unlink(defaultRealmPath); // Delete the old backup
      }

      await RNFS.copyFile(backupPath, defaultRealmPath); // Overwrite if necessary
      console.log('Realm restored!');

      // // Reopen the Realm with the restored data
      // const newRealmConfig = {
      //   path: defaultRealmPath, // or whatever your config requires
      //   schema: schema,
      //   schemaVersion: schemaVersion,
      // };

      // realm = new Realm(newRealmConfig); // Create a new Realm instance with the restored data
      // console.log('realmmmmmm,', realm.isClosed);

      // if (realm.isClosed) {
      //   console.log('Realm is still closed.');
      // } else {
      //   console.log('Performing test query...');
      //   // Perform a test read or write
      // }

      console.log('Realm reopened!');
    } else {
      console.log("Backup doesn't exist");
      // ...
    }
  } catch (error) {
    console.error('Realm restore failed:', error);
  }
}

export {backupRealm, restoreRealm};
