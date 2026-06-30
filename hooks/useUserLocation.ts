import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinates } from '../types';

export function useUserLocation(): Coordinates | null {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    let cancelled = false;
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== 'granted' || cancelled) return;
        return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      })
      .then((pos) => {
        if (!pos || cancelled) return;
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  return location;
}
