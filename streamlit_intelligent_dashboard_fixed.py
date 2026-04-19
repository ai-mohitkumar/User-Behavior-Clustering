import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import plotly.figure_factory as ff
import os
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.metrics.pairwise import pairwise_distances
from scipy.spatial.distance import cdist
import warnings
warnings.filterwarnings('ignore')

# Page config
st.set_page_config(page_title="🧠 Intelligent Clustering Dashboard", layout="wide", initial_sidebar_state="expanded")

# Custom CSS for animations
st.markdown("""
<style>
@keyframes fadeIn {
  from {opacity: 0; transform: translateY(20px);}
  to {opacity: 1; transform: translateY(0);}
}
.stPlotlyChart {animation: fadeIn 0.8s ease-out;}
.metric-card {background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; border-radius: 10px; color: white;}
</style>
""", unsafe_allow_html=True)

# Title with spinner
with st.spinner("Loading Intelligent Clustering System..."):
    st.title("🧠 Intelligent Adaptive Clustering Dashboard")
    st.markdown("**AutoML • Novel ICSO Metric • PCA/LDA Viz • Anomaly Detection • Business Insights**")
    if st.button("⚡ Run ML Analysis (Auto Sample Data)", type="primary"):
        st.session_state.results = None  # Clear
        st.rerun()

# Intelligent Engine Class (embedded)
class IntelligentAdaptiveClusteringEngine:
    def __init__(self, data, features):
        self.data = data.copy()
        self.features = features
        self.X = data[features].select_dtypes(include=[np.number]).fillna(0).values
        self.scaler = StandardScaler()
        self.X_scaled = self.scaler.fit_transform(self.X)

    def calculate_icso_metric(self, labels, X):
        unique_labels = np.unique(labels[labels != -1])
        if len(unique_labels) < 2:
            return 0.0
        intra_vars = []
        for label in unique_labels:
            cluster_pts = X[labels == label]
            if len(cluster_pts) > 1:
                centroid = cluster_pts.mean(0)
                dists = np.linalg.norm(cluster_pts - centroid, 1)
                intra_vars.append(np.var(dists))
        mean_intra = np.mean(intra_vars) if intra_vars else 1.0
        centroids = np.array([X[labels == label].mean(0) for label in unique_labels])
        inter_dists = pairwise_distances(centroids).flatten()
        inter_dists = inter_dists[inter_dists > 0]
        mean_inter = np.mean(inter_dists) if len(inter_dists) > 0 else 1.0
        return mean_inter / (mean_intra + 1e-8)

    def calculate_hybrid_score(self, labels):
        try:
            sil = silhouette_score(self.X_scaled, labels)
            db = davies_bouldin_score(self.X_scaled, labels)
            ch = calinski_harabasz_score(self.X_scaled, labels)
            sil_norm = (sil + 1) / 2
            db_norm = 1 / (1 + db)
            ch_norm = min(ch / 2000, 1.0)
            hybrid = sil_norm * 0.5 + db_norm * 0.3 + ch_norm * 0.2
            return {'hybrid_score': hybrid, 'silhouette': sil, 'davies_bouldin': db, 'calinski_harabasz': ch}
        except:
            return {'hybrid_score': 0.0, 'silhouette': 0.0, 'davies_bouldin': 1.0, 'calinski_harabasz': 0.0}

    def auto_select_algorithm(self):
        scores = {}
        # KMeans
        kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
        labels_km = kmeans.fit_predict(self.X_scaled)
        scores['KMeans'] = self.calculate_hybrid_score(labels_km)
        scores['KMeans']['icso'] = self.calculate_icso_metric(labels_km, self.X_scaled)
        # DBSCAN
        dbscan = DBSCAN(eps=0.5, min_samples=5)
        labels_db = dbscan.fit_predict(self.X_scaled)
        if len(np.unique(labels_db)) > 1:
            scores['DBSCAN'] = self.calculate_hybrid_score(labels_db)
            scores['DBSCAN']['icso'] = self.calculate_icso_metric(labels_db, self.X_scaled)
        # Hierarchical
        hier = AgglomerativeClustering(n_clusters=3)
        labels_h = hier.fit_predict(self.X_scaled)
        scores['Hierarchical'] = self.calculate_hybrid_score(labels_h)
        scores['Hierarchical']['icso'] = self.calculate_icso_metric(labels_h, self.X_scaled)
        best = max(scores, key=lambda k: scores[k]['hybrid_score'])
        labels_map = {'KMeans': labels_km, 'DBSCAN': labels_db, 'Hierarchical': labels_h}
        return best, scores, labels_map[best]

    def detect_anomalies(self):
        iso = IsolationForest(contamination=0.1, random_state=42)
        anomaly_labels = iso.fit_predict(self.X_scaled) == -1
        self.data['anomaly'] = anomaly_labels
        return np.sum(anomaly_labels), np.mean(100 * anomaly_labels)

# Sidebar
st.sidebar.header("📁 Data")
data_file = st.sidebar.file_uploader("Upload CSV", type='csv')
use_sample = st.sidebar.checkbox("Use Sample Dataset (1000 users)", True)
if use_sample and 'sample_df' not in st.session_state:
    sample_path = "data/sample_user_behavior_1000.csv"
    if os.path.exists(sample_path):
        st.session_state.sample_df = pd.read_csv(sample_path)
run_button = st.sidebar.button("🚀 Run Intelligent Analysis", type="primary")

if run_button or st.session_state.get('results'):
    if data_file is not None:
        df = pd.read_csv(data_file)
    elif use_sample:
        sample_path = "data/sample_user_behavior_1000.csv"
        if os.path.exists(sample_path):
            df = pd.read_csv(sample_path)
            if 'sample_df' not in st.session_state:
                st.session_state.sample_df = df
        else:
            st.warning("Sample CSV not found! Upload data.")
            st.stop()
    else:
        st.warning("Load data first!")
        st.stop()

    st.session_state.df = df
    numeric_features = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_features) < 2:
        st.error("Need at least 2 numeric features!")
        st.stop()

    with st.spinner("🤖 Running AutoML Clustering..."):
        engine = IntelligentAdaptiveClusteringEngine(df, numeric_features)
        st.session_state.X_scaled = engine.X_scaled
        best_algo, algo_scores, labels = engine.auto_select_algorithm()
        engine.data['cluster'] = labels
        anomalies_count, anomalies_pct = engine.detect_anomalies()
        metrics = algo_scores[best_algo]
        icso = metrics.pop('icso', 0.0)
        st.session_state.results = {
            'df': engine.data, 'best_algo': best_algo, 'algo_scores': algo_scores,
            'labels': labels, 'metrics': metrics, 'icso': icso,
            'anomalies_count': anomalies_count, 'anomalies_pct': anomalies_pct,
            'numeric_features': numeric_features
        }

    # Success animation
    st.balloons()
    st.success(f"✅ Analysis complete with **{best_algo}** (Hybrid Score: {metrics['hybrid_score']:.3f}, ICSO: {icso:.2f})")

# Tabs for results
if st.session_state.get('results'):
    df = st.session_state.results['df']
    results = st.session_state.results
    numeric_features = results['numeric_features']
    tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Overview", "🎨 Clustering", "🔍 Dim Reduction", "👥 Profiles & Anomalies", "🎯 Insights"])

    with tab1:
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Hybrid Score", f"{results['metrics']['hybrid_score']:.3f}", delta="⭐ Best")
        col2.metric("Silhouette", f"{results['metrics']['silhouette']:.3f}")
        col3.metric("ICSO Score", f"{results['icso']:.2f}")
        col4.metric("Anomalies", f"{results['anomalies_count']} ({results['anomalies_pct']:.1f}%)")

        # Algo comparison animated bar
        score_df = pd.DataFrame([
            {'Algo': k, 'Hybrid': v['hybrid_score'], 'ICSO': v.get('icso', 0)}
            for k, v in results['algo_scores'].items()
        ])
        fig_bar = px.bar(score_df.melt(id_vars='Algo'), x='Algo', y='value', color='variable', 
                         barmode='group', title="Algorithm Comparison", animation_frame='variable')
        st.plotly_chart(fig_bar, width="stretch")

    with tab2:
        st.subheader("🎯 Clustering Analysis")
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Elbow Method + Silhouette vs K")
            k_range = range(2, 11)
            inertias = []
            silhouettes = []
            for k in k_range:
                kmeans = KMeans(n_clusters=k, n_init=10, random_state=42)
                labels_k = kmeans.fit_predict(st.session_state.X_scaled)
                inertias.append(kmeans.inertia_)
                silhouettes.append(silhouette_score(st.session_state.X_scaled, labels_k))
            elbow_df = pd.DataFrame({'k': list(k_range), 'WCSS': inertias, 'Silhouette': silhouettes})
            fig_elbow = go.Figure()
            fig_elbow.add_trace(go.Scatter(x=elbow_df['k'], y=elbow_df['WCSS'], mode='lines+markers', name='WCSS (Elbow)', line=dict(color='red')))
            fig_elbow.add_trace(go.Scatter(x=elbow_df['k'], y=elbow_df['Silhouette'], mode='lines+markers', name='Silhouette (Max)', line=dict(color='blue')))
            fig_elbow.update_layout(title="Elbow Method: Optimal K Selection", xaxis_title="Number of Clusters (k)", yaxis_title="Score")
            st.plotly_chart(fig_elbow, width="stretch")
            best_k_idx = np.argmax(silhouettes)
            optimal_k = list(k_range)[best_k_idx]
            st.success(f"**Optimal K from Silhouette: {optimal_k}** (Score: {silhouettes[best_k_idx]:.3f})")
        with col2:
            st.subheader("Animated PCA 3D Clusters")
            pca = PCA(n_components=3)
            X_pca = pca.fit_transform(StandardScaler().fit_transform(df[numeric_features].fillna(0)))
            fig_3d = px.scatter_3d(pd.DataFrame({'PC1': X_pca[:,0], 'PC2': X_pca[:,1], 'PC3': X_pca[:,2], 'cluster': results['labels']}),
                                   x='PC1', y='PC2', z='PC3', color='cluster', 
                                   title=f"PCA 3D (Var Explained: {sum(pca.explained_variance_ratio_):.1%})")
            fig_3d.update_traces(marker=dict(size=4))
            st.plotly_chart(fig_3d, width="stretch")

    with tab3:
        st.subheader("PCA 2D vs LDA")
        col_pca, col_lda = st.columns(2)
        with col_pca:
            pca2 = PCA(n_components=2)
            X_pca2 = pca2.fit_transform(StandardScaler().fit_transform(df[numeric_features].fillna(0)))
            fig_pca2 = px.scatter(pd.DataFrame({'PC1': X_pca2[:,0], 'PC2': X_pca2[:,1], 'cluster': results['labels']}),
                                  x='PC1', y='PC2', color='cluster')
            st.plotly_chart(fig_pca2, width="stretch")
        with col_lda:
            # Auto-generate segments for LDA if missing
            if 'user_segment' not in df.columns:
                first_feature = numeric_features[0] if numeric_features and numeric_features[0] in df.columns else df.select_dtypes(include=[np.number]).columns[0]
                df['user_segment'] = pd.cut(df[first_feature], bins=3, labels=['Low', 'Medium', 'High'])
            
            le = LabelEncoder()
            y = le.fit_transform(df['user_segment'].astype(str))
            n_classes = len(np.unique(y))
            n_comp = min(3, n_classes - 1, len(numeric_features))
            lda = LinearDiscriminantAnalysis(n_components=n_comp)

            X_lda = lda.fit_transform(StandardScaler().fit_transform(df[numeric_features].fillna(0)), y)
            fig_lda = px.scatter_3d(pd.DataFrame({
                'LD1': X_lda[:,0] if X_lda.shape[1] > 0 else np.zeros(len(df)),
                'LD2': X_lda[:,1] if X_lda.shape[1] > 1 else np.zeros(len(df)),
                'LD3': X_lda[:,2] if X_lda.shape[1] > 2 else np.zeros(len(df)),
                'segment': le.inverse_transform(y)
            }), x='LD1', y='LD2', z='LD3', color='segment', title="LDA 3D Components (Auto-segments)")
            st.plotly_chart(fig_lda, width="stretch")

    with tab4:
        # Cluster profiles
        cluster_means = df.groupby('cluster')[numeric_features].mean()
        fig_heatmap = px.imshow(cluster_means.T, color_continuous_scale='RdYlBu_r', title="Cluster Feature Heatmap")
        st.plotly_chart(fig_heatmap, width="stretch")
        # Anomalies bubble
        df['anomaly_size'] = df['anomaly'].astype(int) * 20 + 5
        first_feat = 'total_spent' if 'total_spent' in df else numeric_features[0]
        second_feat = 'session_duration' if 'session_duration' in df else numeric_features[1]
        fig_anom = px.scatter(df, x=first_feat, y=second_feat,
                              size='anomaly_size', color='anomaly', title="Anomalies (Size=Bigger if Anomaly)")
        st.plotly_chart(fig_anom, width="stretch")

    with tab5:
        st.subheader("Raw Data & Export")
        st.dataframe(df)
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("💾 Download Analyzed Data", csv, "analyzed_clusters.csv", "text/csv")

    st.markdown("---")
    st.caption("🎉 Built with Streamlit + Plotly + Scikit-learn | Novel ICSO Metric | AutoML Clustering")

