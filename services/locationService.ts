import * as Location from 'expo-location';
import { ExecutorLocation, MissionLocation } from '@/types/mission';

export const MISSION_ARRIVAL_RADIUS_METERS = 150;
let missionWatcher: Location.LocationSubscription | null = null;

export function calculateDistance(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
  const earthRadius = 6371000;
  const toRadians = (value: number) => value * Math.PI / 180;
  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) * Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function requestForegroundPermission() {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentLocation(): Promise<MissionLocation & { accuracy?: number }> {
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy ?? undefined };
}

export async function watchLocation(onLocation: (location: ExecutorLocation) => void) {
  return Location.watchPositionAsync({ accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 }, ({ coords }) => onLocation({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy ?? undefined, updatedAt: new Date().toISOString() }));
}

export async function stopWatching(watcher: Location.LocationSubscription | null) { watcher?.remove(); }

export async function startMissionTracking(onLocation: (location: ExecutorLocation) => void) {
  await stopMissionTracking();
  missionWatcher = await watchLocation(onLocation);
  return missionWatcher;
}

export async function stopMissionTracking() {
  await stopWatching(missionWatcher);
  missionWatcher = null;
}