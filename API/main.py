
from typing import Optional
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from fastapi import FastAPI, Request
from Array_Transformer import Array_Transformer
from DataModel import DataModel
from pandas import pandas as pd
from fastapi.encoders import jsonable_encoder

from joblib import load, dump
import numpy
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
   return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
   return {"item_id": item_id, "q": q}

@app.post("/fit")
async def getInformation(dataModel : DataModel):
   """req_info = await info.json()
   arr_x = numpy.array(req_info["X"])
   arr_y = numpy.array(req_info["Y"])"""
   model = load('Assets/Pry1_Prt2_Custom.joblib')
   df = pd.DataFrame(jsonable_encoder(dataModel))
   df.columns = dataModel.columns()
   print(dataModel.columns())
   print(df.head())
   Y = df["label"]
   Y = Y.replace({'__label__0': 0, '__label__1': 1})
   X = df.drop(["label"], axis=1)
   # Dividir los datos en entrenamiento y test
   #X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=0)
   model = model.fit(X, Y)
   #result = model.predict(X)
   dump(model, 'Assets/Pry1_Prt2.joblib')
   return {
        "status" : "SUCCESS",
        "data" : {
           "message": "The model was succesfully trained with the provided DataFrame"
        }
    }

@app.post("/predict")
async def getInformation(dataModel : DataModel):
   """
   req_info = await info.json()
   arr_x = numpy.array(req_info["X"])
   arr_y = numpy.array(req_info["Y"])
   """
   model = load('Assets/Pry1_Prt2.joblib')
   df = pd.DataFrame(jsonable_encoder(dataModel))
   df.columns = dataModel.columns()
   print(dataModel.columns())
   print(df.head())
   Y = df["label"]
   Y = Y.replace({'__label__0': 0, '__label__1': 1})
   X = df.drop(["label"], axis=1)
   y_pred = model.predict(X)
   # Se obtienen las métricas a partir de la predicción y la base de evaluación (valores reales).
   mse = "MSE: %.2f" % mean_squared_error(Y, y_pred, squared=False)
   mae = "MAE: %.2f" % mean_absolute_error(Y, y_pred)
   r2 = "R²: %.2f" % r2_score(Y, y_pred)
   return {
      "status" : "SUCCESS",
      "data" : 
      {
         "MSE":  mse,
         "MAE": mae,
         "R2" : r2
      }
   }


