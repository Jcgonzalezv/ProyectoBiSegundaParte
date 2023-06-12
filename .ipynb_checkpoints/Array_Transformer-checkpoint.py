from sklearn.base import BaseEstimator, TransformerMixin

class Array_Transformer (BaseEstimator, TransformerMixin):
    
    def __init__(self):
        self
    
    def fit(self, X, y = None):
        return self
    
    def transform(self, X, y = None):
        t = type(X)
        t_str = str(t)
        if t_str == "<class 'pandas.core.frame.DataFrame'>":
            X = X.to_numpy()
        if len(X.shape) > 1:
            X = X.flatten()
        return X