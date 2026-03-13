
import pandas as pd
import json

fso = pd.read_excel(r"C:\Users\Prince\Downloads\bhargava-fso-sales-tracker\data\fsoName.xlsx")
names = fso.iloc[:,0].dropna().tolist()

with open(r"C:\Users\Prince\Downloads\bhargava-fso-sales-tracker\data\fso.json","w") as f:
    json.dump(names,f,indent=2)

print("FSO JSON updated")
