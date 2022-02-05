# Mini lotto game
<img src="https://i.imgur.com/uW8ZxjQ.png">
<img src="https://i.imgur.com/FkTQBy4.png">

## Cel: 
* projekt na zaliczenie przedmiotu "Protokoły Sieci Web" na pierwszym semestrze drugiego roku informatyki o profilu praktycznym na Wydziale MFI Uniwersytetu Gdańskiego.
## Temat projektu: 
Wybranym tematem projektu było stworzenie gry mini-lotto, która jest \
symulacją popularnej gry liczbowej Toto-lotek. \
W moim projekcie w przeciwieństwie do Toto-lotka wybieramy 5 liczb z zakresu 1-25. \
Prawdopodobieństwa trafienia n liczb prezentują się następująco:
* trafienie jednej liczby: ~ 45,6%
* trafienie dwóch liczb: ~ 21,5%
* trafienie trzech liczb: ~ 3,6%
* trafienie czterech liczb: ~ 0,002%
* trafienie pięciu liczb: ~ 0,000018%
    
## Koncepcja aplikacji:
* gry (losowania) po uruchomieniu publishera odpalane są \
w interwale co 10 sekund (+5 sekund moment losowania)
  
* do gry może dołączyć n zawodników (symulacji tego można dokonać)
za pomocą dwóch kart przeglądarki, np. jedna włączona "normalnie", a druga w trybie incognito
ze względu na zastosowanie ciasteczek.
  
* zawodnicy mogą dołączyć w każdym momencie, np. nawet dwie sekundy 
przed losowaniem, a i tak będą zakwalifikowani do gry.
  
* zawodnik bierze udział w losowaniach, dopóki nie opuści gry (w każdym momencie może zmienić wybrane numery
  na rzecz następnego/następnych losowań)
  
* aby wziąć udział w grze zawodnik musi dokonać rejestracji, a następnie zalogować się na swoje konto (niezalogowany zawodnik nie będzie miał możliwości zagrać, ani przeglądać większości zawartości aplikacji)

* zawodnicy mogą ze sobą korespondować za pomocą czatu w dwóch pokojach (PL/EN).

* zawodnicy mogą edytować/usunąć swoje konto, edytować wiadomości wysyłane na czat,
dodawać do swojego konta liczby, z których mogą skorzystać, jeśli chcą zagrać bez konieczności wybierania pięciu liczb za każdym razem.
  
## Użyte technologie i biblioteki:
### Frontend:
* React
  * Formik (+yup)
  * primereact
  * react-router-dom
* uuidv4
* material-ui-confirm
* lodash
* js-cookie
* axios
* MQTT
    
###  Backend:
* API (MongoDB)
* express
* cors
* mongoose
* MQTT
* fs
    
    
## Wymagania projektu wraz z wymienionymi zastosowaniami w projekcie:
### HTTP:
* CRUD-y:
    1. Zawodnicy:
        * GET
            * `/` pobranie wszystkich zawodników
            * `/:login` pobranie zawodnika o danym loginie
        * POST
            * `/` dodanie zawodnika do bazy
        * PUT
            * `/` edycja zawodnika w bazie
        * DELETE 
            * `/:login` usunięcie zawodnika o danym loginie
    2. Mecze:
        * GET
            * `/` pobranie listy rozegranych gier/losowań
        * POST
            * `/` dodanie gry/losowania do bazy
        * PUT
            * `/` edycja gry (dodanie zawodników, którzy wzięli udział w grze oraz wybranych przez nich liczb)
        * DELETE
            * `/:id` usunięcie gry z historii o danym id
    3. Czat:
        * GET
            * `/` pobranie historii wiadomości
        * POST
            * `/` dodanie wiadomości do historii czatu
        * PUT
            * `/:id` edycja wiadomości o danym id
        * DELETE
            * `/:id` usunięcie wiadomości o danym id
    4. Liczby:
        * GET
            * `/` pobranie wszystkich liczb zapisanych przez użytkowników
            * `/:user` pobranie liczb zapisanych przez danego użytkownika
        * POST
            * `/` dodanie do bazy liczb
        * PUT
            * `/:id` edycja liczb o podanym id
        * DELETE
            * `/:id` usunięcie liczb o podanym id
    
* Ciasteczka:
    * przechowywanie aktualnie zalogowanego użytkownika
    * przechowywanie liczb wybranych przez danego użytkownika
    
    
### MQTT:
 * Backend:
    1. rozsyłanie czasu pozostałego do losowania
    2. w momencie losowania dodawanie do bazy danej gry
    3. rozsyłanie id danej gry/losowania
    4. losowanie liczb
    5. publish wiadomości, którą ktoś napisze na czacie
    6. edycja wiadomości, którą ktoś edytuje
    
* Frontend:
    1. odbieranie wiadomości, którą ktoś wyśle oraz dodanie jej do bazy
    2. aktualizowanie czatu, jeśli ktoś edytuje wiadomość oraz edycja jej w bazie
    3. pobieranie id danej gry
    4. pobieranie czatu pozostałego do losowania danej gry
    5. otrzymywanie wyników gry oraz informacji o tym, ile liczb zgadliśmy, a następnie wpisanie tego do bazy (do historii)
    6. reakcja na wysłanie wiadomości na czacie
    7. nasłuchiwanie na różnych pokojach czatu (można przełączać pomiędzy pokojami)
    
    
### Inne:
* dwa pokoje czatu (PL/EN)
* możliwość logowania i rejestracji z szyfrowaniem haseł
* zastosowanie certyfikatu SSL (self-signed certificate)
* role użytkowników (niezalogowany użytkownik ma ograniczone możliwości poruszania po aplikacji). Istnieje rola admina - admin może zarządzać użytkownikami (usuwać ich konta), eksportować do pliku `.json` historię gier.
* funkcjonalność powtarza się na n-stronach/kontach (może grac kilku zawodników na raz, każdy ma tę samą grę i widzą ten sam czat (chyba, że są na różnych pokojach))
* Logi: eksport do pliku `.json` historii gier


### Z czego nie jestem zadowolony?
Z racji tego, że projekt był robiony dosyć na szybko, to skupiłem się na funkcjonalności, która była głównym celem projektu (głównie zastosowanie HTTP i MQTT), a odpuściłem stylowanie, w związku z tym zostawiłem m.in. "brzydkie" alerty, bordery itp.


### Problem z uruchomieniem
Był duży problem z konfiguracją brokera oraz Reacta pod MQTT, aby wszystko działało - musiałem między innymi skorzystać ze starszej wersji Reacta oraz plik konfiguracyjny brokera MQTT musiał wyglądać tak:
<img src="https://i.imgur.com/6g93AZJ.png"/>
Jednak i to nie gwarantuje, że u każdego MQTT zadziała.
Jeśli chodzi o certyfikat SSL, to należy stworzyć swój klucz prywatny do folderu `.cert/keyNoPass.key` (klucz bez hasła). Obecnie plik jest pusty, ponieważ usunąłem swój klucz. Podobnie jeśli chodzi o `localhost-key.pem` (go również zostawiam pustego).
Aby uruchomić bez certyfikatu, gdyby były jakieś problemy, to w `package.json` należy w scripts.starts zostawić samo `react-scripts start`


