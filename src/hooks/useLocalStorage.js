import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing localStorage with reactivity
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[*, Function, Object]} [value, setValue, helpers]
 */
export function useLocalStorage(key, initialValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function to support functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [initialValue]);

  return [
    storedValue,
    setValue,
    {
      removeValue,
      clearStorage
    }
  ];
}

/**
 * Hook for managing localStorage with versioning and migration support
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @param {number} version - Current data version
 * @param {Function} migrate - Migration function
 * @returns {[*, Function, Object]} [value, setValue, helpers]
 */
export function useVersionedLocalStorage(key, initialValue = null, version = 1, migrate = null) {
  const versionKey = `${key}_version`;
  const [currentVersion, setCurrentVersion] = useState(() => {
    try {
      const storedVersion = window.localStorage.getItem(versionKey);
      return storedVersion ? parseInt(storedVersion, 10) : 0;
    } catch (error) {
      console.error(`Error reading version for localStorage key "${key}":`, error);
      return 0;
    }
  });

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        
        // Check if migration is needed
        if (currentVersion < version && migrate) {
          const migrated = migrate(parsed, currentVersion, version);
          window.localStorage.setItem(key, JSON.stringify(migrated));
          window.localStorage.setItem(versionKey, version.toString());
          setCurrentVersion(version);
          return migrated;
        }
        
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      window.localStorage.setItem(versionKey, version.toString());
      setCurrentVersion(version);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, version, versionKey]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.localStorage.removeItem(versionKey);
      setStoredValue(initialValue);
      setCurrentVersion(0);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, versionKey]);

  return [
    storedValue,
    setValue,
    {
      removeValue,
      version: currentVersion,
      isLatestVersion: currentVersion >= version
    }
  ];
}

/**
 * Hook for syncing localStorage changes across tabs/windows
 * @param {string} key - Storage key
 * @returns {Function} Function to trigger sync
 */
export function useStorageSync(key) {
  const syncTimeoutRef = useRef(null);

  const syncStorage = useCallback(() => {
    // Clear existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    // Debounce the storage event to avoid rapid updates
    syncTimeoutRef.current = setTimeout(() => {
      try {
        const event = new CustomEvent('storage-sync', {
          detail: { key }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Error syncing storage:', error);
      }
    }, 100);
  }, [key]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return syncStorage;
}