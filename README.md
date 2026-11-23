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
- [Monnaie internationale](#Monnaie-internationale)

## Objectif
Il s'agit d'une application qui rend compte de la liaison 
entre la micro et la macroéconomie. Elle s'inspire des recherches de **Bernard Schmitt**,
développées dans son livre **Inflation Chômage et Malformation du capital**.

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
>la production des ménages crée de la valeur,  
> la consommation des ménages détruit la valeur,  
> l'achat de titre par les ménages n'est pas une consommation, mais un prêt,  
> les biens correspondants à ces titres ne sont pas écoulé (consommés).

Les unités monétaires sont fictives, il suffit de les adapter à chaque pays.

C'est un système à 2 entreprises où :
- E1 produit des biens de consommation,
- E2 produit des biens d'investissement,
- Les ménages sont une seule entité,
- Il n'existe qu'une seule banque secondaire,
- Il existe une banque centrale nationale,
- Il existe une banque centrale du reste du monde (BCdm),
- Il existe une entreprise du reste du monde (Rdm).

## Mode d'emploi
### Menu documentation
Affiche le readme.
### Menu Modélisation
Le bouton "choisir un paramétrage" donne accès à un formulaire. 
Certaines données sont enregistrées par défaut.
+ Le bouton envoyer liste toutes les opérations d'un cout,
+ Le bouton RAZ efface toutes les données,
+ Le bouton Pas à Pas execute les opérations les unes aprés les autres.
  (il n'y a pas de retour arrière pour l'instant.)
### Menu cycle
Le bouton "choisir un paramétrage" donne accès à un formulaire.

Ici l'utilisateur a le choix entre plusieurs éléments du menu.
+ la zone de liste en haut du formulaire permet de choisir un cycle,
+ Le bouton envoyer liste toutes les opérations d'un cout,
+ Le bouton RAZ efface toutes les données,
+ Le bouton Pas à Pas execute les opérations les unes aprés les autres.

Si l'utilisateur choisi un autre cycle, sans effacer le précédent, les valeurs du nouveau cycle s'ajoutent à l'ancien.
+ la zone de liste en haut du formulaire permet de choisir un cycle,
+ Le bouton envoyer liste toutes les opérations d'un cout et les ajoute à l'ancien cycle,
+ Le bouton RAZ efface toutes les données,
+ Le bouton Pas à Pas execute les opérations les unes aprés les autres et les ajoute à l'ancien cycle.
### Menu Sandbox
L'utilisateur peut voir les effets d'une ou plusieurs opérations sur le modèle.

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
réelle de 25, ici l'épargne disponible est de 65 (90 - 25). En retirant les 25 pour la production de biens d'investissement, il nous reste 40.

Pour créer cette épargne réelle, il faut faire un profit de 25. La production initiale passe à 15.

Sur ces 15, il faut 5 de biens d'amortissement soit une épargne réelle de 10.

Les 5 d'amortissement génèrent un profit de 5, soit une captation de 10 (5 investissement et 5 épargne)
sur 10 d'épargne, il nous reste 0 de consommation nette.

Dans un système idéal, que l'on appelle smithien, l'amortissement ne génère pas
d'investissement supplémentaire, dans ces conditions, la consommation nette passerait
à 10.

## Processus
### 1 - Création du profit
- E1 produit des biens d'investissement et E2 des biens de consommation, les deux pour le même montant,
- Toute la production de E2 est achetée par E1,
- E2 vend des titres aux ménages pour la moitié de leur revenu, 
- E1 vend des biens de consommation pour l'autre moitié,
- E2 détient un profit réel nul et monétaire positif correspondant à la créance de E2 sur E1,
- E1 détient un profit réel positif et monétaire négatif correspondant au stock de biens détenu par E1,
- Les ménages disposent de titres sur E2 payés par leur salaire.
### 2 - Création de l'investissement
- L'économie dispose d'un fonds résultant de la création du profit, ici pour la banque une créance de E2 une dette de E1 et d'un stock de bien de production chez E1,
- E2 finance une nouvelle production de biens de consommation,
- E2 paie des salaires à partir de sa trésorerie,
- E2 vend des biens de consommation,
- E2 achète des biens d'investissement à E1,
  - E2 a un solde bancaire null (négatif avec l'achat de biens d'investissement, positif avec la vente de biens de consommation),
- M n'a pas soldé son passif, il y a déficit de l'écoulement,
- E1 fourni à M un prêt excédentaire pour écouler sa production,
- M le dépense sous forme de titres ver E1,
- La dette de M est couverte par la créance de E1 (l'équilibre comptable est un déséquilibre économique).
### 3 - Création de l'amortissement
- E1 produit des biens d'investissement qu'il finance avec sa trésorerie
- E2 produit des biens de consommation et subi une depréciation de son capital physique
- E2 achète les biens d'investissement à E1, c'est de l'amortissement.
- M rembourse sa dette à la banque, ce qui crée un déficit de l'écoulement
- M consomme le reste ver E2
- À ce niveau un profit se forme entre E1 (+) et E2 (-)
- M sollicite un prêt excédentaire.
- M le dépense sous forme de titres ver E1
- E1 achète les biens à E2 qui deviennent des biens d'investissement
- E2 rembourse sa dette
- la dette de M se reproduit, elle est couverte par la créance de E1 (l'équilibre comptable est un déséquilibre économique)

## Monnaie internationale
En l'absence de banque centrale internationale, les échanges se font entre pays.
À ce stade, il faut distinguer 2 groupes de pays :
- ceux dont la monnaie est internationale (principalement les États-Unis),
- ceux qui se servent de la monnaie internationale pour leurs échanges.

Exportation
- Il s'agit d'opérations de consommation intermédiaire qui décrémentent le stock

Importation
- Il s'agit d'opérations de consommation intermédiaire qui incrémentent le stock
- Si le pays est importateur net, l'entreprise ou l'État doit émettre des titres auprès du reste du monde pour récupérer les fonds qui permettrons de payer via sa banque centrale le débit bancaire,
- La vente de titre n'est pas attachée à une opération réelle, c'est un escompte raté ou un refinancement sans opération réelle nationale.

