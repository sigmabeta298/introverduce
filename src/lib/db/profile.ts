import { db } from './db';
import type { Profile } from './types';

export async function getProfile(): Promise<Profile | undefined> {
	return db.profiles.get('profile');
}

export async function saveProfile(profile: Profile): Promise<void> {
	await db.profiles.put(profile);
}

export async function deleteProfile(): Promise<void> {
	await db.profiles.delete('profile');
}