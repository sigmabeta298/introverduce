import { db } from './db';
import type { Persona } from './types';

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