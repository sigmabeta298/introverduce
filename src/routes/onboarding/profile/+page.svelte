<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveProfile } from '$lib/db/profile';
	import type { Profile } from '$lib/db/types';

	let profile = $state<Profile>({
		id: 'profile',
		name: '',
		photo: '',
		location: '',
		contact: {
			email: '',
			phone: '',
			website: ''
		},
		setupComplete: false,
		createdAt: Date.now(),
		updatedAt: Date.now()
	});

	let saving = $state(false);

	async function save() {
		saving = true;

		profile.updatedAt = Date.now();
		await saveProfile($state.snapshot(profile));

		await goto('/onboarding/persona');
	}
</script>

<svelte:head>
	<title>Your Profile · IntroVerDuce</title>
</svelte:head>

<div class="app">
	<header>
		<p class="eyebrow">WELCOME TO INTROVERDUCE</p>
		<h1>Add your profile details</h1>
		<p class="intro">
			This information is shared across your personas.
		</p>
	</header>

	<main>
		<section class="form-card">
			<label>
				<span>Name</span>
				<input bind:value={profile.name} />
			</label>

			<label>
				<span>Location</span>
				<input bind:value={profile.location} />
			</label>

			<label>
				<span>Email</span>
				<input type="email" bind:value={profile.contact.email} />
			</label>

			<label>
				<span>Phone</span>
				<input type="tel" bind:value={profile.contact.phone} />
			</label>

			<label>
				<span>Website</span>
				<input type="url" bind:value={profile.contact.website} />
			</label>
		</section>

		<button class="primary-button" onclick={save} disabled={saving}>
			{saving ? 'Saving...' : 'Continue'}
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

	input {
		width: 100%;
		padding: 0.8rem 0.9rem;
		box-sizing: border-box;
		border: 1px solid var(--color-secondary);
		border-radius: 0.65rem;
		background: var(--color-cream);
		color: var(--color-text);
		font: inherit;
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
</style>