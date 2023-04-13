# 🧰 Simple TypeScript Starter | 2020

> We talk about a lot of **advanced Node.js and TypeScript** concepts on [the blog](https://khalilstemmler.com), particularly focused around Domain-Driven Design and large-scale enterprise application patterns. However, I received a few emails from readers that were interested in seeing what a basic TypeScript starter project looks like. So I've put together just that.

### Backend : projet API avec du Nodejs, permet d'avoir des points d'API

- Se mettre à la racine du projet, là où se trouve le fichier ```package.json```
- Lancer la commande ```npm i```
- Démarrer le projet avec la commande et se mettre en écoute : ```npm run api```
- URL de test, par exemple : ```https:\\localhost:8080\api\boulle-bo\hello-world``` => affiche ```{"message":"hello Boulle BO !"}```
- Les points d'API disponibles pour les différents projets se trouvent dans le dossier : ~\src\api\routes

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

### Rimraf
npm install --save rimraf

### API URL : 
https://localhost:8080/api/boulle-bo/hello-world