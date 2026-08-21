<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPersona, updatePersona, deletePersona } from '$lib/db/personas';
	import type { Persona, PersonaSection } from '$lib/db/types';

	let persona = $state<Persona | null>(null);
	let loading = $state(true);
	let saved = $state(false);

	onMount(async () => {
		const personaId = page.params.id;

		if (!personaId) {
			loading = false;
			return;
		}

		persona = (await getPersona(personaId)) ?? null;
		loading = false;
	});

	async function save() {
        if (!persona) return;

        const updatedPersona: Persona = {
            ...$state.snapshot(persona),
            updatedAt: Date.now()
        };

        await updatePersona(updatedPersona);

        persona = updatedPersona;

        saved = true;

        setTimeout(() => {
            saved = false;
        }, 2000);
    }

	async function remove() {
		if (!persona) return;

		await deletePersona(persona.id);
		await goto('/');
	}

	function addSection() {
		if (!persona) return;

		const section: PersonaSection = {
			id: crypto.randomUUID(),
			title: 'New Section',
			value: '',
			order: persona.sections.length
		};

		persona.sections = [...persona.sections, section];
	}
</script>

<svelte:head>
	<title>
		{persona ? `${persona.name} · IntroVerDuce` : 'Persona · IntroVerDuce'}
	</title>
</svelte:head>

<div class="app">
	{#if loading}
		<p>Loading...</p>
	{:else if persona}
		<header>
			<p class="eyebrow">PERSONA</p>
			<h1>{persona.name}</h1>
		</header>

		<main>
			<section class="form-card">
				<label>
					<span>Name</span>
					<input bind:value={persona.name} />
				</label>

				<label>
					<span>Description</span>
					<textarea bind:value={persona.description}></textarea>
				</label>
			</section>

			<section class="sections-card">
				<div class="section-header">
					<div>
						<p class="eyebrow">PERSONA DETAILS</p>
						<h2>Sections</h2>
					</div>

					<button class="add-section-button" onclick={addSection}>
						+ Add
					</button>
				</div>

				{#if persona.sections.length === 0}
					<p class="empty-message">
						No sections yet. Add one to start building this persona.
					</p>
				{:else}
					<div class="sections">
						{#each persona.sections as section}
							<div class="section">
								<label>
									<span>Heading</span>
									<input bind:value={section.title} />
								</label>

								<label>
									<span>Content</span>
									<textarea bind:value={section.value}></textarea>
								</label>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<button class="save-button" onclick={save}>
				Save Changes
			</button>
            {#if saved}
                <p class="saved-message">Saved.</p>
            {/if}

			<button class="delete-button" onclick={remove}>
				Delete Persona
			</button>
		</main>
	{:else}
		<h1>Persona not found</h1>
		<a href="/">Back to personas</a>
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 1.25rem 3rem;
		box-sizing: border-box;
	}

	header {
		margin-bottom: 2rem;
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		color: var(--color-primary);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.14em;
	}

	h1 {
		margin: 0;
		color: var(--color-primary);
		font-size: 2rem;
	}

	main {
		display: grid;
		gap: 1rem;
	}

	.form-card {
		display: grid;
		gap: 1rem;
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
	}

	label {
		display: grid;
		gap: 0.4rem;
	}

	label span {
		font-size: 0.82rem;
		font-weight: 600;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.8rem 0.9rem;
		box-sizing: border-box;
		border: 1px solid var(--color-secondary);
		border-radius: 0.65rem;
		background: var(--color-cream);
		color: var(--color-text);
		font: inherit;
	}

	textarea {
		min-height: 100px;
		resize: vertical;
	}

	.save-button,
	.delete-button {
		width: 100%;
		padding: 1rem;
		border-radius: 999px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.save-button {
		border: 0;
		background: var(--color-primary);
		color: var(--color-cream);
	}

	.delete-button {
		border: 1px solid var(--color-secondary);
		background: transparent;
		color: var(--color-text);
	}
    .saved-message {
        margin: -0.5rem 0 0;
        text-align: center;
        color: var(--color-primary);
        font-size: 0.85rem;
    }

	.sections-card {
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.add-section-button {
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--color-secondary);
		border-radius: 999px;
		background: var(--color-cream);
		color: var(--color-primary);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.sections {
		display: grid;
		gap: 1.25rem;
	}

	.section {
		display: grid;
		gap: 1rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-secondary);
	}

	.empty-message {
		margin: 0;
		font-size: 0.9rem;
	}
</style>