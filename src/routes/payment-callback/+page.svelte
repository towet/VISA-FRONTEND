<!-- payment-callback/+page.svelte -->
<script lang="ts">
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { checkTransactionStatus } from '$lib/pesapal';

let status = 'Processing payment...';
let error = '';

onMount(async () => {
  try {
    // Get order tracking ID from URL
    const orderTrackingId = $page.url.searchParams.get('OrderTrackingId');
    if (!orderTrackingId) {
      throw new Error('No order tracking ID found');
    }

    // Check transaction status
    const result = await checkTransactionStatus(orderTrackingId);
    status = `Payment ${result.payment_status_description}`;

    // Close window after 5 seconds
    setTimeout(() => {
      window.close();
    }, 5000);
  } catch (e) {
    error = e.message;
  }
});
</script>

<div class="flex min-h-screen items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-lg text-center">
    <h2 class="text-2xl font-bold mb-4">Payment Status</h2>
    {#if error}
      <p class="text-red-500">{error}</p>
    {:else}
      <p>{status}</p>
      <p class="text-sm text-gray-500 mt-2">This window will close automatically in 5 seconds...</p>
    {/if}
  </div>
</div>
