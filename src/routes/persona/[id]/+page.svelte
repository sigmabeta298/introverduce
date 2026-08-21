<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPersona, updatePersona, deletePersona } from '$lib/db/personas';
	import type { Persona, PersonaSection } from '$lib/db/types';

	let persona = $state<Persona | null>(null);
	let loading = $state(true);
	let saved = $state(false);
	let saving = $state(false);

	onMount(async () => {
		const personaId = page.params.id;

		if (!personaId) {
			loading = false;
			return;
		}

		persona = (await getPersona(personaId)) ?? null;
		loading = false;
	});

	function addSection() {
		if (!persona) return;

		const section: PersonaSection = {
			id: crypto.randomUUID(),
			title: '',
			value: '',
			order: persona.sections.length
		};

		persona.sections = [...persona.sections, section];
	}

	function removeSection(id: string) {
		if (!persona) return;

		persona.sections = persona.sections
			.filter((section) => section.id !== id)
			.map((section, index) => ({
				...section,
				order: index
			}));
	}

	function moveSection(id: string, direction: 'up' | 'down') {
		if (!persona) return;

		const sections = [...persona.sections];
		const currentIndex = sections.findIndex((section) => section.id === id);

		if (currentIndex === -1) return;

		const targetIndex =
			direction === 'up' ? currentIndex - 1 : currentIndex + 1;

		if (targetIndex < 0 || targetIndex >= sections.length) return;

		[sections[currentIndex], sections[targetIndex]] = [
			sections[targetIndex],
			sections[currentIndex]
		];

		persona.sections = sections.map((section, index) => ({
			...section,
			order: index
		}));
	}

	async function save() {
		if (!persona) return;

		saving = true;
		saved = false;

		const updatedPersona: Persona = {
			...$state.snapshot(persona),
			sections: persona.sections.map((section, index) => ({
				...section,
				order: index
			})),
			updatedAt: Date.now()
		};

		await updatePersona(updatedPersona);

		persona = updatedPersona;
		saving = false;
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
</script>

<svelte:head>
	<title>
		{persona ? `${persona.name} · IntroVerDuce` : 'Persona · IntroVerDuce'}
	</title>
</svelte:head>

<div class="app">
	{#if loading}
		<p class="loading">Loading...</p>
	{:else if persona}
		<header>
			<p class="eyebrow">PERSONA</p>
			<h1>{persona.name}</h1>
			<button
				class="icon-button"
				aria-label="Home"
				title="Home"
				onclick={() => goto('/')}
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M3.5 11.2 12 4l8.5 7.2v8.3a1 1 0 0 1-1 1h-5v-5.5h-5V20.5h-5a1 1 0 0 1-1-1v-8.3Z" />
				</svg>
			</button>
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

					<button
						class="add-section-button"
						type="button"
						onclick={addSection}
					>
						+ Add
					</button>
				</div>

				{#if persona.sections.length === 0}
					<p class="empty-message">
						No sections yet. Add one to start building this persona.
					</p>
				{:else}
					<div class="sections">
						{#each persona.sections as section, index}
							<div class="section">
								<div class="section-title-row">
									<h3>Section {index + 1}</h3>

									<div class="section-actions">
										<button
											type="button"
											aria-label="Move section up"
											disabled={index === 0}
											onclick={() => moveSection(section.id, 'up')}
										>
											↑
										</button>

										<button
											type="button"
											aria-label="Move section down"
											disabled={index === persona.sections.length - 1}
											onclick={() => moveSection(section.id, 'down')}
										>
											↓
										</button>

										<button
											type="button"
											class="remove-button"
											onclick={() => removeSection(section.id)}
										>
											Remove
										</button>
									</div>
								</div>

								<label>
									<span>Heading</span>
									<input
										bind:value={section.title}
										placeholder="e.g. Company, Hobbies, Tech Stack"
									/>
								</label>

								<label>
									<span>Content</span>
									<textarea
										bind:value={section.value}
										placeholder="Add the information..."
									></textarea>
								</label>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<button
				class="save-button"
				type="button"
				onclick={save}
				disabled={saving}
			>
				{saving ? 'Saving...' : 'Save Changes'}
			</button>

			{#if saved}
				<p class="saved-message">Saved.</p>
			{/if}

			<button class="delete-button" type="button" onclick={remove}>
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

	.loading {
		margin: 0;
		padding-top: 2rem;
		text-align: center;
	}

	header {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: start;
		column-gap: 1rem;
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

	.form-card,
	.sections-card {
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
	}

	.form-card {
		display: grid;
		gap: 1rem;
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

	.section-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.section-header .eyebrow {
		margin-bottom: 0.35rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.add-section-button {
		flex-shrink: 0;
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

	.section:first-child {
		padding-top: 0;
		border-top: 0;
	}

	.section-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.section-title-row h3 {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-primary);
	}

	.section-actions {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.section-actions button {
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--color-secondary);
		border-radius: 0.5rem;
		background: transparent;
		color: var(--color-text);
		font: inherit;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.section-actions button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.section-actions .remove-button {
		color: var(--color-primary);
	}

	.empty-message {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
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

	.save-button:disabled {
		opacity: 0.6;
		cursor: default;
	}

	.saved-message {
		margin: -0.5rem 0 0;
		text-align: center;
		color: var(--color-primary);
		font-size: 0.85rem;
	}

	.delete-button {
		border: 1px solid var(--color-secondary);
		background: transparent;
		color: var(--color-text);
	}

	@media (max-width: 480px) {
		.section-header,
		.section-title-row {
			align-items: stretch;
			flex-direction: column;
		}

		.add-section-button {
			width: 100%;
		}

		.section-actions {
			justify-content: flex-start;
		}
	}

	
	.icon-button {
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0.6rem;
		place-items: center;
		border: 1px solid var(--color-secondary);
		border-radius: 50%;
		background: var(--color-cream);
		color: var(--color-primary);
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease,
			transform 0.15s ease;
	}

	.icon-button:hover {
		background: var(--color-primary);
		color: var(--color-cream);
		transform: translateY(-1px);
	}

	.icon-button:active {
		transform: translateY(0);
	}

	.icon-button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}

	.icon-button svg {
		width: 1.5rem;
		height: 1.5rem;
	}
</style>