import React, {createContext, useState, useContext, useCallback} from 'react';

const SyncContext = createContext();

export const useSync = () => useContext(SyncContext);

export const SyncProvider = ({children}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [totalDataSize, setTotalDataSize] = useState(0);
  const [viewType, setViewType] = useState(1);
  const [error, setError] = useState(null);
  const [isBackupCompleted, setIsBackupCompleted] = useState(false);

  const startSync = useCallback(() => {
    setIsSyncing(true);
  }, []);

  const stopSync = useCallback(() => {
    setViewType(1);
    setTotalDataSize(0);
    setIsSyncing(false);
  }, []);

  const updateProgress = useCallback(percent => {
    setPercentageUploaded(percent.toFixed(0));
    //  setPercentageUploaded(percent);
  }, []);

  const reportError = useCallback(error => {
    setIsBackupCompleted(false);
    setViewType(1);
    setTotalDataSize(0);
    setIsSyncing(false);
    setPercentageUploaded(0);

    console.error(error);
    setError(error);
  }, []);

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        percentageUploaded,
        totalDataSize,
        setTotalDataSize,
        startSync,
        stopSync,
        updateProgress,
        reportError,
        isBackupCompleted,
        setIsBackupCompleted,
        error,
      }}>
      {children}
    </SyncContext.Provider>
  );
};
