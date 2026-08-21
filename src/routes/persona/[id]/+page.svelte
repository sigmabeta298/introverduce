<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPersona } from '$lib/db/personas';
	import { getProfile } from '$lib/db/profile';
	import type { Persona, Profile } from '$lib/db/types';

	let persona = $state<Persona | null>(null);
	let profile = $state<Profile | null>(null);
	let loading = $state(true);
	let qrCode = $state('');
	let qrLoading = $state(true);

	onMount(async () => {
		const personaId = page.params.id;

		if (!personaId) {
			loading = false;
			qrLoading = false;
			return;
		}

		const [loadedPersona, loadedProfile] = await Promise.all([
			getPersona(personaId),
			getProfile()
		]);

		persona = loadedPersona ?? null;
		profile = loadedProfile ?? null;
		loading = false;

		if (loadedPersona) {
			const presentationUrl = `${window.location.origin}/persona/${loadedPersona.id}`;

			try {
				qrCode = await QRCode.toDataURL(presentationUrl, {
					width: 240,
					margin: 2
				});
			} catch (error) {
				console.error('Failed to generate QR code:', error);
			}
		}

		qrLoading = false;
	});
</script>

<svelte:head>
	<title>
		{persona ? `${persona.name} · IntroVerDuce` : 'Persona · IntroVerDuce'}
	</title>
	<meta
		name="description"
		content="A personal introduction by IntroVerDuce."
	/>
</svelte:head>

<div class="app">
	{#if loading}
		<p class="loading">Loading...</p>
	{:else if persona}
		<header>
			<div>
				<p class="eyebrow">INTROVERDUCE</p>
				<h1>{persona.name}</h1>

				{#if persona.description}
					<p class="description">{persona.description}</p>
				{/if}
			</div>

			<button
				class="icon-button"
				type="button"
				aria-label="Home"
				title="Home"
				onclick={() => goto('/')}
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M3.5 11.2 12 4l8.5 7.2v8.3a1 1 0 0 1-1 1h-5v-5.5h-5v5.5h-5a1 1 0 0 1-1-1v-8.3Z"
					/>
				</svg>
			</button>
		</header>

		<main>
			{#if profile}
				<section class="profile-card">
					<p class="eyebrow">ABOUT</p>

					<h2>{profile.name}</h2>

					{#if profile.location}
						<p class="profile-detail">{profile.location}</p>
					{/if}

					<div class="contact">
						{#if profile.contact.email}
							<a href={`mailto:${profile.contact.email}`}>
								{profile.contact.email}
							</a>
						{/if}

						{#if profile.contact.phone}
							<a href={`tel:${profile.contact.phone}`}>
								{profile.contact.phone}
							</a>
						{/if}

						{#if profile.contact.website}
							<a
								href={profile.contact.website}
								target="_blank"
								rel="noreferrer"
							>
								{profile.contact.website}
							</a>
						{/if}
					</div>
				</section>
			{/if}

			{#if persona.sections.length > 0}
				<section class="persona-details">
					<p class="eyebrow">ABOUT THIS PERSONA</p>

					<div class="sections">
						{#each persona.sections as section}
							<section class="section">
								{#if section.title}
									<h2>{section.title}</h2>
								{/if}

								{#if section.value}
									<p>{section.value}</p>
								{/if}
							</section>
						{/each}
					</div>
				</section>
			{/if}

			<section class="qr-card">
				<p class="eyebrow">SHARE THIS INTRODUCTION</p>

				<h2>Scan to view</h2>

				<p class="qr-description">
					Scan this QR code to open this introduction.
				</p>

				{#if qrLoading}
					<p class="qr-loading">Generating QR code...</p>
				{:else if qrCode}
					<div class="qr-wrapper">
						<img
							src={qrCode}
							alt={`QR code for ${persona.name}`}
						/>
					</div>
				{:else}
					<p class="qr-error">Unable to generate QR code.</p>
				{/if}
			</section>

		</main>
	{:else}
		<div class="not-found">
			<h1>Persona not found</h1>

			<button
				class="back-button"
				type="button"
				onclick={() => goto('/')}
			>
				Back to Home
			</button>
		</div>
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
		margin-bottom: 2.5rem;
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
		font-size: 2.2rem;
		line-height: 1.1;
	}

	.description {
		margin: 0.8rem 0 0;
		color: var(--color-text);
		font-size: 1rem;
		line-height: 1.5;
	}

	main {
		display: grid;
		gap: 1.25rem;
	}

	.profile-card,
	.persona-details {
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
	}

	.profile-card h2 {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.35rem;
	}

	.profile-detail {
		margin: 0.4rem 0 0;
		font-size: 0.95rem;
	}

	.contact {
		display: grid;
		gap: 0.35rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-secondary);
	}

	.contact a {
		color: var(--color-primary);
		font-size: 0.88rem;
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	.contact a:hover {
		text-decoration: underline;
	}

	.persona-details > .eyebrow {
		margin-bottom: 1.25rem;
	}

	.sections {
		display: grid;
		gap: 1.25rem;
	}

	.section {
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-secondary);
	}

	.section:first-child {
		padding-top: 0;
		border-top: 0;
	}

	.section h2 {
		margin: 0 0 0.5rem;
		color: var(--color-primary);
		font-size: 1.05rem;
	}

	.section p {
		margin: 0;
		line-height: 1.6;
		white-space: pre-wrap;
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

	.not-found {
		display: grid;
		gap: 1rem;
	}

	.not-found h1 {
		font-size: 1.5rem;
	}

	.back-button {
		padding: 1rem;
		border: 0;
		border-radius: 999px;
		background: var(--color-primary);
		color: var(--color-cream);
		font: inherit;
		font-weight: 600;
		cursor: pointer;
	}

	.qr-card {
		display: grid;
		justify-items: center;
		padding: 1.5rem;
		border: 1px solid var(--color-secondary);
		border-radius: 1rem;
		background: var(--color-surface);
		text-align: center;
	}

	.qr-card .eyebrow {
		margin-bottom: 0.5rem;
	}

	.qr-card h2 {
		margin: 0;
		color: var(--color-primary);
		font-size: 1.15rem;
	}

	.qr-description {
		margin: 0.4rem 0 1.25rem;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.qr-wrapper {
		padding: 0.75rem;
		border-radius: 0.75rem;
		background: white;
	}

	.qr-wrapper img {
		display: block;
		width: 240px;
		height: 240px;
		max-width: 100%;
	}

	.qr-loading,
	.qr-error {
		margin: 0;
		font-size: 0.85rem;
	}

	.qr-error {
		color: var(--color-primary);
	}
</style>