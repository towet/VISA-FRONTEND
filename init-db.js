import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qbwuycspbjmqmlmvpwnt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFid3V5Y3NwYmptcW1sbXZwd250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNjU0NDAsImV4cCI6MjA1MTY0MTQ0MH0.YuzWiQIKL9QzwZFAK99_Gfia6esTUEYL-SG9-BOCR9A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    // Create users table with SQL
    const createUsersTable = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          full_name VARCHAR(255),
          position VARCHAR(50),
          assigned_companies INTEGER[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (createUsersTable.error) {
      console.error('Error creating users table:', createUsersTable.error);
    } else {
      console.log('Users table created or already exists');
    }

    // Create companies table
    const { error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);

    if (companiesError) {
      console.log('Creating companies table...');
      // Create companies table with SQL
      const createCompaniesTable = await supabase.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            image TEXT,
            workingHours VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });

      if (createCompaniesTable.error) {
        console.error('Error creating companies table:', createCompaniesTable.error);
      } else {
        console.log('Companies table created successfully');
        
        // Insert initial companies data
        await supabase.from('companies').insert([
          {
            name: 'Torkin Manes LLP',
            image: 'https://media.licdn.com/dms/image/v2/D5622AQHAkDlBaPaGOQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1684941018254?e=2147483647&v=beta&t=9pA6_rS3hb_Ae2Rn655pO83DkPQF6AEBrob-bflFjCg',
            description: 'Torkin Manes LLP is a leading law firm where you will be hired to manage reception duties, greet clients, and maintain the organization of office spaces. In this role, you will be hired to answer the main switchboard and provide excellent customer service.',
            location: 'Toronto',
            workingHours: '9:00 AM to 5:00 PM, Monday to Friday'
          },
          {
            name: 'Medicentres Canada Inc',
            image: 'https://np.naukimg.com/cphoto/l4sFXqBsXnc4xYoO2O8LQoX5A4WlqVG8j6Hs5hczcqe+ZCY3HlMvVOHWwm4tWcieRn8/qiKUQ8l9WmuA8ozp9JKV4yBLXxcPmC3U9zBT7/jxvD6mcmnZYjVj7jMwDix5sF',
            description: 'Medicentres operates medical clinics across Canada, and you will be hired to greet patients, schedule appointments, and handle administrative tasks. In this position, you will be hired to interact with patients and ensure a smooth flow of operations within the clinic.',
            location: 'Ontario',
            workingHours: '8:00 AM to 4:00 PM or 9:00 AM to 5:00 PM'
          },
          {
            name: 'Brandt Group of Companies',
            image: 'https://www.brandt.ca/getmedia/d08a5445-9c3f-4e63-8f08-a4d6c4ad7bb5/Brandt-Rallies-Community-Show-They-Care-1140x720.jpg.aspx?width=1440&height=720&ext=.jpg',
            description: 'Brandt Group is a diverse company involved in various sectors including agriculture and construction. You will be hired to manage front desk operations, answer phones, and assist with administrative tasks within the office.',
            location: 'Regina, Saskatchewan',
            workingHours: '8:00 AM to 5:00 PM, Monday to Friday'
          }
        ]);
      }
    }

    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
