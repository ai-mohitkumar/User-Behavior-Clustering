/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './DashboardStyles.css';

const DashboardFixed = () => {
  const [mode, setMode] = useState('input');
  const [fields, setFields] = useState(['total_spent', 'purchase_count']);
  const [newFieldName, setNewFieldName] = useState('');
  const [records, setRecords] = useState([
    { total_spent: '150', purchase_count: '5' },
    { total_spent: '250', purchase_count: '8' },
    { total_spent: '80', purchase_count: '2' },
    { total_spent: '450', purchase_count: '12' },
    { total_spent: '120', purchase_count: '3' },
    { total_spent: '320', purchase_count: '9' },
    { total_spent: '90', purchase_count: '1' },
    { total_spent: '580', purchase_count: '15' },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [clusterData, setClusterData] = useState([]);

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'];

  // Generate cluster data
  const generateClusterData = (results) => {
    const data = [];
    results.clusters.forEach((cluster, clusterIdx) => {
      for (let i = 0; i < cluster.size; i++) {
        data.push({
          x: cluster.avg_spending + (Math.random() - 0.5) * 200,
          y: cluster.avg_purchases + (Math.random() - 0.5) * 2,
          z: Math.random() * 100,
          cluster: clusterIdx,
          label: cluster.label
        });
      }
    });
    setClusterData(data);
    return data;
  };

  const addField = () => {
    if (newFieldName.trim()) {
      setFields([...fields, newFieldName.trim()]);
      setRecords(records.map(r => ({ ...r, [newFieldName.trim()]: '' })));
      setNewFieldName('');
    }
  };

  const removeField = (fieldIndex) => {
    const fieldName = fields[fieldIndex];
    setFields(fields.filter((_, i) => i !== fieldIndex));
    setRecords(records.map(r => {
      const { [fieldName]: _, ...rest } = r;
      return rest;
    }));
  };

  const addRecord = () => {
    const newRecord = {};
    fields.forEach(f => newRecord[f] = '');
    setRecords([...records, newRecord]);
  };

  const removeRecord = (recordIndex) => {
    setRecords(records.filter((_, i) => i !== recordIndex));
  };

  const updateRecordField = (recordIndex, fieldName, value) => {
    const newRecords = [...records];
    newRecords[recordIndex][fieldName] = value;
    setRecords(newRecords);
  };

  const handleAnalyze = () => {
    if (records.length < 2) {
      alert('Please add at least 2 records to analyze');
      return;
    }

    setLoading(true);

    // Simulate analysis
    setTimeout(() => {
const mockResults = {
        algorithm: { selected: 'KMeans (k=3)', scores: { 'KMeans': 0.85, 'DBSCAN': 0.72, 'Hierarchical': 0.78 } },
        metrics: { silhouette: 0.7234, davies_bouldin: 0.6842, calinski_harabasz: 1456.32, icso_score: 12.45 },
        elbow: {
          k_values: [2,3,4,5,6,7,8],
          wcss: [250.5, 180.2, 120.8, 95.4, 82.1, 75.6, 72.3],
          silhouette_scores: [0.62, 0.7234, 0.68, 0.61, 0.55, 0.48, 0.42]
        },
        clusters: [
        algorithm: { selected: 'KMeans (k=3)', scores: { 'KMeans': 0.85, 'DBSCAN': 0.72, 'Hierarchical': 0.78 } },
        metrics: { silhouette: 0.7234, davies_bouldin: 0.6842, calinski_harabasz: 1456.32, icso_score: 12.45 },
        clusters: [
          { id: 0, label: 'Low Value Customers', size: 28, percentage: 35.0, avg_spending: 92.5, avg_purchases: 1.8 },
          { id: 1, label: 'Medium Value Customers', size: 32, percentage: 40.0, avg_spending: 185.2, avg_purchases: 4.2 },
          { id: 2, label: 'High Value Customers', size: 20, percentage: 25.0, avg_spending: 412.8, avg_purchases: 11.5 },
        ],
        anomalies: { count: 4, percentage: 5.0 },
        lda_clusters: [
          { id: 0, label: 'Budget Shoppers', size: 25, avg_spent: 65.2 },
          { id: 1, label: 'Regular Buyers', size: 45, avg_spent: 180.5 },
          { id: 2, label: 'VIP Customers', size: 30, avg_spent: 450.1 }
        ],
        recommendations: {
          0: ['Budget products', 'Discounts', 'Free shipping'],
          1: ['Loyalty program', 'Bundle offers', 'Upsell products'],
          2: ['Premium products', 'VIP access', 'Personalized service']
        }
      };
      setResults(mockResults);
      generateClusterData(mockResults);
      setMode('analysis');
      setLoading(false);
    }, 2500);
  };

  const handleNewAnalysis = () => {
    setMode('input');
    setResults(null);
    setClusterData([]);
  };

  if (mode === 'input') {
    return (
      <div className="dashboard-upload">
        <div className="upload-background">
          <div className="upload-decoration decoration-1"></div>
          <div className="upload-decoration decoration-2"></div>
        </div>
        <div className="upload-container">
          <div className="upload-header">
            <div className="upload-title-group">
              <span className="upload-icon">🔬</span>
              <h1 className="upload-title">ML Data Analytics Platform</h1>
            </div>
            <p className="upload-subtitle">Enter user behavior data for clustering analysis</p>
          </div>
          <div className="upload-card">
            <div className="upload-content">
              <div className="field-manager">
                <h3 className="section-title">📋 Data Fields</h3>
                <div className="field-input-group">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="e.g. total_spent, purchase_count"
                    className="field-input"
                  />
                  <button onClick={addField} className="add-field-btn">
                    ➕
                  </button>
                </div>
                <div className="fields-display">
                  {fields.map((field, idx) => (
                    <div key={idx} className="field-tag">
                      <span>{field}</span>
                      <button onClick={() => removeField(idx)} className="remove-field-btn">✕</button>
                    </div>
                  ))}
                </div>
              </div>
              {fields.length > 0 && (
                <div className="data-entry-section">
                  <h3 className="section-title">📊 User Records</h3>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {fields.map((field, idx) => <th key={idx}>{field}</th>)}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record, recordIdx) => (
                          <tr key={recordIdx}>
                            <td>{recordIdx + 1}</td>
                            {fields.map((field, fieldIdx) => (
                              <td key={fieldIdx}>
                                <input
                                  type="number"
                                  value={record[field] || ''}
                                  onChange={(e) => updateRecordField(recordIdx, field, e.target.value)}
                                  className="cell-input"
                                />
                              </td>
                            ))}
                            <td>
                              <button onClick={() => removeRecord(recordIdx)} className="delete-row-btn">🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="button-group">
                <button onClick={addRecord} className="secondary-button" disabled={fields.length === 0}>
                  ➕ Add Record
                </button>
                <button onClick={handleAnalyze} disabled={loading || records.length < 2} className={`analyze-button ${loading || records.length < 2 ? 'disabled' : 'enabled'}`}>
                  <span className="button-icon">⚡</span>
                  {loading ? 'Analyzing...' : 'Run ML Analysis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis mode - full dashboard with graphs
  const totalUsers = results.clusters.reduce((sum, c) => sum + c.size, 0);

  const algoData = Object.entries(results.algorithm.scores).map(([name, score]) => ({
    name,
    score: score * 100
  }));

  const clusterPieData = results.clusters.map((cluster, idx) => ({
    name: cluster.label,
    value: cluster.percentage,
    fill: colors[idx % colors.length]
  }));

  return (
    <div className="dashboard-main">
      <div className="dashboard-background">
        <div className="upload-decoration decoration-1"></div>
        <div className="upload-decoration decoration-2"></div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <span className="dashboard-title-icon">✅</span>
            <h1>Analysis Complete!</h1>
          </div>
          <button className="new-analysis-button" onClick={handleNewAnalysis}>
            🔄 New Analysis
          </button>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          {[
            { label: 'Total Users', value: totalUsers.toLocaleString(), icon: '👥', color: 'metric-blue' },
            { label: 'ICSO Score', value: results.metrics.icso_score.toFixed(2), icon: '📈', color: 'metric-purple' },
            { label: 'Silhouette', value: results.metrics.silhouette.toFixed(4), icon: '⭐', color: 'metric-green' },
            { label: 'Anomalies', value: `${results.anomalies.percentage}%`, icon: '⚠️', color: 'metric-orange' },
          ].map((metric, idx) => (
            <div key={idx} className={`metric-card ${metric.color}`}>
              <div className="metric-header">
                <p className="metric-label">{metric.label}</p>
                <span className="metric-icon">{metric.icon}</span>
              </div>
              <p className="metric-value">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Scatter Plot */}
          <div className="chart-card">
            <h2 className="card-title">📊 User Clusters (PCA Projection)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="x" name="Spending" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="y" name="Purchases" stroke="rgba(255,255,255,0.5)" />
                <Tooltip />
                <Legend />
                {results.clusters.map((cluster, idx) => (
                  <Scatter 
                    key={idx} 
                    data={clusterData.filter(d => d.cluster === idx)} 
                    fill={colors[idx]}
                    name={cluster.label}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Algorithm Bar */}
          <div className="chart-card">
            <h2 className="card-title">🤖 Algorithm Scores</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={algoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="score">
                  {algoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cluster Pie */}
        <div className="chart-card">
          <h2 className="card-title">📈 Cluster Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={clusterPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {clusterPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics and Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="detail-card">
            <h3>📊 Quality Metrics</h3>
            <div className="metrics-list">
              <div className="metric-item">
                <span>Silhouette Score</span>
                <strong>{results.metrics.silhouette.toFixed(4)}</strong>
              </div>
              <div className="metric-item">
                <span>Davies-Bouldin</span>
                <strong>{results.metrics.davies_bouldin.toFixed(4)}</strong>
              </div>
              <div className="metric-item">
                <span>Calinski-Harabasz</span>
                <strong>{results.metrics.calinski_harabasz.toFixed(0)}</strong>
              </div>
              <div className="metric-item icso">
                <span>🔬 ICSO Score</span>
                <strong>{results.metrics.icso_score.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          <div className="detail-card">
            <h3>🎯 Actionable Insights</h3>
            <ul style={{ color: '#e5e7eb', fontSize: '0.875rem' }}>
              <li>• High-value cluster (25%): Premium products & VIP service</li>
              <li>• Medium cluster (40%): Loyalty programs & bundles</li>
              <li>• Low-value cluster (35%): Discounts & free shipping</li>
              <li>• 5% anomalies need attention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFixed;
