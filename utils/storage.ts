import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tune = {
  id: string;
  name: string;
  description?: string;
  powerGain?: string;
  maxRPM?: string;
  afrTable?: number[][];
};

export type Vehicle = {
  id: string;
  name: string;
  tunes: Tune[];
  photoUri?: string;
};

export const STORAGE_KEYS = {
  VEHICLES: "vehicles",
};

// Get vehicles list
export async function getStoredVehicles(): Promise<Vehicle[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLES);
  return json ? JSON.parse(json) : [];
}

// Save vehicles list
export async function saveStoredVehicles(vehicles: Vehicle[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
}

// Delete a specific vehicle by ID
export async function deleteVehicleById(id: string) {
  const vehicles = await getStoredVehicles();
  const updated = vehicles.filter(v => v.id !== id);
  await saveStoredVehicles(updated);
}

// Delete a tune from a vehicle
export async function deleteTune(vehicleId: string, tuneId: string) {
  const vehicles = await getStoredVehicles();
  const updated = vehicles.map(v =>
    v.id === vehicleId
      ? { ...v, tunes: v.tunes.filter(t => t.id !== tuneId) }
      : v
  );
  await saveStoredVehicles(updated);
}
