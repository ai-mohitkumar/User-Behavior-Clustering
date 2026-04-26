
import React, { useState, useEffect } from 'react';
import { generateClusterData } from './generateClusterData.js';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import './DashboardStyles.css';

const DashboardComplete = () => {

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clusterData, setClusterData] = useState([]);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  useEffect(() => {
    if (results?.clusters) {
      setClusterData(generateClusterData(results));
    }
  }, [results]);



  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      const mockResults = {
        algorithm: { selected: 'KMeans k=3', scores: { 'KMeans': 0.85, 'DBSCAN': 0.72, 'Hierarchical': 0.78 } },
        metrics: { silhouette: 0.7234, davies_bouldin: 0.6842, calinski_harabasz: 1456, icso_score: 12.45 },
        elbow: {
          k_values: [2,3,4,5,6,7,8],
          wcss: [250, 180, 121, 95, 82, 76, 72],
          silhouette_scores: [0.62, 0.72, 0.68, 0.61, 0.55, 0.48, 0.42]
        },
        lda_clusters: [
          { id: 0, label: 'Budget', size: 25, avg_spent: 65 },
          { id: 1, label: 'Regular', size: 45, avg_spent: 180 },
          { id: 2, label: 'VIP', size: 30, avg_spent: 450 }
        ],
        clusters: [
          { id: 0, label: 'Low Value', size: 28, percentage: 35, avg_spending: 92, avg_purchases: 1.8 },
          { id: 1, label: 'Medium Value', size: 32, percentage: 40, avg_spending: 185, avg_purchases: 4.2 },
          { id: 2, label: 'High Value', size: 20, percentage: 25, avg_spending: 413, avg_purchases: 11.5 }
        ],
        anomalies: { count: 4, percentage: 5 }
      };
      setResults(mockResults);
      setLoading(false);
    }, 2500);
  };



  // Analysis mode
  const elbowData = results.elbow ? results.elbow.k_values.map((k, i) => ({
    k: k,
    wcss: results.elbow.wcss[i],
    silhouette: results.elbow.silhouette_scores[i] * 100
  })) : [];

  return (
    <div className="dashboard-main">
      {results ? (
        <>
          <button onClick={() => setResults(null)} style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>New Analysis</button>
          <div className="dashboard-container">
            <h1 style={{ color: 'white', textAlign: 'center' }}>ML Analysis Results</h1>
            
            {/* Elbow Method */}
            <div className="chart-card">
              <h2>📉 Elbow Method (Optimal k=3)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={elbowData}>
                  <Line type="monotone" dataKey="wcss" stroke="#ef4444" name="WCSS" />
                  <Line type="monotone" dataKey="silhouette" stroke="#3b82f6" name="Silhouette" />
                  <XAxis dataKey="k" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* PCA Clusters */}
            <div className="chart-card">
              <h2>📊 PCA Clusters</h2>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Spending" />
                  <YAxis dataKey="y" name="Purchases" />
                  <Tooltip />
                  <Legend />
                  {results.clusters.map((cluster, idx) => (
                    <Scatter key={idx} data={clusterData.filter(d => d.cluster === idx)} fill={colors[idx]} name={cluster.label} />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* LDA Clusters */}
            <div className="chart-card">
              <h2>🎯 LDA Clusters</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={results.lda_clusters.map((c, i) => ({ name: c.label, value: c.size, fill: colors[i] }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
              <div>Silhouette: {results.metrics.silhouette.toFixed(4)}</div>
              <div>ICSO Score: {results.metrics.icso_score.toFixed(2)}</div>
              <div>Anomalies: {results.anomalies.percentage}%</div>
            </div>
          </div>
        </>
      ) : (
        <div className="dashboard-main">
          <button onClick={handleAnalyze} className="analyze-btn" disabled={loading}>
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardComplete;
