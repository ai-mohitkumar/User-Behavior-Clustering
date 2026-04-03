import os
import pandas as pd
from preprocessing import load_data, clean_data, feature_engineering, normalize_features
from optimization import find_best_k
from clustering import apply_kmeans
from comparison import compare_algorithms
from visualization import scatter_clusters, pca_2d, plot_3d_clusters, plot_elbow
from clustering import cluster_quality
from pattern_mining import basket_from_transactions, mine_rules


DATA_PATH = os.path.join('data', 'example_user_behavior.csv')


def run_pipeline(csv_path=DATA_PATH):
    df = load_data(csv_path)
    df = clean_data(df)
    df = feature_engineering(df)

    candidates = ['total_spent', 'quantity']
    features = [c for c in candidates if c in df.columns]
    if not features:
        raise ValueError('Required features not found in dataset')

    df_norm = normalize_features(df, features)
    comp_table, best_algo, dfs, models = compare_algorithms(df_norm, features)
    
    print("\n=== CLUSTERING PERFORMANCE EVALUATION ===")
    print(comp_table.to_string(index=False))

    # Save comparison table for dashboard
    comp_table.to_csv('comparison_metrics.csv', index=False)
    print("Exported comparison_metrics.csv")
    
    # Optimal k from Silhouette (Elbow method)
    opt_results = find_best_k(df_norm, features)
    best_k = opt_results['best_k']
    wcss_list = opt_results['wcss_list']
    k_values = list(range(2, len(wcss_list)+2))
    plot_elbow(k_values, wcss_list)
    
    df_clustered, kmeans_model = apply_kmeans(df_norm, features, best_k)
    
    # Final metrics for chosen k
    final_scores = cluster_quality(df_norm, features, df_clustered['cluster'])
    print("\nFinal Clustering Performance (k={}):".format(best_k))
    print("Silhouette Score: {:.4f} (higher better)".format(final_scores['silhouette']))
    print("Davies-Bouldin Index: {:.4f} (lower better)".format(final_scores['davies_bouldin']))
    print("Calinski-Harabasz Score: {:.2f} (higher better)".format(final_scores['calinski_harabasz']))
    
    # Export comparison table
    comp_table.to_csv('comparison_metrics.csv', index=False)
    
    # Export k vs metrics
    opt_results = opt_results  # already have
    k_df = pd.DataFrame([{'k':k+2, **score} for k, score in enumerate(opt_results['all_scores'])] ) 
    k_df.to_csv('k_metrics.csv', index=False)
    
    # Export metrics
    metrics_df = pd.DataFrame([final_scores])
    metrics_df.to_csv('clustering_metrics.csv', index=False)
    print("Exported clustering_metrics.csv, comparison_metrics.csv, k_metrics.csv")
    
    scatter_clusters(df_clustered, features[0], features[1], 'cluster', 'Optimized Clusters (k={})'.format(best_k))
    pca_2d(df_clustered, features)
    plot_3d_clusters(df_clustered, features)

    if {'InvoiceNo', 'Description', 'quantity'}.issubset(df.columns):
        basket = basket_from_transactions(df)
        frequent, rules = mine_rules(basket)
        print('Top rules:')
        print(rules.sort_values('lift', ascending=False).head())
    else:
        print('Pattern mining not possible: required columns missing')

    print('Cluster analysis:')
    cluster_means = df_clustered.groupby('cluster')[features].mean()
    # Case study
    print("\\nCase Study: E-commerce Insights")
    high_spend_cluster = cluster_means['total_spent'].idxmax()
    avg_spent = cluster_means['total_spent'].mean()
    pct_diff = (cluster_means['total_spent'].max() / avg_spent - 1) if avg_spent != 0 else 0
    print(f"Cluster {high_spend_cluster} users spent {cluster_means['total_spent'].max():.2f} avg ({pct_diff:.0%} higher than average) - premium segment.")

    # Recommendation
    print("\\nRecommendations:")
    for c in df_clustered['cluster'].unique():
        mean_spent = cluster_means.loc[c, 'total_spent']
        if mean_spent > avg_spent:
            print(f"Cluster {c}: Recommend premium products")
        else:
            print(f"Cluster {c}: Offer discounts")

    # Export
    df_clustered.to_csv('clustered_users.csv', index=False)
    print("Exported clustered_users.csv")
    print("All results exported including clustering_metrics.csv") 

    rules.to_excel('patterns.xlsx', index=False) if 'rules' in locals() else print("No rules to export")

if __name__ == '__main__':
    run_pipeline()
