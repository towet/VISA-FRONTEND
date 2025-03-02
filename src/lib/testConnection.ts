import { supabase } from './supabase';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('companies').select('count');
    
    if (error) {
      console.error('Connection test failed:', error);
      return;
    }
    
    console.log('Connection successful! Data:', data);
  } catch (error) {
    console.error('Error during connection test:', error);
  }
}

testConnection();
