/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import './DashboardStyles.css';

const MLAnalyticsDirect = () => {
  const [clusterData, setClusterData] = useState([]);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const results = {
    metrics: { silhouette: 0.7234, icso_score: 12.45, davies_bouldin: 0.68 },
    elbow: {
      data: [
        {k: 2, wcss: 250, silhouette: 62},
        {k: 3, wcss: 180, silhouette: 72},
        {k: 4, wcss: 121, silhouette: 68},
        {k: 5, wcss: 95, silhouette: 61},
        {k: 6, wcss: 82, silhouette: 55},
        {k: 7, wcss: 76, silhouette: 48},
        {k: 8, wcss: 72, silhouette: 42}
      ]
    },
    clusters: [
      {label: 'Low Value', points: 35, x: 100, y: 2, color: colors[0]},
      {label: 'Medium Value', points: 40, x: 200, y: 5, color: colors[1]},
      {label: 'High Value', points: 25, x: 450, y: 12, color: colors[2]}
    ],
    lda_clusters: [
      {label: 'Budget', value: 35},
      {label: 'Regular', value: 40},
      {label: 'VIP', value: 25}
    ],
    algo_scores: [
      {algo: 'KMeans', score: 85},
      {algo: 'DBSCAN', score: 72},
      {algo: 'Hierarchical', score: 78}
    ]
  };

useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Generate PCA points
    const data = [];
    results.clusters.forEach(cluster => {
      for (let i = 0; i < 20; i++) {
        data.push({
          x: cluster.x + (Math.random() - 0.5) * 100,
          y: cluster.y + (Math.random() - 0.5) * 3,
          cluster: cluster.label,
          fill: cluster.color
        });
      }
    });
    setClusterData(data);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', color: 'white' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠 ML Clustering Analysis</h1>
          <p>Elbow | PCA Clusters | LDA | Accuracy | ICSO Metrics</p>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr' }}>
          {/* Elbow Plot */}
          <div className="chart-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>📉 Elbow Method (Optimal k=3)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.elbow.data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="k" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Line type="monotone" dataKey="wcss" stroke="#ef4444" name="WCSS" strokeWidth={3} />
                <Line type="monotone" dataKey="silhouette" stroke="#3b82f6" name="Silhouette %" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* LDA Pie */}
          <div className="chart-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>🎯 LDA Clusters</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={results.lda_clusters} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
                  {results.lda_clusters.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '2fr 1fr', marginTop: '2rem' }}>
          {/* PCA Scatter */}
          <div className="chart-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>📊 PCA Clusters (Spending vs Purchases)</h2>
            <ResponsiveContainer width="100%" height={450}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="x" name="Avg Spending ($)" stroke="white" />
                <YAxis dataKey="y" name="Avg Purchases" stroke="white" />
                <Tooltip />
                <Legend />
                {results.clusters.map((cluster, idx) => (
                  <Scatter 
                    key={idx}
                    data={clusterData.filter(d => d.cluster === cluster.label)}
                    fill={cluster.color}
                    name={cluster.label}
                    shape="circle"
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Algorithm Accuracy */}
          <div className="chart-card" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem' }}>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>📈 Algorithm Accuracy</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.algo_scores}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="algo" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Bar dataKey="score">
                  {results.algo_scores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ background: 'rgba(59,130,246,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>⭐ Silhouette Score</h3>
            <div style={{ fontSize: '2rem', color: '#3b82f6', fontWeight: 'bold' }}>{results.metrics.silhouette.toFixed(4)}</div>
          </div>
          <div style={{ background: 'rgba(139,92,246,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>🔬 ICSO Score</h3>
            <div style={{ fontSize: '2rem', color: '#8b5cf6', fontWeight: 'bold' }}>{results.metrics.icso_score.toFixed(2)}</div>
          </div>
          <div style={{ background: 'rgba(236,72,153,0.2)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>⚠️ Anomalies</h3>
            <div style={{ fontSize: '2rem', color: '#ec4899', fontWeight: 'bold' }}>{results.anomalies.percentage}%</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#9ca3af' }}>
          <p>Production ML Demo - Elbow | PCA | LDA | ICSO Optimized</p>
        </div>
      </div>
    </div>
  );
};

export default MLAnalyticsDirect;

