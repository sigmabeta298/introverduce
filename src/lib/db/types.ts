export interface Profile {
	id: string;
	name: string;
	photo?: string;
	location?: string;
	contact: {
		email?: string;
		phone?: string;
		website?: string;
	};
    setupComplete: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface PersonaSection {
	id: string;
	title: string;
	value: string;
	order: number;
}

export interface Persona {
	id: string;
	name: string;
	description?: string;
	order: number;
	sections: PersonaSection[];
	createdAt: number;
	updatedAt: number;
}