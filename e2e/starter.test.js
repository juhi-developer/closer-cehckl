jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn().mockResolvedValue({
    path: 'file:///private/var/mobile/Containers/Data/Application/A3CE5147-3FB6-4D20-9DC2-7A46719250A5/tmp/react-native-image-crop-picker/625A342E-94A8-48BC-8651-6AE4B44286B2.jpg',
    mime: 'image/jpeg',
    width: 800,
    height: 600,
  }),
}));

// Your import statements and tests go here

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: false});
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // await device.launchApp({newInstance: true});
  });

  // it('should show poke-modal-visible after tap on poke-tap', async () => {
  //   // Check if the moments screen is visible
  //   await waitFor(element(by.id('moments')))
  //     .toBeVisible()
  //     .withTimeout(10000);

  //   // Tap on the 'poke-tap' Pressable
  //   await element(by.id('poke-tap')).tap();

  //   await element(by.id('custom-swipe-button')).swipe('left');
  //   // Check if the 'poke-modal-visible' view is visible
  //   await expect(element(by.id('poke-modal-visible'))).toBeVisible();
  // });

  it('should add a post', async () => {
    await waitFor(element(by.id('moments')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('add-post-button')).tap();

    await element(by.id('openImagePickerButton')).tap();

    await element(by.id('add-post-input')).typeText('Test post');
    await element(by.id('add-post-save-button')).tap();
    await waitFor(element(by.id('text-post').and(by.text('Test post'))))
      .toBeVisible()
      .withTimeout(5000);
  });
  // it('should add a special event', async () => {
  //   // Check if the moments screen is visible
  //   await waitFor(element(by.id('moments')))
  //     .toBeVisible()
  //     .withTimeout(10000);

  //   await element(by.id('rememberDaysIcon')).tap();

  //   await element(by.id('add-specail-day-button')).tap();

  //   await element(by.id('add-special-day-input')).typeText(
  //     'Special day event ad',
  //   );
  //   const text = '31012024';

  //   for (let i = 0; i < text.length; i++) {
  //     await element(by.id('add-special-day-date-input')).typeText(text[i]);
  //   }
  //   await element(by.id('add-special-day-special-event-box')).tap();
  //   await element(by.id('add-special-day-save-button')).tap();

  //   await waitFor(
  //     element(by.id('text-special-day').and(by.text('Special day event ad'))),
  //   )
  //     .toBeVisible()
  //     .withTimeout(5000);
  // });

  // it('should edit a special day', async () => {
  //   await waitFor(element(by.id('moments')))
  //     .toBeVisible()
  //     .withTimeout(10000);

  //   await element(by.id('rememberDaysIcon')).tap();

  //   // Tap on the 'text-special-day' element to start editing
  //   await element(by.id('pressable-edit-event')).atIndex(0).tap();

  //   // Clear the text from the 'add-special-day-input' TextInput and type new text
  //   // Clear the text from the 'add-special-day-input' TextInput and type new text
  //   await element(by.id('add-special-day-input')).clearText();
  //   await element(by.id('add-special-day-input')).typeText(
  //     'New special day eve',
  //   );

  //   // Clear the text from the 'add-special-day-date-input' TextInput and type new date
  //   const newText = '31012024';
  //   await element(by.id('add-special-day-date-input')).replaceText('');
  //   for (let i = 0; i < newText.length; i++) {
  //     await element(by.id('add-special-day-date-input')).typeText(newText[i]);
  //   }

  //   // Tap the save button
  //   await element(by.id('add-special-day-save-button')).tap();

  //   // Wait for the new text to be visible
  //   await waitFor(
  //     element(by.id('text-special-day').and(by.text('New special day eve'))),
  //   )
  //     .toBeVisible()
  //     .withTimeout(5000);
  // });
});
