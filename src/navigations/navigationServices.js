import {
  NavigationActions,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

let _navigator;
let isNavigatorReady = false;
let queuedNavigation;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
  isNavigatorReady = true;
}

function navigate(routeName, params) {
  if (_navigator && isNavigatorReady) {
    setTimeout(() => {
      _navigator.navigate(routeName, params);
    }, 500);
  } else {
    // Queue the navigation request
    queuedNavigation = {routeName, params};
  }
  // _navigator.navigate(routeName,params);
  return;
}

// Later, when the navigator is ready
if (queuedNavigation) {
  navigate(queuedNavigation.routeName, queuedNavigation.params);
  queuedNavigation = null;
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

function resetNavigation(routeName = 'loginScreen') {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})],
  });
  _navigator.dispatch(resetAction);
}

function resetToTop(routeName) {
  if (_navigator && isNavigatorReady) {
    // Resetting the navigation state to the new route
    _navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: routeName}],
      }),
    );
  }
}

export default {
  navigate,
  setTopLevelNavigator,
  resetNavigation,
  goBack,
  resetToTop,
};
