import { db } from './db';
import type { Persona, PersonaSection } from './types';

export async function getAllPersonas(): Promise<Persona[]> {
	const personas = await db.personas.toArray();

	return personas.sort((a, b) => a.order - b.order);
}

export async function getPersona(id: string): Promise<Persona | undefined> {
	return db.personas.get(id);
}

export async function createPersona(persona: Persona): Promise<string> {
	await db.personas.add(persona);
	return persona.id;
}

export async function updatePersona(persona: Persona): Promise<void> {
	await db.personas.put(persona);
}

export async function deletePersona(id: string): Promise<void> {
	await db.personas.delete(id);
}

export async function addPersonaSection(
	personaId: string,
	section: PersonaSection
): Promise<void> {
	const persona = await getPersona(personaId);

	if (!persona) {
		throw new Error('Persona not found');
	}

	persona.sections.push(section);
	persona.updatedAt = Date.now();

	await updatePersona(persona);
}

export async function updatePersonaSection(
	personaId: string,
	section: PersonaSection
): Promise<void> {
	const persona = await getPersona(personaId);

	if (!persona) {
		throw new Error('Persona not found');
	}

	const index = persona.sections.findIndex(
		(existing) => existing.id === section.id
	);

	if (index === -1) {
		throw new Error('Section not found');
	}

	persona.sections[index] = section;
	persona.updatedAt = Date.now();

	await updatePersona(persona);
}

export async function deletePersonaSection(
	personaId: string,
	sectionId: string
): Promise<void> {
	const persona = await getPersona(personaId);

	if (!persona) {
		throw new Error('Persona not found');
	}

	persona.sections = persona.sections.filter(
		(section) => section.id !== sectionId
	);

	persona.updatedAt = Date.now();

	await updatePersona(persona);
}