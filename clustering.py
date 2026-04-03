import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score


def apply_kmeans(df: pd.DataFrame, features: list, n_clusters: int) -> pd.DataFrame:
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    labels = kmeans.fit_predict(df[features])
    df_ = df.copy()
    df_['cluster'] = labels
    return df_, kmeans


def cluster_quality(df: pd.DataFrame, features: list, labels) -> dict:
    if len(set(labels)) < 2:
        return {'silhouette': -1.0, 'db': float('inf'), 'ch': 0.0}
    
    X = df[features]
    sil = silhouette_score(X, labels)
    db = davies_bouldin_score(X, labels)
    ch = calinski_harabasz_score(X, labels)
    return {'silhouette': sil, 'davies_bouldin': db, 'calinski_harabasz': ch}
