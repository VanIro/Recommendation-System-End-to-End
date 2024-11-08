import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix

from joblib import load

artifacts_directory = "./model_artifacts"

model = load(artifacts_directory+"/lightfm_model_1.joblib")

user_id_map = load(artifacts_directory+"/user_id_map.joblib")
inv_user_id_map = load(artifacts_directory+"/inv_user_id_map.joblib")

movie_id_map = load(artifacts_directory+"/movie_id_map.joblib")
inv_movie_id_map = load(artifacts_directory+"/inv_movie_id_map.joblib")
movies_features_df = load(artifacts_directory+"/movies_features_df.joblib")
interactions = load(artifacts_directory+"/interactions.joblib")

users_features_mean_df = load(artifacts_directory+"/users_features_mean_df.joblib")
user_features_columns = users_features_mean_df.columns.values

movies_df = load(artifacts_directory+"/movies_df.joblib")

def map_rating(rating):
    if(rating<=2): return -100
    elif rating>=4: return 100
    else: return 20


#ratings: [[movie_id,rating],...] #,genres?
def get_user_features(user_ratings):
    user_data_df = pd.DataFrame(columns=["movieId","rating"],data=user_ratings)
    user_data_df['rating']=user_data_df['rating'].apply(map_rating)
    user_data_genres_merged_df=pd.merge(user_data_df,movies_df,on="movieId",how="left")
    user_data_genres_merged_df['genres']=user_data_genres_merged_df['genres'].str.split('|')
    user_feature = user_data_genres_merged_df.explode('genres').groupby(['genres'])['rating'].mean().reset_index().pivot_table(columns='genres', values='rating')
    for col in user_features_columns:
        if col not in user_feature.columns:
            user_feature[col]=map_rating(3)/1.5
    user_feature.columns=user_features_columns
    
    
    return user_feature

#user_ratings: [[movie_id,rating],...] #,genres?
def recommend_new_user(new_user_feature,N=10):
    new_user = csr_matrix(new_user_feature)
    scores_new_user = model.predict(user_ids = 0,item_ids = np.arange(interactions.shape[1]), user_features=new_user)
    top_scores_ind = np.argsort(-scores_new_user)
    top_scores_ind_dataset = np.vectorize(inv_movie_id_map.get)(top_scores_ind)
    top_items_new_user = movies_features_df.loc[top_scores_ind_dataset]
    top_items_ids = top_items_new_user[:N].index.values

    result_df = pd.merge(top_items_new_user[:N],
                         movies_df.loc[:,['movieId','imdbId','tmdbId']],
                         on='movieId',how='left'
                ).loc[:,['movieId','title','tmdbId','imdbId']]

    return result_df.to_json(orient='records')

