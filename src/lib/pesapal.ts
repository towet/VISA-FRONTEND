// Pesapal API configuration
export const PESAPAL_CONFIG = {
  PAYMENT_URL: 'https://visaexpert-api.netlify.app/api/payment',
};

interface PesapalOrderRequest {
  amount: number;
  description: string;
  email_address: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
}

function generateOrderId() {
  // Format: ORD-YYMMDDHHMM-XXXXX
  const now = new Date();
  const datePart = now.toISOString()
    .slice(2,16)
    .replace(/[-:T]/g, '')
    .toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${datePart}-${random}`;
}

function formatPhoneNumber(phone: string | undefined) {
  if (!phone) return '';
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If it starts with 0, replace with 254
  if (digits.startsWith('0')) {
    return '254' + digits.slice(1);
  }
  // If it starts with +, remove the +
  if (digits.startsWith('254')) {
    return digits;
  }
  return '254' + digits;
}

export async function createPesapalOrder(orderData: {
  amount: number;
  email: string;
  description: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}) {
  try {
    // Construct the payment URL with parameters
    const params = new URLSearchParams({
      amount: orderData.amount.toString(),
      description: orderData.description,
      email: orderData.email,
      first_name: orderData.firstName || '',
      last_name: orderData.lastName || '',
      phone: orderData.phoneNumber || ''
    });

    const paymentUrl = `${PESAPAL_CONFIG.PAYMENT_URL}?${params.toString()}`;
    
    return {
      redirect_url: paymentUrl,
      order_tracking_id: Date.now().toString() // Placeholder tracking ID
    };
  } catch (error) {
    console.error('Error creating PesaPal order:', error);
    throw error;
  }
}

export async function checkTransactionStatus(orderTrackingId: string) {
  try {
    const response = await fetch(`${PESAPAL_CONFIG.PROXY_URL}/status?orderTrackingId=${orderTrackingId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
}
