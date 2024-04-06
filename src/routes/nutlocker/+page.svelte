<script lang="ts">
	import { onMount } from 'svelte';
	import Typewriter from '../../components/Typewriter.svelte';
	import { CashuMint, CashuWallet, getDecodedToken, getEncodedToken } from '@cashu/cashu-ts';
    import { Buffer } from "buffer";
	import type { UREncoder } from '@gandlaf21/bc-ur';
	import { getSVG } from 'qreator/lib/svg';

	let nut = '';

	let mint = '';

	let amount = 0;

	let memo = '';

	let errorMessage = '';

	let loadingChars = ['|', '/', '-', '\\'];
	let loadingCharI = 0;
	let currentLoadingChar = loadingChars[loadingCharI];
	let isLoading = false;

	let pubK = '';

	let received = '';
    let svg = ''

    let encoder: UREncoder

    $: maxFragmentLength = 100;
	$: intervalMS = 250;
	const firstSeqNum = 0;

    let qrInterval: number | undefined;

	const readPubK = () => {
		if ((pubK.startsWith('02') || pubK.startsWith('03')) && pubK.length === 66) {
			errorMessage = '';
		} else {
			pubK = '';
			errorMessage = 'Not a valid pubkey';
		}
	};

	setInterval(() => {
		if (loadingCharI >= 4) {
			loadingCharI = 0;
		}
		currentLoadingChar = loadingChars[loadingCharI];
		loadingCharI++;
	}, 100);

	const parseNut = () => {
		try {
			const decoded = getDecodedToken(nut);
			memo = decoded.memo ?? '';
			mint = decoded.token[0].mint;
			amount = decoded.token[0].proofs.reduce((acc, curr) => acc + curr.amount, 0);

			errorMessage = '';
		} catch (error) {
			errorMessage = 'could not decode token';
		}
	};

    const doInterval = async () => {
		clearInterval(qrInterval);
		qrInterval = setInterval(async () => {
			svg = new TextDecoder().decode(await getSVG(encoder.nextPart(), {
				color: 'black',
				bgColor: '#0C0'
			}))
		}, intervalMS);
	};

	$: startLoop = async () => {
		await getEncoder();
		doInterval();
	};

    const getEncoder = async () => {
		const { UR, UREncoder } = await import('@gandlaf21/bc-ur');

		const ur = UR.fromBuffer(Buffer.from(received));
		encoder = new UREncoder(ur, maxFragmentLength, firstSeqNum);
	};

	const lockNut = async () => {
		const decoded = getDecodedToken(nut);
		const wallet = new CashuWallet(new CashuMint(decoded.token[0].mint));
		try {
			isLoading = true;
			const receivedResp = await wallet.receive(nut, { pubkey: pubK });
			received = getEncodedToken(receivedResp.token);
            startLoop()
		} catch (error) {
			error = 'unexpected error: could not lock token';
		} finally {
			isLoading = false;
		}
	};
</script>

<div
	class="backdrop-blur-sm bg-[#0C0] bg-opacity-5 rounded-lg p-4 text-shadow drop-shadow text-[#0C0] relative border border-[#0C0] w-full max-w-2xl h-[600px] flex gap-4 flex-col"
>
	{#if isLoading}
    <div class="flex gap-3">
        <p>
            {'>'}
        </p>
        <p class="flex w-5 items-center justify-center">
            {currentLoadingChar}
        </p>
    </div>
    {:else if received}
    <div class="flex gap-3">
        <p>
            {'>'}
        </p>
        <Typewriter interval={2} keepCursorOnFinish={3000}>
            <h1 class="break-all">{received}</h1>
        </Typewriter>
    </div>
    <div class="w-80 h-80 drop-shadow">
        {@html svg}
    </div>

    {:else}
		<div class="flex gap-3">
			<p>
				{'>'}
			</p>
			<Typewriter interval={50} delay={1000} keepCursorOnFinish={3000}>
				<h1>Paste a nut below that you want to lock</h1>
			</Typewriter>
		</div>

		{#if mint}
			<div class="flex gap-3">
				<p>
					{'>'}
				</p>
				<Typewriter interval={20} delay={400} keepCursorOnFinish={3000}>
					<p>
						Mint: {mint} --- Amount: {amount} sats
						{memo ? ` ---- Memo: ${memo}` : ''}
					</p>
				</Typewriter>
			</div>
			<div class="flex gap-3">
				<p>
					{'>'}
				</p>
				<Typewriter interval={20} delay={4000} showCursorOnDelay={false} keepCursorOnFinish={3000}>
					<p>Paste Pub key to lock token to</p>
				</Typewriter>
			</div>
			{#if pubK}
				<div class="flex gap-3">
					<p>
						{'>'}
					</p>
					<Typewriter interval={20} delay={200} showCursorOnDelay={false} keepCursorOnFinish={3000}>
						<p>
							Locking to pubkey: {pubK}
						</p>
					</Typewriter>
				</div>
				<button class="btn btn-ghost rounded-lg border-primary" on:click={lockNut}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
							clip-rule="evenodd"
						/>
					</svg>
					Lock now
				</button>
			{:else}
				<input
					bind:value={pubK}
					on:input={readPubK}
					type="text"
					class="ml-4 input input-primary bg-black bg-opacity-35 rounded-lg text-primary border border-primary placeholder-primary placeholder-opacity-30"
					placeholder="0278aef2..."
				/>
			{/if}
		{:else}
			<input
				bind:value={nut}
				on:input={parseNut}
				type="text"
				class="ml-4 input input-primary bg-black bg-opacity-35 rounded-lg text-primary border border-primary placeholder-primary placeholder-opacity-30"
				placeholder="cashuAey..."
			/>
		{/if}
		{#if errorMessage}
			<div class="flex gap-3">
				<p>
					{'>'}
				</p>
				<Typewriter interval={20} keepCursorOnFinish={3000}>
					<h1>{errorMessage}</h1>
				</Typewriter>
			</div>
		{/if}
	{/if}
</div>
