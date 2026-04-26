# 🧠 Intelligent Adaptive Clustering Dashboard (Streamlit)

A production-ready Streamlit application for unsupervised user-behavior segmentation, AutoML clustering, anomaly detection, and model-accuracy evaluation.

---

## 🚀 Live Demo

```bash
streamlit run streamlit_intelligent_dashboard_fixed.py
```

Open your browser to **http://localhost:8501**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AutoML Clustering** | Auto-selects best algorithm among K-Means, DBSCAN, and Hierarchical clustering |
| **Hybrid Score** | Composite metric combining Silhouette (50%), Davies-Bouldin (30%), and Calinski-Harabasz (20%) |
| **ICSO Metric** | Novel Inter-Cluster Separation / Intra-Cluster Optimization score |
| **Model Accuracy** | Clustering accuracy vs auto-generated ground-truth segments (Hungarian optimal mapping) |
| **ARI & NMI** | Adjusted Rand Index and Normalized Mutual Information for cluster-quality validation |
| **Homogeneity / Completeness / V-Measure** | Fine-grained clustering purity metrics |
| **3D PCA Visualization** | Interactive 3D scatter plot of clusters with Plotly |
| **LDA Projection** | Linear Discriminant Analysis on auto-generated Low/Medium/High segments |
| **Elbow & Silhouette Analysis** | Optimal k selection from k=2 to k=10 |
| **Anomaly Detection** | Isolation Forest contamination-based outlier detection |
| **Cluster Heatmap** | Feature-wise mean heatmap per cluster |
| **CSV Export** | Download fully analyzed dataset with cluster labels and anomaly flags |

---

## 📊 Model Accuracy (New)

After clustering, the dashboard evaluates how well the discovered clusters align with data-driven ground truth:

1. **Ground Truth Generation**  
   If no `user_segment` column exists, the app automatically bins the first numeric feature into **Low / Medium / High** segments.

2. **Accuracy Metrics Computed**
   - **Accuracy** – Best one-to-one cluster-to-segment mapping via the Hungarian algorithm (`scipy.optimize.linear_sum_assignment`)
   - **ARI** – Adjusted Rand Index (chance-corrected similarity)
   - **NMI** – Normalized Mutual Information (information-theoretic agreement)
   - **Homogeneity** – Each cluster contains only members of a single true segment
   - **Completeness** – All members of a given true segment are assigned to the same cluster
   - **V-Measure** – Harmonic mean of Homogeneity and Completeness

3. **Noise Handling**  
   DBSCAN noise points (`label == -1`) are excluded from accuracy calculations to ensure fair evaluation.

---

## 🛠 Tech Stack

- **Python 3.10+**
- **Streamlit 1.55+**
- **Plotly** – interactive 3D/2D visualizations
- **Scikit-learn** – clustering, metrics, preprocessing, anomaly detection
- **SciPy** – Hungarian algorithm for optimal label matching
- **Pandas / NumPy** – data manipulation

---

## 📁 Project Structure

```
optimization project/
├── streamlit_intelligent_dashboard_fixed.py   # Main Streamlit app (this project)
├── streamlit_intelligent_dashboard.py         # Original version
├── data/
│   └── sample_user_behavior_1000.csv          # Default 1000-user benchmark dataset
├── requirements.txt                           # Python dependencies
├── run_streamlit.bat                          # Windows launcher (cmd)
├── run_streamlit_fixed.bat                    # Windows launcher (PowerShell fix)
└── README_STREAMLIT.md                        # This file
```

---

## ⚙️ Installation

1. **Clone / navigate to the project folder**
   ```bash
   cd "optimization project"
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   ```

3. **Activate the environment**
   - Windows CMD: `venv\Scripts\activate.bat`
   - Windows PowerShell: `venv\Scripts\Activate.ps1`

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🎮 Usage

### Launch the dashboard
```bash
streamlit run streamlit_intelligent_dashboard_fixed.py --server.port 8501
```

### Run analysis
1. Open **http://localhost:8501** in your browser.
2. The sample dataset (`data/sample_user_behavior_1000.csv`) loads automatically.
3. Click **"🚀 Run Intelligent Analysis"** in the sidebar.
4. Explore the five tabs:
   - **📊 Overview** – Hybrid score, Silhouette, ICSO, Anomalies, and **Model Accuracy**
   - **🎨 Clustering** – Elbow method, Silhouette vs K, 3D PCA clusters
   - **🔍 Dim Reduction** – PCA 2D and LDA 3D projections
   - **👥 Profiles & Anomalies** – Cluster heatmap and anomaly bubble chart
   - **🎯 Insights** – Raw data table and CSV export

### Upload custom data
Use the sidebar **"Upload CSV"** widget to analyze your own dataset.  
Requirements:
- At least **2 numeric columns**
- Optional: `user_segment` column for custom ground-truth accuracy evaluation

---

## 📈 Understanding the Metrics

| Metric | Range | Interpretation |
|--------|-------|----------------|
| **Hybrid Score** | 0 – 1 | Higher is better; weighted ensemble of Silhouette, DB, CH |
| **Silhouette** | -1 – 1 | > 0.5 = good separation |
| **ICSO** | 0 – ∞ | Higher = better inter/intra cluster ratio |
| **Accuracy** | 0 – 100% | Optimal cluster-to-segment match percentage |
| **ARI** | -1 – 1 | 1 = perfect agreement with ground truth |
| **NMI** | 0 – 1 | 1 = complete information sharing with ground truth |
| **V-Measure** | 0 – 1 | 1 = perfect homogeneity and completeness |

---

## 🔧 Customization

### Change default k for K-Means / Hierarchical
Edit the `auto_select_algorithm` method inside `IntelligentAdaptiveClusteringEngine`:
```python
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
hier = AgglomerativeClustering(n_clusters=3)
```

### Adjust DBSCAN sensitivity
```python
dbscan = DBSCAN(eps=0.5, min_samples=5)
```

### Modify anomaly contamination
```python
iso = IsolationForest(contamination=0.1, random_state=42)
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| Sample CSV not found | Ensure `data/sample_user_behavior_1000.csv` exists |
| Port 8501 in use | Change `--server.port` to 8502, 8503, etc. |
| Browser doesn’t open | Manually navigate to `http://localhost:8501` |

---

## 📄 License

This Streamlit dashboard is part of the **User Behavior Optimization ML Platform** research project.

---

## 🙌 Credits

Built with **Streamlit + Plotly + Scikit-learn**  
Novel ICSO Metric | AutoML Clustering | Real-time 3D Visualization

