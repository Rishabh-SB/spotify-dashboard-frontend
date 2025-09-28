'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  processTopEntities, 
  processTimeBasedData, 
  processUserBehaviorData, 
  processPlatformData, 
  processSessionData 
} from '../lib/data';
import styles from './page.module.css';

// Loading component for dynamic imports
const ChartLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    color: '#666'
  }}>
    Loading chart...
  </div>
);

// Dynamically import chart components to prevent SSR issues
const Section1Charts = dynamic(() => import('../components/Section1Charts'), { 
  ssr: false,
  loading: () => <ChartLoading />
});
const Section2Charts = dynamic(() => import('../components/Section2Charts'), { 
  ssr: false,
  loading: () => <ChartLoading />
});
const Section3Charts = dynamic(() => import('../components/Section3Charts'), { 
  ssr: false,
  loading: () => <ChartLoading />
});
const Section4Charts = dynamic(() => import('../components/Section4Charts'), { 
  ssr: false,
  loading: () => <ChartLoading />
});
const Section5Charts = dynamic(() => import('../components/Section5Charts'), { 
  ssr: false,
  loading: () => <ChartLoading />
});

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load data from reply.json
    fetch('/reply.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your Spotify analytics...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your Spotify analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.error}>
        <h2>No data available</h2>
        <p>Please ensure reply.json is available in the public directory.</p>
      </div>
    );
  }

  // Process data with error handling
  let topEntitiesData, timeBasedData, userBehaviorData, platformData, sessionData;
  
  try {
    topEntitiesData = processTopEntities(data);
    timeBasedData = processTimeBasedData(data);
    userBehaviorData = processUserBehaviorData(data);
    platformData = processPlatformData(data);
    sessionData = processSessionData(data);
  } catch (error) {
    console.error('Error processing data:', error);
    setError('Error processing analytics data. Please check the data format.');
    return (
      <div className={styles.error}>
        <h2>Data Processing Error</h2>
        <p>Error processing analytics data. Please check the data format.</p>
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>🎵 Spotify Analytics Dashboard</h1>
        <p>Your personal music listening insights</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Section 1: Top Entities</h2>
          <Section1Charts data={topEntitiesData} />
        </section>

        <section className={styles.section}>
          <h2>Section 2: Time-Based Listening Patterns</h2>
          <Section2Charts data={timeBasedData} />
        </section>

        <section className={styles.section}>
          <h2>Section 3: User Behavior & Exploration</h2>
          <Section3Charts data={userBehaviorData} />
        </section>

        <section className={styles.section}>
          <h2>Section 4: Platform Usage</h2>
          <Section4Charts data={platformData} />
        </section>

        <section className={styles.section}>
          <h2>Section 5: Session Metrics</h2>
          <Section5Charts data={sessionData} />
        </section>
      </main>
    </div>
  );
}
