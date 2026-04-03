import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from sklearn.decomposition import PCA

import os
from main import DATA_PATH

st.set_page_config(page_title='User Behavior Clustering Dashboard', layout='wide')
st.title("🧠 User Behavior Clustering Dashboard")

@st.cache_data
def load_data():
    if os.path.exists('clustered_users.csv'):
        df = pd.read_csv('clustered_users.csv')
    elif os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
        if 'total_spent' not in df.columns and {'quantity', 'price'}.issubset(df.columns):
            df['total_spent'] = df['quantity'] * df['price']
        df['cluster'] = np.nan
    else:
        df = pd.DataFrame({
            'total_spent': np.random.rand(50)*100,
            'quantity': np.random.randint(1,20,50),
            'cluster': np.random.randint(0,4,50)
        })
    return df

@st.cache_data
def load_metrics():
    comp_table = None
    cluster_metrics = None
    if os.path.exists('comparison_metrics.csv'):
        comp_table = pd.read_csv('comparison_metrics.csv')
    if os.path.exists('clustering_metrics.csv'):
        cluster_metrics = pd.read_csv('clustering_metrics.csv')
    return comp_table, cluster_metrics


# Data
s = load_data()
comp_table, cluster_metrics = load_metrics()

if s.empty:
    st.warning('No data available. Run the pipeline first (python main.py).')
    st.stop()

if comp_table is None:
    st.warning('comparison_metrics.csv not found. Run the pipeline first.')
    comp_table = pd.DataFrame(columns=['algorithm','silhouette','davies_bouldin','calinski_harabasz'])

if cluster_metrics is None:
    cluster_metrics = pd.DataFrame(columns=['silhouette','davies_bouldin','calinski_harabasz'])

# Metrics
col1, col2, col3 = st.columns(3)
if not comp_table.empty:
    best_idx = comp_table['silhouette'].idxmax()
    best_algo = comp_table.loc[best_idx, 'algorithm']
    col1.metric("Best Silhouette", f"{comp_table['silhouette'].max():.4f}")
    col2.metric("Best Algorithm", best_algo)
else:
    col1.metric("Best Silhouette", "N/A")
    col2.metric("Best Algorithm", "N/A")

if not cluster_metrics.empty:
    cluster_row = cluster_metrics.iloc[0]
    col3.metric("Silhouette (chosen k)", f"{cluster_row['silhouette']:.4f}")
    st.metric("Davies-Bouldin (chosen k)", f"{cluster_row['davies_bouldin']:.4f}")
    st.metric("Calinski-Harabasz (chosen k)", f"{cluster_row['calinski_harabasz']:.1f}")
else:
    col3.metric("Silhouette (chosen k)", "N/A")

st.subheader('Algorithm Comparison Graph (Silhouette, DB, CH)')
if not comp_table.empty:
    fig = px.bar(comp_table.melt(id_vars=['algorithm'], value_vars=['silhouette','davies_bouldin','calinski_harabasz'],
                                 var_name='metric', value_name='value'),
                 x='algorithm', y='value', color='metric', barmode='group',
                 title='Clustering Metrics by Algorithm')
    st.plotly_chart(fig, use_container_width=True)
else:
    st.info('No comparison metrics to plot.')

# Cluster distribution
st.subheader('Cluster Distribution')
if 'cluster' in s.columns and not s['cluster'].isna().all():
    dist = s['cluster'].value_counts().reset_index()
    dist.columns = ['cluster', 'count']
    fig_dist = px.pie(dist, names='cluster', values='count', title='Cluster Sizes')
    st.plotly_chart(fig_dist, use_container_width=True)
else:
    st.info('No cluster assignments available yet.')

# 2D scatter
st.subheader('Feature Scatter: total_spent vs quantity')
if {'total_spent', 'quantity', 'cluster'}.issubset(s.columns):
    fig_scatter = px.scatter(s, x='total_spent', y='quantity', color='cluster', title='total_spent vs quantity by cluster',
                             labels={'cluster':'Cluster'})
    st.plotly_chart(fig_scatter, use_container_width=True)
else:
    st.info('Dataset missing required columns for scatter plot.')

# PCA 2D Visualization
st.subheader('PCA 2D Visualization')
numeric_cols = s.select_dtypes(include=[np.number]).columns.tolist()
if 'cluster' in numeric_cols:
    numeric_cols.remove('cluster')
if numeric_cols and not s[numeric_cols].dropna().empty:
    X = s[numeric_cols].fillna(0)
    n_comp = min(2, X.shape[1])
    if n_comp >= 2 and len(X) >= 2:
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X)
        df_pca = pd.DataFrame({
            'PC1': X_pca[:, 0],
            'PC2': X_pca[:, 1],
            'cluster': s['cluster']
        })
        fig_pca = px.scatter(df_pca, x='PC1', y='PC2', color='cluster',
                             title=f'PCA Projection (PC1: {pca.explained_variance_ratio_[0]:.1%}, PC2: {pca.explained_variance_ratio_[1]:.1%})',
                             labels={'cluster': 'Cluster'})
        st.plotly_chart(fig_pca, use_container_width=True)
    else:
        st.info('Insufficient features/data for PCA.')
else:
    st.info('No numeric features available for PCA.')

# Accuracy note
st.markdown('''
#### How to interpret clustering quality (accuracy proxy)
- **Silhouette score** (the higher the better, range -1 to 1) is shown as the primary unsupervised accuracy-like metric.
- **Davies-Bouldin index** (the lower the better) and **Calinski-Harabasz** (higher the better) are also displayed.
- These metrics are computed from the pipeline outputs and shown in charts.
''')

# Show raw cluster data
st.subheader('Cluster Sample Data')
if not s.empty:
    st.dataframe(s.head(20))
else:
    st.info('No data loaded.')

# Rule mining from precomputed rules sheet if exists
if os.path.exists('patterns.xlsx'):
    rules = pd.read_excel('patterns.xlsx')
    st.subheader('Top Association Rules (from patterns.xlsx)')
    st.dataframe(rules.head(10).style.format({'lift': '{:.2f}'}))
else:
    st.info('No patterns.xlsx found. Run the pipeline to create it.')

