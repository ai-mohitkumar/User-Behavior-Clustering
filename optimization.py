from clustering import apply_kmeans, cluster_quality


def find_best_k(df, features, max_k=7):
    n_samples = len(df)
    k_range = (2, min(max_k, n_samples - 1))
    best_score = -1.0
    best_k = None
    best_labels = None
    wcss_list = []
    all_scores = []

    for k in range(k_range[0], k_range[1] + 1):
        clustered, kmeans_model = apply_kmeans(df, features, k)
        scores = cluster_quality(df, features, clustered['cluster'])
        wcss = kmeans_model.inertia_
        wcss_list.append(wcss)
        all_scores.append({**scores, 'wcss': wcss})
        print(f"k={k}, silhouette={scores['silhouette']:.4f}, DB={scores['davies_bouldin']:.4f}, CH={scores['calinski_harabasz']:.4f}, WCSS={wcss:.2f}")
        score = scores['silhouette']
        if score > best_score:
            best_score = score
            best_k = k
            best_labels = clustered['cluster']

    print(f"Optimal k: {best_k} (Silhouette: {best_score:.4f})")
    return {'best_k': best_k, 'best_score': best_score, 'labels': best_labels, 'wcss_list': wcss_list, 'all_scores': all_scores}
