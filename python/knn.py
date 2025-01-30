classes={
    "Nube":0,
    "Corazón":1,
    "Manzana":2,
    "Arbol":3,
    "Casa":4,
    "Símbolo de Pi":5
}

def readFeatureFile(filePath):
    f=open(filePath,'r')
    lines=f.readlines()


    x=[]
    y=[]
    for i in range(1,len(lines)):
        row=lines[i].split(",")
        x.append(
            [float(row[j]) for j in range(len(row)-1)]

        )
        y.append(classes[row[-1].strip()])

    return(x,y)
 
from sklearn.neighbors import KNeighborsClassifier
knn=KNeighborsClassifier(
   n_neighbors=2,
   algorithm="brute",
   weights="uniform"
)

X,y=readFeatureFile("../data/dataset/training.csv")

knn.fit(X,y)

X,y=readFeatureFile("../data/dataset/testing.csv")

accuracy=knn.score(X,y)
print ("Accuracy:",accuracy)