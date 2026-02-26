/**
 * Example usage of the VTL Email Service API
 */

const API_BASE = 'http://localhost:3000';

// Example 1: Add email to waitlist
async function addToWaitlist(email, site) {
  try {
    const response = await fetch(`${API_BASE}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, site })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add email');
    }

    const data = await response.json();
    console.log('✅ Email added successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Example 2: Get emails for a site
async function getEmails(site) {
  try {
    const response = await fetch(`${API_BASE}/api/waitlist?site=${encodeURIComponent(site)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }

    const data = await response.json();
    console.log(`📧 Emails for ${site} (${data.count}):`);
    data.emails.forEach(email => {
      console.log(`  - ${email.email} (added: ${email.created_at})`);
    });
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Example 3: Export emails as CSV
async function exportToCSV(site) {
  try {
    const response = await fetch(`${API_BASE}/api/waitlist?site=${encodeURIComponent(site)}&export=true`);

    if (!response.ok) {
      throw new Error('Failed to export emails');
    }

    const csv = await response.text();
    console.log('📊 CSV Export:');
    console.log(csv);
    return csv;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Example 4: Health check
async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`);

    if (!response.ok) {
      throw new Error('Service not responding');
    }

    const data = await response.json();
    console.log('🏥 Health Check:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    console.log('=== VTL Email Service API Examples ===\n');

    // Health check
    await healthCheck();
    console.log();

    // Add emails
    await addToWaitlist('test1@example.com', 'mysite.com');
    await addToWaitlist('test2@example.com', 'mysite.com');
    await addToWaitlist('test3@example.com', 'anothersite.com');
    console.log();

    // Get emails
    await getEmails('mysite.com');
    console.log();

    // Get another site
    await getEmails('anothersite.com');
    console.log();

    // Export CSV
    await exportToCSV('mysite.com');
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
})();
