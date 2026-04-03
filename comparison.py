import pandas as pd
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from clustering import apply_kmeans, cluster_quality

def apply_dbscan(df, features, eps=0.5, min_samples=2):
    """Apply DBSCAN clustering."""
    dbscan = DBSCAN(eps=eps, min_samples=min_samples, n_jobs=-1)
    labels = dbscan.fit_predict(df[features])
    df_ = df.copy()
    df_['cluster'] = labels
    return df_, dbscan

def apply_hierarchical(df, features, n_clusters=4, linkage='ward'):
    """Apply Hierarchical clustering."""
    hier = AgglomerativeClustering(n_clusters=n_clusters, linkage=linkage)
    labels = hier.fit_predict(df[features])
    df_ = df.copy()
    df_['cluster'] = labels
    return df_, hier

def compare_algorithms(df, features, best_k=4):
    """Compare KMeans, DBSCAN, Hierarchical."""
    results = []
    
    # KMeans
    df_km, kmeans = apply_kmeans(df, features, best_k)
    scores_km = cluster_quality(df, features, df_km['cluster'])
    results.append({'algorithm': 'KMeans', **scores_km})
    
    # DBSCAN (try eps)
    eps_list = [0.3, 0.5, 0.8]
    best_eps = 0.5
    best_score = -1
    for eps in eps_list:
        df_db, _ = apply_dbscan(df, features, eps=eps)
        scores = cluster_quality(df, features, df_db['cluster'])
        if scores['silhouette'] > best_score:
            best_score = scores['silhouette']
            best_eps = eps
    df_db, dbscan = apply_dbscan(df, features, eps=best_eps)
    scores_db = cluster_quality(df, features, df_db['cluster'])
    results.append({'algorithm': f'DBSCAN(eps={best_eps})', **scores_db})
    
    # Hierarchical
    df_hier, hier = apply_hierarchical(df, features, best_k)
    scores_hier = cluster_quality(df, features, df_hier['cluster'])
    results.append({'algorithm': 'Hierarchical', **scores_hier})
    
    # Table
    table = pd.DataFrame(results).round(4)
    print('\nClustering Comparison:')
    print(table.to_string(index=False))
    
    # Best by silhouette
    best_algo = table.loc[table['silhouette'].idxmax()]
    print(f'\nBest algorithm: {best_algo["algorithm"]} (silhouette: {best_algo["silhouette"]:.4f})')
    
    return table, best_algo['algorithm'], [df_km, df_db, df_hier], [kmeans, dbscan, hier]

