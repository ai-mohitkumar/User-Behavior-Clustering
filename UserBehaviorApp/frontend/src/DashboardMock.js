/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { generateClusterData } from './generateClusterData.js';
import './DashboardStyles.css';

const Dashboard = () => {
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
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [clusterData, setClusterData] = useState([]);

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

  const handleAnalyze = async () => {
    if (records.length < 2) {
      alert('Please add at least 2 records to analyze');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Mock results for Vercel static deploy
      const mockResults = {
        algorithm: { selected: 'KMeans', scores: { kmeans: 0.85, dbscan: 0.72, hierarchical: 0.78 } },
        metrics: { silhouette: 0.7234, davies_bouldin: 0.6842, calinski_harabasz: 1456.32, icso_score: 12.45 },
        clusters: [
          { id: 0, label: 'Low Value', size: 28, percentage: 35.0, avg_spending: 92.5, avg_purchases: 1.8 },
          { id: 1, label: 'Medium Value', size: 32, percentage: 40.0, avg_spending: 185.2, avg_purchases: 4.2 },
          { id: 2, label: 'High Value', size: 20, percentage: 25.0, avg_spending: 412.8, avg_purchases: 11.5 },
        ],
        anomalies: { count: 4, percentage: 5.0 },
        recommendations: [
          { cluster_id: 0, cluster_label: 'Low Value', recommendations: ['Discounts', 'Free shipping'] },
          { cluster_id: 1, cluster_label: 'Medium Value', recommendations: ['Loyalty points', 'Upsell'] },
          { cluster_id: 2, cluster_label: 'High Value', recommendations: ['Premium products', 'VIP access'] },
        ],
      };
      setResults(mockResults);
      generateClusterData(mockResults);
      setMode('analysis');
      setLoading(false);
    }, 2000);
  };

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'];

  if (mode === 'input') {
    return (
      <div className="dashboard-upload">
        <div className="upload-background">
          <div className="upload-decoration decoration-1"></div>
          <div className="upload-decoration decoration-2"></div>
        </div>

        <div className="upload-container" style={{ maxWidth: '900px' }}>
          <div className="upload-header">
            <div className="upload-title-group">
              <span className="upload-icon">🔬</span>
              <h1 className="upload-title">User Behavior ML Analytics</h1>
            </div>
            <p className="upload-subtitle">Enter data for clustering (Vercel demo - mock analysis)</p>
          </div>

          <div className="upload-card">
            <div className="upload-content">
              <div className="field-manager">
                <h3 className="section-title">📋 Fields (e.g. total_spent, purchase_count)</h3>
                <div className="field-input-group">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addField()}
                    placeholder="New field name"
                    className="field-input"
                  />
                  <button onClick={addField} className="add-field-btn">
                    ➕ Add
                  </button>
                </div>
                <div className="fields-display">
                  {fields.map((field, idx) => (
                    <div key={idx} className="field-tag">
                      <span>{field}</span>
                      <button onClick={() => removeField(idx)} className="remove-field-btn">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {fields.length > 0 && (
                <div className="data-entry-section">
                  <h3 className="section-title">📊 Data Records (min 2)</h3>
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
                            <td className="row-num">{recordIdx + 1}</td>
                            {fields.map((field, fieldIdx) => (
                              <td key={fieldIdx}>
                                <input
                                  type="number"
                                  value={record[field] || ''}
                                  onChange={(e) => updateRecordField(recordIdx, field, e.target.value)}
                                  className="cell-input"
                                  placeholder="numeric value"
                                />
                              </td>
                            ))}
                            <td>
                              <button onClick={() => removeRecord(recordIdx)} className="delete-row-btn">
                                🗑️
                              </button>
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
              <p className="upload-info">
                🚀 Vercel demo - mock ML analysis with ICSO clustering. Local backend: localhost:8000
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analysis mode (same as before)
  const totalUsers = results.clusters.reduce((sum, c) => sum + c.size, 0);
  const avgSpending = (results.clusters.reduce((sum, c) => sum + c.avg_spending, 0) / results.clusters.length).toFixed(2);
  const avgOrders = (results.clusters.reduce((sum, c) => sum + c.avg_purchases, 0) / results.clusters.length).toFixed(1);

  return (
    <div className="dashboard-main">
      <div className="dashboard-background">
        <div className="dashboard-decoration decoration-1"></div>
        <div className="dashboard-decoration decoration-2"></div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <span className="dashboard-title-icon">⚡</span>
            <h1>Analysis Complete!</h1>
          </div>
          <button className="new-analysis-button" onClick={() => setResults(null)}>
            🔄 New Analysis
          </button>
        </div>
        <div className="metrics-grid">
          {[
            { label: 'TOTAL USERS', value: totalUsers, icon: '👥', color: 'metric-blue' },
            { label: 'AVG SPENDING', value: '$' + avgSpending, icon: '$', color: 'metric-green' },
            { label: 'AVG ORDERS', value: avgOrders, icon: '🛒', color: 'metric-orange' },
            { label: 'ICSO SCORE', value: results.metrics.icso_score.toFixed(2), icon: '📈', color: 'metric-purple' },
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
        {/* Rest of analysis UI remains same */}
        <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '20px' }}>
          Vercel demo - mock data. Full backend on local:8000
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
