import pandas as pd
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from mpl_toolkits.mplot3d import Axes3D
import numpy as np


def scatter_clusters(df, x_col, y_col, cluster_col='cluster', title='Cluster Plot'):
    """2D scatter plot colored by cluster."""
    plt.figure(figsize=(8, 6))
    plt.scatter(df[x_col], df[y_col], c=df[cluster_col], cmap='viridis', alpha=0.6)
    plt.xlabel(x_col)
    plt.ylabel(y_col)
    plt.title(title)
    plt.colorbar(label='cluster')
    plt.tight_layout()
    plt.show()


def pca_2d(df, features, cluster_col='cluster', title='PCA 2D Clusters'):
    """Safe PCA to 2D."""
    X = df[features].select_dtypes(include=[np.number]).fillna(0)
    n_comp = min(2, X.shape[0], X.shape[1])
    if n_comp < 1:
        print("Insufficient data for PCA")
        return
    pca = PCA(n_components=n_comp)
    X_pca = pca.fit_transform(X)
    df_pca = pd.DataFrame(X_pca, columns=[f'pca{i+1}' for i in range(n_comp)])
    df_pca[cluster_col] = df[cluster_col]
    plt.figure(figsize=(8, 6))
    if n_comp == 2:
        scatter = plt.scatter(df_pca['pca1'], df_pca['pca2'], c=df_pca[cluster_col], cmap='viridis', alpha=0.6)
        plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.2%} variance)')
    else:
        scatter = plt.scatter(df_pca['pca1'], np.zeros(len(df_pca)), c=df_pca[cluster_col], cmap='viridis', alpha=0.6)
        plt.ylabel('Dummy Y')
    plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.2%} variance)')
    plt.title(title)
    plt.colorbar(scatter, label='cluster')
    plt.tight_layout()
    plt.show()



def pca_scatter(df, features, cluster_col='cluster', title='PCA Scatter Plot'):
    pca_2d(df, features, cluster_col=cluster_col, title=title)


def plot_3d_clusters(df, features, cluster_col='cluster', title='3D Clusters'):
    """Safe PCA to 3D."""
    X = df[features].select_dtypes(include=[np.number]).fillna(0)
    n_comp = min(3, X.shape[0], X.shape[1])
    if n_comp < 2:
        print("Skipping 3D: insufficient data")
        pca_2d(df, features, cluster_col, title)
        return
    pca = PCA(n_components=n_comp)
    X_pca = pca.fit_transform(X)
    cols = [f'pca{i+1}' for i in range(n_comp)]
    df_pca = pd.DataFrame(X_pca, columns=cols)
    df_pca[cluster_col] = df[cluster_col]
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')
    z = df_pca['pca3'] if 'pca3' in df_pca else np.zeros(len(df_pca))
    scatter = ax.scatter(df_pca['pca1'], df_pca['pca2'], z, c=df_pca[cluster_col], cmap='viridis', alpha=0.6)
    ax.set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.2%})')
    ax.set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.2%})')
    if n_comp == 3:
        ax.set_zlabel(f'PC3 ({pca.explained_variance_ratio_[2]:.2%})')
    else:
        ax.set_zlabel('PC3 (N/A)')
    plt.title(title)
    fig.colorbar(scatter, ax=ax, label='cluster', shrink=0.5)
    plt.tight_layout()
    plt.show()


def plot_elbow(k_values, wcss_list, title='Elbow Method for Optimal k'):
    """Plot Elbow curve for WCSS vs number of clusters."""
    plt.figure(figsize=(8, 6))
    plt.plot(k_values, wcss_list, marker='o', linestyle='-', linewidth=2)
    plt.title(title)
    plt.xlabel('Number of Clusters (k)')
    plt.ylabel('WCSS (Within-Cluster Sum of Squares)')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()



