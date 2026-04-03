import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules


def basket_from_transactions(df: pd.DataFrame, invoice_col='InvoiceNo', item_col='Description', quantity_col='quantity') -> pd.DataFrame:
    basket = (df.groupby([invoice_col, item_col])[quantity_col]
                .sum().unstack().fillna(0))
    basket = basket.applymap(lambda x: 1 if x > 0 else 0)
    return basket


def mine_rules(basket: pd.DataFrame, min_support=0.02, min_lift=1.0):
    frequent = apriori(basket, min_support=min_support, use_colnames=True)
    rules = association_rules(frequent, metric='lift', min_threshold=min_lift)
    return frequent, rules
