# DOCUMENTATION

- [Objectif](#objectif)
- [Prérequis](#prérequis)
- [Mode d'emploi](#mode-demploi)
- [Méthodologie](#méthodologie)
- [Quelques explications](#quelques-explications)
- [Processus](#processus)
    - [1 - Création du profit](#1---création-du-profit)
    - [2 - Création de l'investissement](#2---création-de-linvestissement)
    - [3 - Création de l'amortissement](#3---création-de-lamortissement)

## Objectif
Il s'agit d'une application qui rend compte de la liaison 
entre la micro et la macroéconomie. Elle s'inspire des recherches de Bernard Schmitt,
développées dans son livre Inflation Chômage et Malformation du capital.

Le framework tient compte des principales 
opérations économiques nationales :

+ Production
+ Consommation intermédiaire (CI)
+ Financement inter entreprises des CI
+ Revenus Salariaux
+ Consommation
+ Achat de Titres
+ Rachat de Titres
+ Achat d'Immobilisation
+ Dépréciation d'Immobilisation
+ Revenus non salariaux
+ Remboursement d'emprunt Bancaire
+ Paiement Bancaire
+ Crédit

Une version ultérieure prendra en compte les opérations 
internationales

+ Financement des règlements Internationaux
+ Escompte International

## Prérequis
Nous supposons que la majorité des opérations se fait sous forme
d'achat et de vente de titre. La banque a principalement
un rôle de payeur et elle n'accorde des crédits principalement sous 
forme d'escompte.

Les unités monétaires sont fictives, il suffit de les adapter à chaque pays.

C'est un système à 2 entreprises où :
- E1 produit des biens de consommation
- E2 produit des biens d'investissement
- Il n'existe qu'une seule banque
- Les ménages sont une seule entité

## Mode d'emploi
Le bouton "choisir un paramétrage" donne accès à un formulaire. 
Certaines données sont enregistrées par défaut.
+ Le bouton envoyer liste toutes les opérations d'un cout
+ Le bouton RAZ efface toutes les données
+ Le bouton Pas à Pas execute les opérations les unes aprés les autres
  (il n'y a pas de retour arrière pour l'instant.)

## Méthodologie
Il s'agit d'une rétroconception, c'est-à-dire qu'à partir du montant de la 
production, en termes de valeur ajoutée (VA), on en déduit : le profit investi,
le montant de l'amortissement. 
La formule est la suivante : 
> Montant production calculée = (production saisie - (3 * Amortissement) - profit) /2  
> Montant profit investi = profit saisi  
> Montant amortissement = production calculée - (3 * profit investi)
 
## Quelques explications
Pour une production saisie de 90 dont 25 de biens d'investissement, il faut une épargne 
réelle de 25, ici l'épargne disponible est de 65 (90 - 25). En retirant les 25 pour la production de biens d'investissement
il nous reste 40.

Pour créer cette épargne réelle, il faut faire un profit de 25. La production initiale passe à 15.

Sur ces 15, il faut 5 de biens d'amortissement soit une épargne réelle de 10.

Les 5 d'amortissement génèrent un profit de 5, soit une captation de 10 (5 investissement et 5 épargne)
sur 10 d'épargne, il nous reste 0 de consommation nette.

Dans un système idéal, que l'on appelle smithien, l'amortissement ne génère pas
d'investissement supplémentaire, dans ces conditions, la consommation nette passerait
à 10.

## Processus
### 1 - Création du profit
### 2 - Création de l'investissement
### 3 - Création de l'amortissement