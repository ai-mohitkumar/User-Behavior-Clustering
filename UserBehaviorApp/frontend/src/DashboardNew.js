/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { generateClusterData } from './generateClusterData.js';
import './DashboardStyles.css';

const Dashboard = () => {
  const [mode, setMode] = useState('input'); // 'input' or 'analysis'
  const [fields, setFields] = useState(['value1', 'value2']);
  const [newFieldName, setNewFieldName] = useState('');
  const [records, setRecords] = useState([{ value1: '', value2: '' }]);
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
    try {
      // Convert records to CSV format
      const csvContent = [
        fields.join(','),
        ...records.map(r => fields.map(f => r[f]).join(','))
      ].join('\n');

      // Create CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'data.csv', { type: 'text/csv' });

      const formData = new FormData();
formData.append('file', file);\n\n      const response = await fetch('http://127.0.0.1:8000/analyze-intelligent', {\n        method: 'POST',\n        body: formData,\n      });\n
      });

      const data = await response.json();
      setResults(data);
      generateClusterData(data);
      setMode('analysis');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'];

  // ============================ INPUT MODE ============================
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
              <h1 className="upload-title">ML Data Analytics</h1>
            </div>
            <p className="upload-subtitle">Create custom fields and input your data</p>
          </div>

          <div className="upload-card">
            <div className="upload-content">
              
              {/* Field Management */}
              <div className="field-manager">
                <h3 className="section-title">📋 Add Fields</h3>
                <div className="field-input-group">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addField()}
                    placeholder="Field name (e.g., age, score, value)"
                    className="field-input"
                  />
                  <button onClick={addField} className="add-field-btn">
                    ➕ Add Field
                  </button>
                </div>

                <div className="fields-display">
                  {fields.map((field, idx) => (
                    <div key={idx} className="field-tag">
                      <span>{field}</span>
                      <button
                        onClick={() => removeField(idx)}
                        className="remove-field-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Entry Table */}
              {fields.length > 0 && (
                <div className="data-entry-section">
                  <h3 className="section-title">📊 Enter Data</h3>
                  <div className="table-scroll">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          {fields.map((field, idx) => (
                            <th key={idx}>{field}</th>
                          ))}
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
                                  type="text"
                                  value={record[field] || ''}
                                  onChange={(e) =>
                                    updateRecordField(recordIdx, field, e.target.value)
                                  }
                                  className="cell-input"
                                  placeholder="value"
                                />
                              </td>
                            ))}
                            <td>
                              <button
                                onClick={() => removeRecord(recordIdx)}
                                className="delete-row-btn"
                              >
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

              {/* Action Buttons */}
              <div className="button-group">
                <button
                  onClick={addRecord}
                  className="secondary-button"
                  disabled={fields.length === 0}
                >
                  ➕ Add Record
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || records.length < 2 || fields.length === 0}
                  className={`analyze-button ${
                    loading || records.length < 2 || fields.length === 0
                      ? 'disabled'
                      : 'enabled'
                  }`}
                >
                  <span className="button-icon">⚡</span>
                  {loading ? 'Analyzing...' : 'Run ML Analysis'}
                </button>
              </div>

              <p className="upload-info">
                ℹ️ Add at least 2 records and 1 field to analyze
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <span className="dashboard-title-icon">⚡</span>
            <h1>User Behavior Analytics Dashboard</h1>
          </div>
          <button className="new-analysis-button" onClick={() => setResults(null)}>
            New Analysis
          </button>
        </div>

        {/* Key Metrics */}
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

        {/* Main Content Grid */}
        <div className="main-grid">
          {/* Left: Cluster Visualization */}
          <div className="chart-card">
            <h2 className="card-title">📊 User Clusters</h2>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="x"
                  type="number"
                  name="Total Spending ($)"
                  stroke="rgba(255,255,255,0.5)"
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  name="Avg Orders"
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                {results.clusters.map((cluster, idx) => (
                  <Scatter
                    key={idx}
                    name={`${cluster.label} (${cluster.size} users)`}
                    data={clusterData.filter((d) => d.cluster === cluster.id)}
                    fill={colors[idx % colors.length]}
                    fillOpacity={0.7}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
            <p className="chart-footer">Data flink</p>
          </div>

          {/* Right: Controls and Recommendations */}
          <div className="sidebar">
            {/* Controls */}
            <div className="sidebar-card">
              <h3>⚙️ Controls</h3>
              <div className="controls-content">
                <div className="control-group">
                  <label>Select Cluster</label>
                  <select
                    value={selectedCluster}
                    onChange={(e) => setSelectedCluster(Number(e.target.value))}
                    className="cluster-select"
                  >
                    {results.clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        Cluster {cluster.id} - {cluster.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cluster-info">
                  <p className="info-label">Cluster Info</p>
                  <div className="info-details">
                    <div className="info-row">
                      <span>Size</span>
                      <strong>{results.clusters[selectedCluster]?.size} users</strong>
                    </div>
                    <div className="info-row">
                      <span>% of Total</span>
                      <strong>{results.clusters[selectedCluster]?.percentage.toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Recommendations */}
            <div className="sidebar-card">
              <h3>🎯 Top Recommendations</h3>
              <div className="recommendations-content">
                <table className="recommendations-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.recommendations[selectedCluster]?.recommendations.slice(0, 4).map((rec, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="rec-product">{rec}</span>
                        </td>
                        <td>
                          <span className="confidence-badge">{92 - idx * 5}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Details */}
        <div className="details-grid">
          {/* Algorithm Selection */}
          <div className="detail-card">
            <h3>🤖 Algorithm Selection</h3>
            <div className="algo-scores">
              {Object.entries(results.algorithm.scores).map(([algo, score]) => (
                <div key={algo} className="algo-item">
                  <div className="algo-row">
                    <span className="algo-name">{algo}</span>
                    <span className="algo-score">{(score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="algo-bar">
                    <div
                      className={`algo-progress ${
                        algo === results.algorithm.selected ? 'active' : 'inactive'
                      }`}
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="algo-selected">
              ✅ Selected: <strong>{results.algorithm.selected.toUpperCase()}</strong>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="detail-card">
            <h3>📊 Quality Metrics</h3>
            <div className="metrics-list">
              <div className="metric-item">
                <span>Silhouette</span>
                <strong>{results.metrics.silhouette.toFixed(4)}</strong>
              </div>
              <div className="metric-item">
                <span>Davies-Bouldin</span>
                <strong>{results.metrics.davies_bouldin.toFixed(4)}</strong>
              </div>
              <div className="metric-item">
                <span>Calinski-Harabasz</span>
                <strong>{results.metrics.calinski_harabasz.toFixed(2)}</strong>
              </div>
              <div className="metric-item icso">
                <span>🔬 ICSO Score</span>
                <strong>{results.metrics.icso_score.toFixed(4)}</strong>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="detail-card">
            <h3>⚠️ Anomalies</h3>
            <div className="anomaly-content">
              <div className="anomaly-count">
                <span className="anomaly-label">Anomalies Found</span>
                <span className="anomaly-number">{results.anomalies.count}</span>
              </div>
              <div className="anomaly-bar">
                <div
                  className="anomaly-progress"
                  style={{ width: `${results.anomalies.percentage}%` }}
                ></div>
              </div>
              <p className="anomaly-text">
                {results.anomalies.percentage.toFixed(2)}% showing unusual behavior
              </p>
            </div>
          </div>

          {/* Cluster Distribution */}
          <div className="detail-card">
            <h3>📈 Cluster Distribution</h3>
            <div className="distribution-list">
              {results.clusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="distribution-item"
                  onClick={() => setSelectedCluster(cluster.id)}
                >
                  <div className="distribution-header">
                    <span>Cluster {cluster.id}</span>
                    <span className="distribution-percent">{cluster.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="distribution-bar">
                    <div
                      className="distribution-progress"
                      style={{
                        background: `linear-gradient(to right, ${colors[idx % colors.length]}, ${colors[(idx + 1) % colors.length]})`,
                        width: `${cluster.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
