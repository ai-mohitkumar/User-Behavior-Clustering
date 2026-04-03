import pandas as pd
from sklearn.preprocessing import MinMaxScaler


def load_data(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna().drop_duplicates().reset_index(drop=True)
    return df


def feature_engineering(df: pd.DataFrame) -> pd.DataFrame:
    if 'quantity' in df.columns and 'price' in df.columns:
        df['total_spent'] = df['quantity'] * df['price']
    if 'time_spent' not in df.columns and 'duration' in df.columns:
        df.rename(columns={'duration': 'time_spent'}, inplace=True)

    # Example behavioral features
    if 'quantity' in df.columns:
        df['quantity_norm'] = df['quantity']
    if 'total_spent' in df.columns:
        df['total_spent_norm'] = df['total_spent']

    return df


def normalize_features(df: pd.DataFrame, feature_cols: list) -> pd.DataFrame:
    scaler = MinMaxScaler()
    df_norm = df.copy()
    df_norm[feature_cols] = scaler.fit_transform(df_norm[feature_cols])
    return df_norm
