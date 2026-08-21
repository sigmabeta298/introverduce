<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAllPersonas, createPersona } from '$lib/db/personas';
	import type { Persona } from '$lib/db/types';

	let personas = $state<Persona[]>([]);

	onMount(async () => {
		personas = await getAllPersonas();
	});

	async function addPersona() {
		const now = Date.now();

		const persona: Persona = {
			id: crypto.randomUUID(),
			name: 'Alter Ego Architect',
			description: 'The nerdy coffee freak',
			order: personas.length,
			sections: [],
			createdAt: now,
			updatedAt: now
		};

		await createPersona(persona);

		personas = [...personas, persona];
	}
</script>

<svelte:head>
	<title>IntroVerDuce</title>
	<meta
		name="description"
		content="Introduce yourself without saying a word."
	/>
</svelte:head>

<div class="app">
	<header>
		<h1>IntroVerDuce</h1>
	</header>

	<main>
		<h2>My Introductions</h2>

		<div class="personas">
			{#each personas as persona}
				<button
					class="persona-card"
					onclick={() => goto(`/persona/${persona.id}`)}
				>
					<span class="persona-name">{persona.name}</span>

					{#if persona.description}
						<span class="persona-description">{persona.description}</span>
					{/if}
				</button>
			{/each}
		</div>

		<button class="add-persona" onclick={addPersona}>
			+ Add Persona
		</button>
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 1.25rem;
		box-sizing: border-box;
	}

	header {
		margin-bottom: 3rem;
	}

	h1 {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.5rem;
	}

	h2 {
		margin: 0 0 1.25rem;
		font-size: 1.25rem;
	}

	.personas {
		display: grid;
		gap: 1rem;
	}

	.persona-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		width: 100%;
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: white;
		color: var(--color-text);
		text-align: left;
		cursor: pointer;
	}

	.persona-name {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.persona-description {
		font-size: 0.9rem;
	}

	.add-persona {
		width: 100%;
		margin-top: 1.5rem;
		padding: 1rem;
		border: 0;
		border-radius: 999px;
		background: var(--color-primary);
		color: var(--color-cream);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}
</style>