<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getProfile, saveProfile } from '$lib/db/profile';
	import type { Profile } from '$lib/db/types';

	let profile = $state<Profile>({
		id: 'profile',
		name: '',
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

	let saved = $state(false);

	onMount(async () => {
		const existingProfile = await getProfile();

		if (existingProfile) {
			profile = existingProfile;
		}
	});

	async function save() {
		profile.updatedAt = Date.now();

		await saveProfile($state.snapshot(profile));
		saved = true;

		setTimeout(() => {
			saved = false;
		}, 2500);
	}
</script>

<svelte:head>
	<title>About You · IntroVerDuce</title>
	<meta
		name="description"
		content="Manage the information shared across your IntroVerDuce personas."
	/>
</svelte:head>

<div class="app">
	<header>
		<p class="eyebrow">INTROVERDUCE</p>
		<h1>About You</h1>
		<p class="intro">
			Information here can be used across your different personas.
		</p>
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
			<div class="section-heading">
				<h2>Basic information</h2>
				<p>The things that stay consistent across introductions.</p>
			</div>

			<div class="fields">
				<label>
					<span>Name</span>
					<input
						type="text"
						bind:value={profile.name}
						placeholder="Your name"
					/>
				</label>

				<label>
					<span>Location</span>
					<input
						type="text"
						bind:value={profile.location}
						placeholder="Where are you based?"
					/>
				</label>
			</div>
		</section>

		<section class="form-card">
			<div class="section-heading">
				<h2>Contact</h2>
				<p>Optional information you may want to share.</p>
			</div>

			<div class="fields">
				<label>
					<span>Email</span>
					<input
						type="email"
						bind:value={profile.contact.email}
						placeholder="you@example.com"
					/>
				</label>

				<label>
					<span>Phone</span>
					<input
						type="tel"
						bind:value={profile.contact.phone}
						placeholder="Phone number"
					/>
				</label>

				<label>
					<span>Website</span>
					<input
						type="url"
						bind:value={profile.contact.website}
						placeholder="https://..."
					/>
				</label>
			</div>
		</section>

		<button class="save-button" onclick={save}>
			Save Profile
		</button>

		{#if saved}
			<p class="saved-message">Profile saved.</p>
		{/if}
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
		display: grid;
		grid-template-columns: 1fr auto;
		column-gap: 1rem;
		margin-bottom: 2rem;
	}

	header .intro {
		grid-column: 1 / -1;
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

	.intro {
		margin: 0.75rem 0 0;
		color: var(--color-text);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	main {
		display: grid;
		gap: 1rem;
	}

	.form-card {
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: white;
	}

	.section-heading {
		margin-bottom: 1.25rem;
	}

	h2 {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.05rem;
	}

	.section-heading p {
		margin: 0.35rem 0 0;
		color: var(--color-text);
		font-size: 0.82rem;
		line-height: 1.4;
	}

	.fields {
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

	input {
		width: 100%;
		padding: 0.8rem 0.9rem;
		box-sizing: border-box;
		border: 1px solid var(--color-secondary);
		border-radius: 0.65rem;
		background: var(--color-cream);
		color: var(--color-text);
		font: inherit;
		outline: none;
	}

	input:focus {
		border-color: var(--color-primary);
	}

	input::placeholder {
		color: var(--color-taupe);
	}

	.save-button {
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

	.saved-message {
		margin: 0;
		text-align: center;
		color: var(--color-primary);
		font-size: 0.85rem;
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