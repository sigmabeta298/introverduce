<script lang="ts">
	import { goto } from '$app/navigation';
	import { createId } from '$lib/utils/id';
	import { createPersona } from '$lib/db/personas';
	import { getProfile, saveProfile } from '$lib/db/profile';
	import type { Persona, PersonaSection } from '$lib/db/types';

	let name = $state('');
	let description = $state('');
	let sections = $state<PersonaSection[]>([]);
	let saving = $state(false);

	function addSection() {
		sections = [
			...sections,
			{
				id: createId(),
				title: '',
				value: '',
				order: sections.length
			}
		];
	}

	function removeSection(id: string) {
		sections = sections
			.filter((section) => section.id !== id)
			.map((section, index) => ({
				...section,
				order: index
			}));
	}

	async function save() {
		if (!name.trim()) return;

		saving = true;

		const now = Date.now();

		const persona: Persona = {
			id: createId(),
			name: name.trim(),
			description: description.trim(),
			order: 0,
			sections: $state.snapshot(sections),
			createdAt: now,
			updatedAt: now
		};

		await createPersona(persona);

		const profile = await getProfile();

		if (profile) {
			profile.setupComplete = true;
			profile.updatedAt = now;

			await saveProfile($state.snapshot(profile));
		}

		await goto('/');
	}
</script>

<svelte:head>
	<title>Create Your First Persona · IntroVerDuce</title>
</svelte:head>

<div class="app">
	<header>
		<p class="eyebrow">STEP 2 OF 2</p>
		<h1>Create your first persona</h1>
		<p class="intro">
			Choose how you want to introduce yourself. You can add as much or as little
			as you like.
		</p>
	</header>

	<main>
		<section class="form-card">
			<label>
				<span>Persona name</span>
				<input
					bind:value={name}
					placeholder="e.g. Alter Ego Architect"
				/>
			</label>

			<label>
				<span>Description</span>
				<textarea
					bind:value={description}
					placeholder="A short description of this persona"
				></textarea>
			</label>
		</section>

		<section class="sections-card">
			<div class="section-header">
				<div>
					<h2>Persona details</h2>
					<p>Add anything that belongs specifically to this persona.</p>
				</div>

				<button class="add-section" type="button" onclick={addSection}>
					+ Add Section
				</button>
			</div>

			{#if sections.length === 0}
				<p class="empty-state">
					No sections yet. Add one if you want to include more details.
				</p>
			{:else}
				<div class="section-list">
					{#each sections as section}
						<div class="section-item">
							<label>
								<span>Section title</span>
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

							<button
								class="remove-section"
								type="button"
								onclick={() => removeSection(section.id)}
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<button
			class="primary-button"
			type="button"
			onclick={save}
			disabled={saving || !name.trim()}
		>
			{saving ? 'Saving...' : 'Create Persona'}
		</button>
	</main>
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
		margin: 0 0 0.75rem;
		color: var(--color-primary);
		font-size: 2rem;
	}

	.intro {
		margin: 0;
		line-height: 1.5;
	}

	main {
		display: grid;
		gap: 1rem;
	}

	.form-card,
	.sections-card {
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
		min-height: 90px;
		resize: vertical;
	}

	.section-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	h2 {
		margin: 0 0 0.35rem;
		font-size: 1.1rem;
		color: var(--color-primary);
	}

	.section-header p {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.add-section {
		flex-shrink: 0;
		padding: 0.55rem 0.8rem;
		border: 1px solid var(--color-secondary);
		border-radius: 999px;
		background: transparent;
		color: var(--color-primary);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
	}

	.section-list {
		display: grid;
		gap: 1rem;
	}

	.section-item {
		display: grid;
		gap: 0.9rem;
		padding: 1rem;
		border: 1px solid var(--color-secondary);
		border-radius: 0.8rem;
	}

	.empty-state {
		margin: 0;
		padding: 1rem;
		border-radius: 0.7rem;
		background: var(--color-cream);
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.remove-section {
		justify-self: start;
		border: 0;
		background: transparent;
		color: var(--color-primary);
		font: inherit;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.primary-button {
		width: 100%;
		padding: 1rem;
		border: 0;
		border-radius: 999px;
		background: var(--color-primary);
		color: var(--color-cream);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.primary-button:disabled {
		opacity: 0.6;
		cursor: default;
	}

	@media (max-width: 480px) {
		.section-header {
			flex-direction: column;
		}

		.add-section {
			width: 100%;
		}
	}
</style>