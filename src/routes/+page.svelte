<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getAllPersonas } from '$lib/db/personas';
	import { getProfile } from '$lib/db/profile';
	import type { Persona } from '$lib/db/types';

	let personas = $state<Persona[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const profile = await getProfile();

		if (!profile || !profile.setupComplete) {
			await goto('/onboarding/profile');
			return;
		}

		personas = await getAllPersonas();
		loading = false;
	});
</script>

<svelte:head>
	<title>IntroVerDuce</title>
	<meta
		name="description"
		content="Introduce yourself without saying a word."
	/>
</svelte:head>

<div class="app">
	{#if loading}
		<p class="loading">Loading...</p>
	{:else}
		<header>
			<h1>IntroVerDuce</h1>

			<button
				class="icon-button"
				aria-label="Profile"
				title="Profile"
				onclick={() => goto('/profile')}
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<circle cx="12" cy="7.5" r="3.5" />
					<path d="M4.5 20c.6-4.1 3.2-6.5 7.5-6.5s6.9 2.4 7.5 6.5H4.5Z" />
				</svg>
			</button>
		</header>

		<main>
			<h2>My Introductions</h2>

			<div class="personas">
				{#each personas as persona}
					<div class="persona-card">
						<button
							class="persona-content"
							type="button"
							onclick={() => goto(`/persona/${persona.id}/edit`)}
						>
							<span class="persona-name">{persona.name}</span>

							{#if persona.description}
								<span class="persona-description">{persona.description}</span>
							{/if}
						</button>

						<div class="persona-actions">
							<button
								class="icon-button"
								type="button"
								aria-label={`Present ${persona.name}`}
								title="Present"
								onclick={() => goto(`/persona/${persona.id}`)}
							>
								<svg
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M8 5.5v13l10-6.5-10-6.5Z"
									/>
								</svg>
							</button>

							<button
								class="icon-button"
								type="button"
								aria-label={`Share ${persona.name}`}
								title="Share"
								onclick={() => {}}
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<circle cx="18" cy="5" r="2.5" />
									<circle cx="6" cy="12" r="2.5" />
									<circle cx="18" cy="19" r="2.5" />
									<path d="m8.2 10.8 7.6-4.4" />
									<path d="m8.2 13.2 7.6 4.4" />
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>

			<button class="add-persona" onclick={() => goto('/persona/new')}>
				+ Add Persona
			</button>
		</main>
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 1.25rem;
		box-sizing: border-box;
	}

	.loading {
		margin: 0;
		padding-top: 2rem;
		text-align: center;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3rem;
	}

	h1 {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.5rem;
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
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		padding: 0.75rem;
		box-sizing: border-box;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
	}

	.persona-content {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 0;
		background: transparent;
		color: var(--color-text);
		text-align: left;
		font: inherit;
		cursor: pointer;
	}

	.persona-content:hover .persona-name {
		text-decoration: underline;
	}

	.persona-name {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.persona-description {
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.persona-actions {
		display: flex;
		flex-shrink: 0;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-button {
		display: grid;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0.6rem;
		place-items: center;
		box-sizing: border-box;
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
		width: 1.35rem;
		height: 1.35rem;
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