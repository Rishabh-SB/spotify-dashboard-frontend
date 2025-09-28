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

const Section1Charts = dynamic(() => import('../components/Section1Charts'), { ssr: false, loading: () => <ChartLoading /> });
const Section2Charts = dynamic(() => import('../components/Section2Charts'), { ssr: false, loading: () => <ChartLoading /> });
const Section3Charts = dynamic(() => import('../components/Section3Charts'), { ssr: false, loading: () => <ChartLoading /> });
const Section4Charts = dynamic(() => import('../components/Section4Charts'), { ssr: false, loading: () => <ChartLoading /> });
const Section5Charts = dynamic(() => import('../components/Section5Charts'), { ssr: false, loading: () => <ChartLoading /> });

const inlineStyles = {
  uploadForm: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    background: 'var(--background)',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgb(0 0 0 / 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: '600',
    color: 'var(--foreground)',
    fontSize: '1.1rem'
  },
  input: {
    marginTop: '0.4rem',
    padding: '0.5rem 0.8rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #bbb',
    background: '#f9f9f9',
    color: 'black',
    transition: 'border 0.2s ease, background 0.2s ease'
  },
  button: {
    padding: '0.75rem 1.2rem',
    fontSize: '1.1rem',
    borderRadius: '6px',
    border: 'none',
    background: '#667eea',
    color: 'white',
    fontWeight: '700',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    boxShadow: '0 2px 8px rgb(102 126 234 / 0.6)',
    transition: 'background 0.3s ease'
  }
}

export default function Home() {
  const [files, setFiles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datasetId, setDatasetId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError("Please select one or more JSON files to upload.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select start and end dates.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);

    try {
      const response = await fetch('http://spotifydashboardbackend-production.up.railway.app/upload/', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload files');
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setDatasetId(result.dataset_id);
      fetchMetrics(result.dataset_id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchMetrics = async (id) => {
    try {
      const url = new URL(`https://spotifydashboardbackend-production.up.railway.app/metrics/${id}`);
      if (startDate) url.searchParams.append("start_date", startDate);
      if (endDate) url.searchParams.append("end_date", endDate);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const metricsData = await response.json();
      setData(metricsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1>🎵 Spotify Analytics Dashboard</h1>
          <p>Upload your JSON data files to get started</p>
        </header>
        <main className={styles.main}>
          <div style={inlineStyles.uploadForm}>
            <label style={inlineStyles.label}>
              Select JSON files (multiple allowed):
              <input 
                type="file" 
                multiple 
                accept=".json" 
                onChange={handleFileChange} 
                style={inlineStyles.input}
              />
            </label>

            <label style={inlineStyles.label}>
              Start Date:
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                style={inlineStyles.input}
              />
            </label>

            <label style={inlineStyles.label}>
              End Date:
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                style={inlineStyles.input}
              />
            </label>

            <button onClick={uploadFiles} style={inlineStyles.button}>
              Upload & Load Metrics
            </button>
          </div>
        </main>
      </div>
    );
  }

  let topEntitiesData, timeBasedData, userBehaviorData, platformData, sessionData;

  try {
    topEntitiesData = processTopEntities(data);
    timeBasedData = processTimeBasedData(data);
    userBehaviorData = processUserBehaviorData(data);
    platformData = processPlatformData(data);
    sessionData = processSessionData(data);
  } catch (error) {
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
