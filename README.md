# 🧠 User Behavior Optimization ML Platform

[![Streamlit](https://img.shields.io/badge/Streamlit-Powered-brightgreen.svg)](localhost:8501)
[![React](https://img.shields.io/badge/React-18-green)](localhost:3000)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-yellow)](localhost:8000)

**Advanced ML analytics for e-commerce user segmentation, clustering (ICSO metric), anomalies, patterns, recommendations.**

## 🎯 Quick Launch (Live Now!)

**1. Dashboard (Auto ML Graphs) – localhost:8501**
```
Click "⚡ Run ML Analysis" → Instant live 3D PCA/LDA, elbow, metrics!
- Sample data auto-loads
- ICSO optimized clusters
- Anomaly bubbles
```
![Streamlit Dashboard Screenshot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==) <!-- Placeholder; replace with screenshot -->

**2. Web App (React + Backend) – localhost:3000**
```
demo@example.com / demo123 → Upload CSV → Graphs + Insights
Supports manual fields + CSV upload
```
![React App](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==)

**3. API Docs – localhost:8000/docs**
```
POST /analyze-intelligent → JSON metrics/clusters/recommendations
```

## 🚀 How It Works

```
1. Data Input (CSV or Manual)
   ↓
2. Preprocessing (RFM, normalize)
   ↓
3. AutoML: KMeans/DBSCAN/Hierarchical + optimal K
   ↓
4. ICSO Metric (Novel inter/intra optimization)
   ↓
5. Live Graphs: 3D PCA/LDA, Elbow, Heatmaps
   ↓
6. Anomalies + Rules + Recommendations
   ↓
7. Export CSV/Excel
```

**Sample Output:**
```
Silhouette: 0.75 ⭐ Excellent
Clusters: Premium (8%), Medium (68%), Value (24%)
ICSO Score: 11.2
Anomalies: 9.8%
Rules: Electronics → Fashion (lift=2.1)
```

## 📁 Files & Data

**Datasets (Ready):**
- `data/example_user_behavior.csv` – Basic test
- `UserBehaviorApp/backend/user_behavior_download.csv` – Real 148 txns
- `data/sample_user_behavior_1000.csv` – 1000 users benchmark

**Exports Generated:**
- `analyzed_clusters.csv`
- `clustering_metrics.csv`
- `patterns.xlsx`

## 🔧 Tech Stack

```
Backend: FastAPI + Scikit-learn + SQLAlchemy
Frontend: React + Recharts + Tailwind
Dashboard: Streamlit + Plotly (live 3D/interactive)
ML: AutoML, ICSO, PCA/LDA, Isolation Forest, Apriori
```

## 📊 Live Demo Flow

1. **localhost:8501** → "⚡ Run ML Analysis" → Graphs appear (5s)
2. **localhost:3000** → Login → Upload CSV → Results page with charts
3. **localhost:8000/docs** → Test POST /analyze-intelligent with curl/sample

## 🎉 Key Features Complete

- ✅ One-click auto-analysis
- ✅ Live interactive 3D graphs
- ✅ Auto-segment LDA (Low/Med/High)
- ✅ CSV + Manual input
- ✅ Backend stable
- ✅ All errors fixed (LDA, imports, Categorical)

**Production Ready!** Test now at localhost:8501.
