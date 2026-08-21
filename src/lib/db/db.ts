import Dexie, { type Table } from 'dexie';
import type { Persona, Profile } from './types';

export class IntroVerDuceDB extends Dexie {
	profiles!: Table<Profile, string>;
	personas!: Table<Persona, string>;

	constructor() {
		super('introverduce');

		this.version(1).stores({
			profiles: 'id',
			personas: 'id, name, updatedAt'
		});
	}
}

export const db = new IntroVerDuceDB();