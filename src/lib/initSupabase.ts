import { supabase } from './supabase';

const initialCompanies = [
  {
    name: 'Torkin Manes LLP',
    image: 'https://media.licdn.com/dms/image/v2/D5622AQHAkDlBaPaGOQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1684941018254?e=2147483647&v=beta&t=9pA6_rS3hb_Ae2Rn655pO83DkPQF6AEBrob-bflFjCg',
    description: 'Torkin Manes LLP is a leading law firm where you will be hired to manage reception duties, greet clients, and maintain the organization of office spaces. In this role, you will be hired to answer the main switchboard and provide excellent customer service.',
    location: 'Toronto',
    working_hours: '9:00 AM to 5:00 PM, Monday to Friday'
  },
  {
    name: 'Medicentres Canada Inc',
    image: 'https://np.naukimg.com/cphoto/l4sFXqBsXnc4xYoO2O8LQoX5A4WlqVG8j6Hs5hczcqe+ZCY3HlMvVOHWwm4tWcieRn8/qiKUQ8l9WmuA8ozp9JKV4yBLXxcPmC3U9zBT7/jxvD6mcmnZYjVj7jMwDix5sF',
    description: 'Medicentres operates medical clinics across Canada, and you will be hired to greet patients, schedule appointments, and handle administrative tasks. In this position, you will be hired to interact with patients and ensure a smooth flow of operations within the clinic.',
    location: 'Ontario',
    working_hours: '8:00 AM to 4:00 PM or 9:00 AM to 5:00 PM'
  },
  {
    name: 'Brandt Group of Companies',
    image: 'https://www.brandt.ca/getmedia/d08a5445-9c3f-4e63-8f08-a4d6c4ad7bb5/Brandt-Rallies-Community-Show-They-Care-1140x720.jpg.aspx?width=1440&height=720&ext=.jpg',
    description: 'Brandt Group is a diverse company involved in various sectors including agriculture and construction. You will be hired to manage front desk operations, answer phones, and assist with administrative tasks within the office.',
    location: 'Regina, Saskatchewan',
    working_hours: '8:00 AM to 5:00 PM, Monday to Friday'
  }
];

export async function initializeDatabase() {
  console.log('Starting database initialization...');
  
  try {
    // First, check if we can access the companies table
    const { error: accessError } = await supabase
      .from('companies')
      .select('count')
      .single();

    if (accessError) {
      console.error('Error accessing companies table:', accessError);
      return;
    }

    // Check if companies table is empty
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');

    if (companiesError) {
      console.error('Error checking companies:', companiesError);
      return;
    }

    console.log('Current companies count:', companies?.length || 0);

    // If no companies exist, insert the initial companies
    if (!companies || companies.length === 0) {
      console.log('No companies found, inserting initial data...');
      
      // Insert companies one by one to better handle errors
      for (const company of initialCompanies) {
        const { error: insertError } = await supabase
          .from('companies')
          .insert([company]);

        if (insertError) {
          console.error('Error inserting company:', company.name, insertError);
        } else {
          console.log('Successfully inserted company:', company.name);
        }
      }

      // Verify companies were inserted
      const { data: verifyData, error: verifyError } = await supabase
        .from('companies')
        .select('*');

      if (verifyError) {
        console.error('Error verifying companies:', verifyError);
      } else {
        console.log('Final companies count:', verifyData?.length || 0);
      }
    } else {
      console.log('Companies already exist, skipping initialization');
    }
  } catch (error) {
    console.error('Error in database initialization:', error);
  }
}
