import { Question, MiniGameConnect, MiniGameSort, MiniGameDef } from './types';

export const builtInQuestions: Question[] = [
  // ============================================================
  // GEOGRAFIA (20 questions)
  // ============================================================
  // Easy
  { id: 'pl-001', question: 'Jaka jest stolica Polski?', answers: ['Kraków', 'Warszawa', 'Gdańsk', 'Wrocław'], correctIndex: 1, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-002', question: 'Jaka jest najdłuższa rzeka w Polsce?', answers: ['Odra', 'Bug', 'Wisła', 'Warta'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-003', question: 'Jaka jest waluta Japonii?', answers: ['Yuan', 'Won', 'Jen', 'Rupia'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-004', question: 'Który ocean jest największy?', answers: ['Atlantycki', 'Indyjski', 'Arktyczny', 'Spokojny'], correctIndex: 3, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-005', question: 'Która góra jest najwyższa na świecie?', answers: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-006', question: 'Ile jest kontynentów na Ziemi?', answers: ['5', '6', '7', '8'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-007', question: 'W którym mieście znajduje się Wawel?', answers: ['Warszawa', 'Poznań', 'Kraków', 'Gdańsk'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-008', question: 'Które miasto jest stolicą Francji?', answers: ['Lyon', 'Marsylia', 'Paryż', 'Nicea'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  // Medium
  { id: 'pl-009', question: 'Jaki jest najwyższy szczyt w Polsce?', answers: ['Śnieżka', 'Rysy', 'Babia Góra', 'Kasprowy Wierch'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-010', question: 'Który kraj ma największą populację na świecie?', answers: ['Chiny', 'Indie', 'USA', 'Indonezja'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-011', question: 'Jak nazywa się najgłębszy punkt na Ziemi?', answers: ['Rów Mariański', 'Rów Jawajski', 'Rów Filipiński', 'Rów Tonga'], correctIndex: 0, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-012', question: 'Jak nazywa się najdłuższa rzeka na świecie?', answers: ['Amazonka', 'Nil', 'Jangcy', 'Missisipi'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-013', question: 'Które jezioro jest największe w Polsce?', answers: ['Mamry', 'Śniardwy', 'Morskie Oko', 'Gopło'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-014', question: 'Na którym kontynencie znajduje się Sahara?', answers: ['Azja', 'Ameryka Południowa', 'Afryka', 'Australia'], correctIndex: 2, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-015', question: 'Ile województw ma Polska?', answers: ['14', '15', '16', '17'], correctIndex: 2, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-016', question: 'Który kraj jest największy pod względem powierzchni?', answers: ['Kanada', 'Chiny', 'USA', 'Rosja'], correctIndex: 3, category: 'Geografia', difficulty: 'medium' },
  // Hard
  { id: 'pl-017', question: 'Jaka jest stolica Burkina Faso?', answers: ['Wagadugu', 'Bamako', 'Niamey', 'Lomé'], correctIndex: 0, category: 'Geografia', difficulty: 'hard' },
  { id: 'pl-018', question: 'Która rzeka przepływa przez największą liczbę stolic europejskich?', answers: ['Ren', 'Dunaj', 'Łaba', 'Wisła'], correctIndex: 1, category: 'Geografia', difficulty: 'hard' },
  { id: 'pl-019', question: 'Jak nazywa się najwyższy czynny wulkan w Europie?', answers: ['Wezuwiusz', 'Etna', 'Stromboli', 'Hekla'], correctIndex: 1, category: 'Geografia', difficulty: 'hard' },
  { id: 'pl-020', question: 'W jakim paśmie górskim leży K2?', answers: ['Himalaje', 'Karakorum', 'Hindukusz', 'Pamir'], correctIndex: 1, category: 'Geografia', difficulty: 'hard' },

  // ============================================================
  // HISTORIA (18 questions)
  // ============================================================
  // Easy
  { id: 'pl-021', question: 'W którym roku Polska odzyskała niepodległość?', answers: ['1918', '1920', '1910', '1945'], correctIndex: 0, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-022', question: 'W jakim roku człowiek po raz pierwszy stanął na Księżycu?', answers: ['1965', '1969', '1971', '1973'], correctIndex: 1, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-023', question: 'W którym roku rozpoczęła się II wojna światowa?', answers: ['1937', '1938', '1939', '1940'], correctIndex: 2, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-024', question: 'Kto był pierwszym królem Polski?', answers: ['Mieszko I', 'Bolesław Chrobry', 'Kazimierz Wielki', 'Władysław Łokietek'], correctIndex: 1, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-025', question: 'Jak nazywał się statek, którym Kolumb dotarł do Ameryki?', answers: ['Victoria', 'Santa Maria', 'Mayflower', 'Endeavour'], correctIndex: 1, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-026', question: 'Który mur podzielił Berlin na dwie części?', answers: ['Wielki Mur', 'Mur Berliński', 'Mur Hadriana', 'Linia Maginota'], correctIndex: 1, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-027', question: 'Kto był pierwszym prezydentem USA?', answers: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], correctIndex: 2, category: 'Historia', difficulty: 'easy' },
  // Medium
  { id: 'pl-028', question: 'W którym roku odbyła się bitwa pod Grunwaldem?', answers: ['1385', '1410', '1466', '1525'], correctIndex: 1, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-029', question: 'Kto wynalazł telefon?', answers: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], correctIndex: 2, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-030', question: 'W którym roku Polska wstąpiła do Unii Europejskiej?', answers: ['2000', '2002', '2004', '2007'], correctIndex: 2, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-031', question: 'Jak nazywał się ostatni król Polski?', answers: ['Stanisław August Poniatowski', 'Jan III Sobieski', 'August III Sas', 'Zygmunt III Waza'], correctIndex: 0, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-032', question: 'W którym roku upadł Mur Berliński?', answers: ['1987', '1989', '1991', '1993'], correctIndex: 1, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-033', question: 'Kto dowodził wojskami polskimi w bitwie pod Grunwaldem?', answers: ['Kazimierz Wielki', 'Władysław Jagiełło', 'Jan III Sobieski', 'Stefan Batory'], correctIndex: 1, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-034', question: 'W którym roku odbyła się bitwa pod Wiedniem?', answers: ['1610', '1683', '1709', '1772'], correctIndex: 1, category: 'Historia', difficulty: 'medium' },
  // Hard
  { id: 'pl-035', question: 'Która bitwa zakończyła epokę napoleońską?', answers: ['Bitwa pod Austerlitz', 'Bitwa pod Waterloo', 'Bitwa pod Lipskiem', 'Bitwa pod Borodino'], correctIndex: 1, category: 'Historia', difficulty: 'hard' },
  { id: 'pl-036', question: 'W którym roku doszło do pierwszego rozbioru Polski?', answers: ['1768', '1772', '1791', '1795'], correctIndex: 1, category: 'Historia', difficulty: 'hard' },
  { id: 'pl-037', question: 'Jak nazywał się traktat kończący I wojnę światową?', answers: ['Traktat wersalski', 'Traktat paryski', 'Pokój westfalski', 'Traktat z Trianon'], correctIndex: 0, category: 'Historia', difficulty: 'hard' },
  { id: 'pl-038', question: 'Który polski król zwyciężył pod Warną w 1444?', answers: ['Władysław III Warneńczyk', 'Kazimierz IV Jagiellończyk', 'Jan Olbracht', 'Zygmunt I Stary'], correctIndex: 0, category: 'Historia', difficulty: 'hard' },

  // ============================================================
  // NAUKA (17 questions)
  // ============================================================
  // Easy
  { id: 'pl-039', question: 'Który polski naukowiec odkrył polon i rad?', answers: ['Mikołaj Kopernik', 'Maria Skłodowska-Curie', 'Jan Czochralski', 'Marian Smoluchowski'], correctIndex: 1, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-040', question: 'Jaki gaz stanowi największą część atmosfery Ziemi?', answers: ['Tlen', 'Dwutlenek węgla', 'Azot', 'Argon'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-041', question: 'Który planet jest najbliżej Słońca?', answers: ['Wenus', 'Mars', 'Merkury', 'Ziemia'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-042', question: 'Kto jest autorem teorii względności?', answers: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Max Planck'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-043', question: 'Ile planet jest w Układzie Słonecznym?', answers: ['7', '8', '9', '10'], correctIndex: 1, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-044', question: 'Jaka siła utrzymuje nas na powierzchni Ziemi?', answers: ['Siła magnetyczna', 'Grawitacja', 'Siła odśrodkowa', 'Siła elektrostatyczna'], correctIndex: 1, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-045', question: 'Co obracał model heliocentryczny Kopernika?', answers: ['Księżyc wokół Słońca', 'Słońce wokół Ziemi', 'Ziemię wokół Słońca', 'Gwiazdy wokół Ziemi'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  // Medium
  { id: 'pl-046', question: 'Jak nazywa się najbliższa gwiazda do Słońca?', answers: ['Syriusz', 'Proxima Centauri', 'Alfa Centauri A', 'Barnarda'], correctIndex: 1, category: 'Nauka', difficulty: 'medium' },
  { id: 'pl-047', question: 'Co to jest fotosynteza?', answers: ['Rozkład materii organicznej', 'Proces wytwarzania energii z glukozy', 'Proces wytwarzania glukozy ze światła', 'Oddychanie komórkowe roślin'], correctIndex: 2, category: 'Nauka', difficulty: 'medium' },
  { id: 'pl-048', question: 'Jaki jest trzeci stan skupienia materii obok stałego i ciekłego?', answers: ['Plazma', 'Gazowy', 'Nadciekły', 'Kriogeniczny'], correctIndex: 1, category: 'Nauka', difficulty: 'medium' },
  { id: 'pl-049', question: 'Który teleskop kosmiczny został wystrzelony w 1990 roku?', answers: ['James Webb', 'Hubble', 'Kepler', 'Spitzer'], correctIndex: 1, category: 'Nauka', difficulty: 'medium' },
  { id: 'pl-050', question: 'Jak nazywa się proces, w którym ciecz przechodzi w gaz?', answers: ['Kondensacja', 'Sublimacja', 'Parowanie', 'Topnienie'], correctIndex: 2, category: 'Nauka', difficulty: 'medium' },
  { id: 'pl-051', question: 'Kto sformułował trzy prawa ruchu?', answers: ['Galileusz', 'Kepler', 'Newton', 'Einstein'], correctIndex: 2, category: 'Nauka', difficulty: 'medium' },
  // Hard
  { id: 'pl-052', question: 'Ile trwa rok świetlny w ziemskich latach?', answers: ['To nie jednostka czasu', '100 lat', '1000 lat', '1 rok'], correctIndex: 0, category: 'Nauka', difficulty: 'hard' },
  { id: 'pl-053', question: 'Jak nazywa się cząstka elementarna będąca nośnikiem siły elektromagnetycznej?', answers: ['Gluon', 'Foton', 'Grawiton', 'Bozon W'], correctIndex: 1, category: 'Nauka', difficulty: 'hard' },
  { id: 'pl-054', question: 'Jaka jest temperatura zera absolutnego w stopniach Celsjusza?', answers: ['-273,15°C', '-300°C', '-255,15°C', '-0°C'], correctIndex: 0, category: 'Nauka', difficulty: 'hard' },
  { id: 'pl-055', question: 'Który pierwiastek ma najwyższą liczbę atomową występującą naturalnie?', answers: ['Pluton', 'Uran', 'Rad', 'Tor'], correctIndex: 1, category: 'Nauka', difficulty: 'hard' },

  // ============================================================
  // LITERATURA (12 questions)
  // ============================================================
  // Easy
  { id: 'pl-056', question: 'Kto napisał "Pan Tadeusz"?', answers: ['Juliusz Słowacki', 'Henryk Sienkiewicz', 'Adam Mickiewicz', 'Bolesław Prus'], correctIndex: 2, category: 'Literatura', difficulty: 'easy' },
  { id: 'pl-057', question: 'Jak ma na imię główna bohaterka "Lalki" Prusa?', answers: ['Izabela', 'Helena', 'Ewa', 'Maria'], correctIndex: 0, category: 'Literatura', difficulty: 'easy' },
  { id: 'pl-058', question: 'Kto napisał "Dziady"?', answers: ['Juliusz Słowacki', 'Adam Mickiewicz', 'Cyprian Kamil Norwid', 'Aleksander Fredro'], correctIndex: 1, category: 'Literatura', difficulty: 'easy' },
  { id: 'pl-059', question: 'Który autor napisał "Przygody Tomka Sawyera"?', answers: ['Charles Dickens', 'Mark Twain', 'Jules Verne', 'Jack London'], correctIndex: 1, category: 'Literatura', difficulty: 'easy' },
  // Medium
  { id: 'pl-060', question: 'Kto napisał "Quo Vadis"?', answers: ['Bolesław Prus', 'Henryk Sienkiewicz', 'Stefan Żeromski', 'Władysław Reymont'], correctIndex: 1, category: 'Literatura', difficulty: 'medium' },
  { id: 'pl-061', question: 'Który polski pisarz otrzymał Nagrodę Nobla za "Chłopów"?', answers: ['Henryk Sienkiewicz', 'Czesław Miłosz', 'Władysław Reymont', 'Wisława Szymborska'], correctIndex: 2, category: 'Literatura', difficulty: 'medium' },
  { id: 'pl-062', question: 'Kto jest autorem "Ferdydurke"?', answers: ['Witold Gombrowicz', 'Bruno Schulz', 'Stanisław Lem', 'Sławomir Mrożek'], correctIndex: 0, category: 'Literatura', difficulty: 'medium' },
  { id: 'pl-063', question: 'Jak nazywa się główny bohater "Zbrodni i kary" Dostojewskiego?', answers: ['Iwan Karamazow', 'Rodion Raskolnikow', 'Książę Myszkin', 'Stawrogin'], correctIndex: 1, category: 'Literatura', difficulty: 'medium' },
  { id: 'pl-064', question: 'Kto napisał "Solaris"?', answers: ['Stanisław Lem', 'Isaac Asimov', 'Arthur C. Clarke', 'Philip K. Dick'], correctIndex: 0, category: 'Literatura', difficulty: 'medium' },
  // Hard
  { id: 'pl-065', question: 'Która polska poetka otrzymała Nagrodę Nobla w 1996 roku?', answers: ['Wisława Szymborska', 'Anna Świrszczyńska', 'Halina Poświatowska', 'Julia Hartwig'], correctIndex: 0, category: 'Literatura', difficulty: 'hard' },
  { id: 'pl-066', question: 'Jak nazywa się powieść Olgi Tokarczuk nagrodzona Bookerem w 2018?', answers: ['Bieguni', 'Prowadź swój pług przez kości umarłych', 'Księgi Jakubowe', 'Dom dzienny, dom nocny'], correctIndex: 0, category: 'Literatura', difficulty: 'hard' },
  { id: 'pl-067', question: 'Kto jest autorem "Traktatu moralnego"?', answers: ['Zbigniew Herbert', 'Czesław Miłosz', 'Tadeusz Różewicz', 'Wisława Szymborska'], correctIndex: 1, category: 'Literatura', difficulty: 'hard' },

  // ============================================================
  // MUZYKA (12 questions)
  // ============================================================
  // Easy
  { id: 'pl-068', question: 'Ile strun ma standardowa gitara klasyczna?', answers: ['4', '5', '6', '8'], correctIndex: 2, category: 'Muzyka', difficulty: 'easy' },
  { id: 'pl-069', question: 'Który instrument klawiszowy jest najpopularniejszy?', answers: ['Klawesyn', 'Fortepian', 'Organy', 'Akordeon'], correctIndex: 1, category: 'Muzyka', difficulty: 'easy' },
  { id: 'pl-070', question: 'Ile nut ma podstawowa gama muzyczna?', answers: ['5', '6', '7', '8'], correctIndex: 2, category: 'Muzyka', difficulty: 'easy' },
  { id: 'pl-071', question: 'Z jakiego kraju pochodzi Fryderyk Chopin?', answers: ['Austria', 'Niemcy', 'Polska', 'Francja'], correctIndex: 2, category: 'Muzyka', difficulty: 'easy' },
  // Medium
  { id: 'pl-072', question: 'Który kompozytor jest autorem "Etiud Rewolucyjnych"?', answers: ['Ludwig van Beethoven', 'Fryderyk Chopin', 'Wolfgang Amadeus Mozart', 'Franz Liszt'], correctIndex: 1, category: 'Muzyka', difficulty: 'medium' },
  { id: 'pl-073', question: 'Kto skomponował "Cztery pory roku"?', answers: ['Bach', 'Vivaldi', 'Handel', 'Haydn'], correctIndex: 1, category: 'Muzyka', difficulty: 'medium' },
  { id: 'pl-074', question: 'Który zespół rockowy wydał album "The Dark Side of the Moon"?', answers: ['Led Zeppelin', 'The Beatles', 'Pink Floyd', 'The Rolling Stones'], correctIndex: 2, category: 'Muzyka', difficulty: 'medium' },
  { id: 'pl-075', question: 'Ile jest nut w oktawie chromatycznej?', answers: ['7', '10', '12', '14'], correctIndex: 2, category: 'Muzyka', difficulty: 'medium' },
  { id: 'pl-076', question: 'Który polski muzyk zasłynął z utworu "Kaczuchy"?', answers: ['Zbigniew Wodecki', 'Czesław Niemen', 'Krzysztof Krawczyk', 'Maryla Rodowicz'], correctIndex: 0, category: 'Muzyka', difficulty: 'medium' },
  // Hard
  { id: 'pl-077', question: 'Który polski kompozytor napisał operę "Halka"?', answers: ['Karol Szymanowski', 'Stanisław Moniuszko', 'Henryk Wieniawski', 'Ignacy Jan Paderewski'], correctIndex: 1, category: 'Muzyka', difficulty: 'hard' },
  { id: 'pl-078', question: 'Jak nazywa się technika gry na skrzypcach polegająca na szarpaniu strun?', answers: ['Staccato', 'Vibrato', 'Pizzicato', 'Tremolo'], correctIndex: 2, category: 'Muzyka', difficulty: 'hard' },
  { id: 'pl-079', question: 'Który kompozytor napisał "Ognistego ptaka"?', answers: ['Siergiej Prokofiew', 'Igor Strawiński', 'Dmitrij Szostakowicz', 'Siergiej Rachmaninow'], correctIndex: 1, category: 'Muzyka', difficulty: 'hard' },

  // ============================================================
  // SZTUKA (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-080', question: 'Kto namalował "Mona Lisę"?', answers: ['Michał Anioł', 'Leonardo da Vinci', 'Rafael', 'Botticelli'], correctIndex: 1, category: 'Sztuka', difficulty: 'easy' },
  { id: 'pl-081', question: 'Jak nazywa się najbardziej znane muzeum w Paryżu?', answers: ['Orsay', 'Luwr', 'Pompidou', 'Rodin'], correctIndex: 1, category: 'Sztuka', difficulty: 'easy' },
  { id: 'pl-082', question: 'Jakim kolorem otrzymujemy po zmieszaniu niebieskiego i żółtego?', answers: ['Pomarańczowy', 'Fioletowy', 'Zielony', 'Brązowy'], correctIndex: 2, category: 'Sztuka', difficulty: 'easy' },
  // Medium
  { id: 'pl-083', question: 'Kto namalował "Bitwę pod Grunwaldem"?', answers: ['Jan Matejko', 'Stanisław Wyspiański', 'Jacek Malczewski', 'Józef Chełmoński'], correctIndex: 0, category: 'Sztuka', difficulty: 'medium' },
  { id: 'pl-084', question: 'W jakim stylu architektonicznym zbudowana jest katedra Notre-Dame?', answers: ['Romański', 'Gotycki', 'Barokowy', 'Renesansowy'], correctIndex: 1, category: 'Sztuka', difficulty: 'medium' },
  { id: 'pl-085', question: 'Kto namalował "Gwiaździstą noc"?', answers: ['Claude Monet', 'Vincent van Gogh', 'Paul Cézanne', 'Edgar Degas'], correctIndex: 1, category: 'Sztuka', difficulty: 'medium' },
  { id: 'pl-086', question: 'Jak nazywa się kierunek w sztuce zapoczątkowany przez Moneta?', answers: ['Ekspresjonizm', 'Kubizm', 'Impresjonizm', 'Surrealizm'], correctIndex: 2, category: 'Sztuka', difficulty: 'medium' },
  { id: 'pl-087', question: 'Kto wyrzeźbił "Dawida" ze słynnego marmurowego posągu?', answers: ['Donatello', 'Michał Anioł', 'Bernini', 'Rodin'], correctIndex: 1, category: 'Sztuka', difficulty: 'medium' },
  // Hard
  { id: 'pl-088', question: 'Który polski malarz namalował "Szał uniesień"?', answers: ['Jacek Malczewski', 'Władysław Podkowiński', 'Józef Mehoffer', 'Leon Wyczółkowski'], correctIndex: 1, category: 'Sztuka', difficulty: 'hard' },
  { id: 'pl-089', question: 'Jak nazywa się technika malarska polegająca na nakładaniu grubych warstw farby?', answers: ['Sfumato', 'Impasto', 'Chiaroscuro', 'Trompe-l\'oeil'], correctIndex: 1, category: 'Sztuka', difficulty: 'hard' },

  // ============================================================
  // BIOLOGIA (12 questions)
  // ============================================================
  // Easy
  { id: 'pl-090', question: 'Ile nóg ma pająk?', answers: ['6', '8', '10', '12'], correctIndex: 1, category: 'Biologia', difficulty: 'easy' },
  { id: 'pl-091', question: 'Które zwierzę jest największym ssakiem lądowym?', answers: ['Nosorożec biały', 'Słoń afrykański', 'Hipopotam', 'Żyrafa'], correctIndex: 1, category: 'Biologia', difficulty: 'easy' },
  { id: 'pl-092', question: 'Jak nazywa się proces oddychania roślin?', answers: ['Fotosynteza', 'Oddychanie komórkowe', 'Fermentacja', 'Transpiracja'], correctIndex: 1, category: 'Biologia', difficulty: 'easy' },
  { id: 'pl-093', question: 'Ile nóg ma owad?', answers: ['4', '6', '8', '10'], correctIndex: 1, category: 'Biologia', difficulty: 'easy' },
  // Medium
  { id: 'pl-094', question: 'Jaki jest największy organ w ludzkim ciele?', answers: ['Serce', 'Wątroba', 'Płuca', 'Skóra'], correctIndex: 3, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-095', question: 'Ile kości ma dorosły człowiek?', answers: ['186', '206', '226', '246'], correctIndex: 1, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-096', question: 'Ile chromosomów ma człowiek?', answers: ['23', '44', '46', '48'], correctIndex: 2, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-097', question: 'Jak nazywa się organellum komórkowe odpowiedzialne za produkcję energii?', answers: ['Rybosomy', 'Mitochondria', 'Lizosomy', 'Aparat Golgiego'], correctIndex: 1, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-098', question: 'Jaka grupa krwi jest uniwersalnym dawcą?', answers: ['A', 'B', 'AB', '0 Rh-'], correctIndex: 3, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-099', question: 'Jak nazywa się białko transportujące tlen we krwi?', answers: ['Albumina', 'Hemoglobina', 'Fibrynogen', 'Insulina'], correctIndex: 1, category: 'Biologia', difficulty: 'medium' },
  // Hard
  { id: 'pl-100', question: 'Jaka jest przybliżona długość ludzkiego DNA rozwinięta z jednej komórki?', answers: ['1 cm', '10 cm', '2 metry', '3 metry'], correctIndex: 2, category: 'Biologia', difficulty: 'hard' },
  { id: 'pl-101', question: 'Który enzym rozkłada skrobię w ślinie?', answers: ['Pepsyna', 'Lipaza', 'Amylaza', 'Trypsyna'], correctIndex: 2, category: 'Biologia', difficulty: 'hard' },

  // ============================================================
  // CHEMIA (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-102', question: 'Jaki jest wzór chemiczny wody?', answers: ['HO', 'H2O', 'H2O2', 'OH2'], correctIndex: 1, category: 'Chemia', difficulty: 'easy' },
  { id: 'pl-103', question: 'Jaki gaz wydychamy podczas oddychania?', answers: ['Azot', 'Tlen', 'Dwutlenek węgla', 'Hel'], correctIndex: 2, category: 'Chemia', difficulty: 'easy' },
  { id: 'pl-104', question: 'Jaki jest symbol chemiczny tlenu?', answers: ['Tl', 'O', 'Ox', 'T'], correctIndex: 1, category: 'Chemia', difficulty: 'easy' },
  // Medium
  { id: 'pl-105', question: 'Jaki pierwiastek chemiczny oznaczamy symbolem "Fe"?', answers: ['Fluor', 'Fosfor', 'Żelazo', 'Francium'], correctIndex: 2, category: 'Chemia', difficulty: 'medium' },
  { id: 'pl-106', question: 'Jaki jest symbol chemiczny złota?', answers: ['Ag', 'Au', 'Zn', 'Cu'], correctIndex: 1, category: 'Chemia', difficulty: 'medium' },
  { id: 'pl-107', question: 'Jakie pH ma roztwór obojętny?', answers: ['0', '5', '7', '14'], correctIndex: 2, category: 'Chemia', difficulty: 'medium' },
  { id: 'pl-108', question: 'Co oznacza symbol Ag w tablicy Mendelejewa?', answers: ['Argon', 'Aluminium', 'Srebro', 'Arsen'], correctIndex: 2, category: 'Chemia', difficulty: 'medium' },
  // Hard
  { id: 'pl-109', question: 'Który metal jest najlżejszy?', answers: ['Aluminium', 'Lit', 'Magnez', 'Sód'], correctIndex: 1, category: 'Chemia', difficulty: 'hard' },
  { id: 'pl-110', question: 'Ile wynosi liczba Avogadra (w przybliżeniu)?', answers: ['6,022 × 10²³', '3,14 × 10²²', '1,38 × 10²³', '9,81 × 10²⁴'], correctIndex: 0, category: 'Chemia', difficulty: 'hard' },
  { id: 'pl-111', question: 'Jaki jest najczęstszy izotop wodoru?', answers: ['Deuter', 'Tryt', 'Prot', 'Protium'], correctIndex: 3, category: 'Chemia', difficulty: 'hard' },

  // ============================================================
  // FIZYKA (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-112', question: 'W jakich jednostkach mierzymy siłę?', answers: ['Waty', 'Niutony', 'Dżule', 'Paskale'], correctIndex: 1, category: 'Fizyka', difficulty: 'easy' },
  { id: 'pl-113', question: 'Jak nazywa się jednostka prądu elektrycznego?', answers: ['Wolt', 'Amper', 'Om', 'Wat'], correctIndex: 1, category: 'Fizyka', difficulty: 'easy' },
  { id: 'pl-114', question: 'Co przyciąga magnes?', answers: ['Drewno', 'Szkło', 'Żelazo', 'Plastik'], correctIndex: 2, category: 'Fizyka', difficulty: 'easy' },
  // Medium
  { id: 'pl-115', question: 'Jaka jest prędkość światła w próżni (w przybliżeniu)?', answers: ['200 000 km/s', '300 000 km/s', '400 000 km/s', '150 000 km/s'], correctIndex: 1, category: 'Fizyka', difficulty: 'medium' },
  { id: 'pl-116', question: 'Jakim wzorem opisana jest energia kinetyczna?', answers: ['E = mc²', 'E = ½mv²', 'E = mgh', 'E = Fs'], correctIndex: 1, category: 'Fizyka', difficulty: 'medium' },
  { id: 'pl-117', question: 'Jaka jest jednostka ciśnienia w układzie SI?', answers: ['Bar', 'Atmosfera', 'Paskal', 'Torr'], correctIndex: 2, category: 'Fizyka', difficulty: 'medium' },
  { id: 'pl-118', question: 'Ile wynosi przyspieszenie ziemskie (w przybliżeniu)?', answers: ['8,91 m/s²', '9,81 m/s²', '10,81 m/s²', '11,81 m/s²'], correctIndex: 1, category: 'Fizyka', difficulty: 'medium' },
  // Hard
  { id: 'pl-119', question: 'Jak nazywa się zjawisko zmiany częstotliwości fali przy ruchu źródła?', answers: ['Efekt Dopplera', 'Efekt Comptona', 'Efekt fotoelektryczny', 'Efekt Halla'], correctIndex: 0, category: 'Fizyka', difficulty: 'hard' },
  { id: 'pl-120', question: 'Jaka jest stała Plancka w przybliżeniu?', answers: ['6,626 × 10⁻³⁴ J·s', '1,602 × 10⁻¹⁹ J·s', '9,109 × 10⁻³¹ J·s', '3,0 × 10⁸ J·s'], correctIndex: 0, category: 'Fizyka', difficulty: 'hard' },
  { id: 'pl-121', question: 'Jak nazywa się zasada, że nie można jednocześnie dokładnie zmierzyć położenia i pędu cząstki?', answers: ['Zasada zachowania energii', 'Zasada nieoznaczoności Heisenberga', 'Zasada komplementarności Bohra', 'Zasada ekwiwalencji'], correctIndex: 1, category: 'Fizyka', difficulty: 'hard' },

  // ============================================================
  // MATEMATYKA (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-122', question: 'Ile wynosi pierwiastek kwadratowy z 144?', answers: ['10', '11', '12', '14'], correctIndex: 2, category: 'Matematyka', difficulty: 'easy' },
  { id: 'pl-123', question: 'Ile wynosi liczba Pi (π) zaokrąglona do dwóch miejsc po przecinku?', answers: ['3,14', '3,16', '3,12', '3,18'], correctIndex: 0, category: 'Matematyka', difficulty: 'easy' },
  { id: 'pl-124', question: 'Ile kątów ma trójkąt?', answers: ['2', '3', '4', '5'], correctIndex: 1, category: 'Matematyka', difficulty: 'easy' },
  { id: 'pl-125', question: 'Ile to jest 7 × 8?', answers: ['54', '56', '58', '64'], correctIndex: 1, category: 'Matematyka', difficulty: 'easy' },
  // Medium
  { id: 'pl-126', question: 'Jak nazywa się twierdzenie o kwadracie przyprostokątnych i przeciwprostokątnej?', answers: ['Twierdzenie Talesa', 'Twierdzenie Pitagorasa', 'Twierdzenie Euklidesa', 'Twierdzenie Fermata'], correctIndex: 1, category: 'Matematyka', difficulty: 'medium' },
  { id: 'pl-127', question: 'Ile wynosi silnia z 5 (5!)?', answers: ['60', '100', '120', '150'], correctIndex: 2, category: 'Matematyka', difficulty: 'medium' },
  { id: 'pl-128', question: 'Jaka jest suma kątów w trójkącie?', answers: ['90°', '180°', '270°', '360°'], correctIndex: 1, category: 'Matematyka', difficulty: 'medium' },
  { id: 'pl-129', question: 'Co to jest liczba pierwsza?', answers: ['Podzielna przez 1 i 2', 'Podzielna tylko przez 1 i siebie', 'Każda liczba nieparzysta', 'Każda liczba naturalna'], correctIndex: 1, category: 'Matematyka', difficulty: 'medium' },
  // Hard
  { id: 'pl-130', question: 'Ile wynosi e (liczba Eulera) w przybliżeniu?', answers: ['2,414', '2,618', '2,718', '3,141'], correctIndex: 2, category: 'Matematyka', difficulty: 'hard' },
  { id: 'pl-131', question: 'Jaka jest pochodna funkcji sin(x)?', answers: ['-cos(x)', 'cos(x)', 'sin(x)', '-sin(x)'], correctIndex: 1, category: 'Matematyka', difficulty: 'hard' },

  // ============================================================
  // INFORMATYKA (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-132', question: 'Co oznacza skrót HTML?', answers: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Layout', 'Home Tool Markup Language'], correctIndex: 0, category: 'Informatyka', difficulty: 'easy' },
  { id: 'pl-133', question: 'Ile bitów ma jeden bajt?', answers: ['4', '6', '8', '16'], correctIndex: 2, category: 'Informatyka', difficulty: 'easy' },
  { id: 'pl-134', question: 'Jak nazywa się "mózg" komputera?', answers: ['RAM', 'GPU', 'CPU', 'SSD'], correctIndex: 2, category: 'Informatyka', difficulty: 'easy' },
  { id: 'pl-135', question: 'Jaki system liczbowy używa komputerach na najniższym poziomie?', answers: ['Dziesiątkowy', 'Ósemkowy', 'Szesnastkowy', 'Dwójkowy'], correctIndex: 3, category: 'Informatyka', difficulty: 'easy' },
  // Medium
  { id: 'pl-136', question: 'Jaki język programowania stworzył Guido van Rossum?', answers: ['Java', 'Ruby', 'Python', 'JavaScript'], correctIndex: 2, category: 'Informatyka', difficulty: 'medium' },
  { id: 'pl-137', question: 'Co oznacza skrót SQL?', answers: ['Standard Query Language', 'Structured Query Language', 'System Query Logic', 'Simple Question Language'], correctIndex: 1, category: 'Informatyka', difficulty: 'medium' },
  { id: 'pl-138', question: 'Kto jest twórcą systemu Linux?', answers: ['Bill Gates', 'Steve Jobs', 'Linus Torvalds', 'Dennis Ritchie'], correctIndex: 2, category: 'Informatyka', difficulty: 'medium' },
  { id: 'pl-139', question: 'Jak nazywa się algorytm sortowania o złożoności O(n log n) wykorzystujący dzielenie i zwyciężanie?', answers: ['Bubble Sort', 'Quick Sort', 'Insertion Sort', 'Selection Sort'], correctIndex: 1, category: 'Informatyka', difficulty: 'medium' },
  // Hard
  { id: 'pl-140', question: 'W jakim roku Tim Berners-Lee wynalazł World Wide Web?', answers: ['1985', '1989', '1993', '1995'], correctIndex: 1, category: 'Informatyka', difficulty: 'hard' },
  { id: 'pl-141', question: 'Jak nazywa się problem w informatyce, czy P = NP?', answers: ['Problem stopu', 'Problem plecakowy', 'Problem milenijny P vs NP', 'Problem komiwojażera'], correctIndex: 2, category: 'Informatyka', difficulty: 'hard' },

  // ============================================================
  // SPORT (12 questions)
  // ============================================================
  // Easy
  { id: 'pl-142', question: 'Ile graczy liczy drużyna piłkarska na boisku?', answers: ['9', '10', '11', '12'], correctIndex: 2, category: 'Sport', difficulty: 'easy' },
  { id: 'pl-143', question: 'Co ile lat odbywają się Letnie Igrzyska Olimpijskie?', answers: ['2', '3', '4', '5'], correctIndex: 2, category: 'Sport', difficulty: 'easy' },
  { id: 'pl-144', question: 'Jak nazywa się największe wydarzenie piłkarskie na świecie?', answers: ['Liga Mistrzów', 'Mistrzostwa Świata FIFA', 'Euro', 'Copa America'], correctIndex: 1, category: 'Sport', difficulty: 'easy' },
  { id: 'pl-145', question: 'Ile setów trzeba wygrać, aby zwyciężyć mecz tenisowy w turnieju wielkoszlemowym mężczyzn?', answers: ['2', '3', '4', '5'], correctIndex: 1, category: 'Sport', difficulty: 'easy' },
  // Medium
  { id: 'pl-146', question: 'Który polski piłkarz strzelił gola w finale Ligi Mistrzów w 2013?', answers: ['Robert Lewandowski', 'Jakub Błaszczykowski', 'Łukasz Piszczek', 'Kamil Grosicki'], correctIndex: 0, category: 'Sport', difficulty: 'medium' },
  { id: 'pl-147', question: 'Ile wynosi dystans biegu maratońskiego?', answers: ['40,195 km', '42,195 km', '44,195 km', '45 km'], correctIndex: 1, category: 'Sport', difficulty: 'medium' },
  { id: 'pl-148', question: 'W którym sporcie rywalizuje się na ringu?', answers: ['Judo', 'Boks', 'Zapasy', 'Karate'], correctIndex: 1, category: 'Sport', difficulty: 'medium' },
  { id: 'pl-149', question: 'Który polski skoczek narciarski wygrał Turniej Czterech Skoczni dwukrotnie?', answers: ['Adam Małysz', 'Kamil Stoch', 'Piotr Żyła', 'Dawid Kubacki'], correctIndex: 1, category: 'Sport', difficulty: 'medium' },
  { id: 'pl-150', question: 'W którym kraju odbyły się Letnie Igrzyska Olimpijskie w 2020 (2021)?', answers: ['Chiny', 'Korea Południowa', 'Japonia', 'Australia'], correctIndex: 2, category: 'Sport', difficulty: 'medium' },
  { id: 'pl-151', question: 'Ile punktów przyznaje się za przyłożenie w rugby?', answers: ['3', '4', '5', '7'], correctIndex: 2, category: 'Sport', difficulty: 'medium' },
  // Hard
  { id: 'pl-152', question: 'Która polska lekkoatletka zdobyła złoty medal w rzucie młotem na Igrzyskach w Tokio?', answers: ['Anita Włodarczyk', 'Kamila Lićwinko', 'Maria Andrejczyk', 'Joanna Fiodorow'], correctIndex: 0, category: 'Sport', difficulty: 'hard' },
  { id: 'pl-153', question: 'W którym roku Polska zdobyła mistrzostwo świata w piłce siatkowej mężczyzn po raz pierwszy od 1974?', answers: ['2012', '2014', '2016', '2018'], correctIndex: 1, category: 'Sport', difficulty: 'hard' },

  // ============================================================
  // FILM I TV (10 questions)
  // ============================================================
  // Easy
  { id: 'pl-154', question: 'Jak nazywa się reżyser "Gwiezdnych Wojen"?', answers: ['Steven Spielberg', 'George Lucas', 'James Cameron', 'Ridley Scott'], correctIndex: 1, category: 'Film i TV', difficulty: 'easy' },
  { id: 'pl-155', question: 'Kto gra rolę Harrego Pottera w filmach?', answers: ['Rupert Grint', 'Tom Felton', 'Daniel Radcliffe', 'Eddie Redmayne'], correctIndex: 2, category: 'Film i TV', difficulty: 'easy' },
  { id: 'pl-156', question: 'W jakim filmie animowanym występuje Simba?', answers: ['Bambi', 'Król Lew', 'Księga Dżungli', 'Gdzie jest Nemo?'], correctIndex: 1, category: 'Film i TV', difficulty: 'easy' },
  // Medium
  { id: 'pl-157', question: 'Który polski reżyser wyreżyserował "Pianistę"?', answers: ['Andrzej Wajda', 'Roman Polański', 'Krzysztof Kieślowski', 'Agnieszka Holland'], correctIndex: 1, category: 'Film i TV', difficulty: 'medium' },
  { id: 'pl-158', question: 'Kto wyreżyserował trylogię "Władca Pierścieni"?', answers: ['Steven Spielberg', 'James Cameron', 'Peter Jackson', 'Ridley Scott'], correctIndex: 2, category: 'Film i TV', difficulty: 'medium' },
  { id: 'pl-159', question: 'Który film zdobył Oscara za najlepszy film w 2020 roku (za rok 2019)?', answers: ['1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood'], correctIndex: 2, category: 'Film i TV', difficulty: 'medium' },
  { id: 'pl-160', question: 'Jak nazywa się serial, którego akcja toczy się w Hawkins?', answers: ['Dark', 'Stranger Things', 'The OA', 'Riverdale'], correctIndex: 1, category: 'Film i TV', difficulty: 'medium' },
  { id: 'pl-161', question: 'Który aktor zagrał postać Jokera w filmie "Mroczny Rycerz"?', answers: ['Jack Nicholson', 'Joaquin Phoenix', 'Jared Leto', 'Heath Ledger'], correctIndex: 3, category: 'Film i TV', difficulty: 'medium' },
  // Hard
  { id: 'pl-162', question: 'Który polski film zdobył Oscara za najlepszy film obcojęzyczny w 2015?', answers: ['Zimna wojna', 'Ida', 'Boże Ciało', 'W ciemności'], correctIndex: 1, category: 'Film i TV', difficulty: 'hard' },
  { id: 'pl-163', question: 'Jak nazywa się reżyser "Dekalog" - cyklu dziesięciu filmów?', answers: ['Andrzej Wajda', 'Roman Polański', 'Krzysztof Kieślowski', 'Krzysztof Zanussi'], correctIndex: 2, category: 'Film i TV', difficulty: 'hard' },

  // ============================================================
  // IMAGE QUESTIONS
  // ============================================================
  { id: 'img-1', question: 'Które zwierzę jest największym ssakiem lądowym?', answers: ['Nosorożec biały', 'Słoń afrykański', 'Hipopotam', 'Żyrafa'], correctIndex: 1, category: 'Biologia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/African_Elephant.jpg/320px-African_Elephant.jpg' },
  { id: 'img-2', question: 'Jaki budynek przedstawia to zdjęcie?', answers: ['Koloseum', 'Partenon', 'Panteon', 'Amfiteatr w Pompejach'], correctIndex: 0, category: 'Historia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/320px-Colosseo_2020.jpg' },
  { id: 'img-3', question: 'Który to instrument muzyczny?', answers: ['Flet', 'Klarnet', 'Obój', 'Saksofon'], correctIndex: 3, category: 'Muzyka', difficulty: 'medium', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Yamaha_Saxophone_YAS-62.jpg/120px-Yamaha_Saxophone_YAS-62.jpg' },
  { id: 'img-4', question: 'Jaka planeta jest widoczna na zdjęciu?', answers: ['Mars', 'Jowisz', 'Saturn', 'Neptun'], correctIndex: 2, category: 'Nauka', difficulty: 'medium', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg' },
  { id: 'img-5', question: 'Które miasto przedstawia to zdjęcie?', answers: ['Nowy Jork', 'Londyn', 'Paryż', 'Tokio'], correctIndex: 2, category: 'Geografia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/200px-Tour_Eiffel_Wikimedia_Commons.jpg' },
];

// ===== MINI GAMES =====
export const miniGamesPool: MiniGameDef[] = [
  // Existing connect games
  {
    type: 'connect',
    title: 'Połącz stolice z krajami',
    pairs: [
      { left: 'Polska', right: 'Warszawa' },
      { left: 'Francja', right: 'Paryż' },
      { left: 'Niemcy', right: 'Berlin' },
      { left: 'Hiszpania', right: 'Madryt' },
      { left: 'Włochy', right: 'Rzym' },
      { left: 'Portugalia', right: 'Lizbona' },
    ],
  } as MiniGameConnect,
  {
    type: 'connect',
    title: 'Połącz autorów z dziełami',
    pairs: [
      { left: 'Adam Mickiewicz', right: 'Pan Tadeusz' },
      { left: 'Henryk Sienkiewicz', right: 'Quo Vadis' },
      { left: 'Bolesław Prus', right: 'Lalka' },
      { left: 'Stefan Żeromski', right: 'Przedwiośnie' },
      { left: 'Juliusz Słowacki', right: 'Balladyna' },
      { left: 'Władysław Reymont', right: 'Chłopi' },
    ],
  } as MiniGameConnect,
  // Existing sort games
  {
    type: 'sort',
    title: 'Przypisz zwierzęta do kategorii',
    categories: ['Ssak', 'Ptak'],
    items: [
      { item: 'Delfin', category: 'Ssak' },
      { item: 'Pingwin', category: 'Ptak' },
      { item: 'Nietoperz', category: 'Ssak' },
      { item: 'Struś', category: 'Ptak' },
      { item: 'Wieloryb', category: 'Ssak' },
      { item: 'Orzeł', category: 'Ptak' },
      { item: 'Foka', category: 'Ssak' },
      { item: 'Pelikan', category: 'Ptak' },
    ],
  } as MiniGameSort,
  {
    type: 'sort',
    title: 'Przypisz pierwiastki do grupy',
    categories: ['Metal', 'Niemetal'],
    items: [
      { item: 'Żelazo', category: 'Metal' },
      { item: 'Tlen', category: 'Niemetal' },
      { item: 'Złoto', category: 'Metal' },
      { item: 'Azot', category: 'Niemetal' },
      { item: 'Miedź', category: 'Metal' },
      { item: 'Siarka', category: 'Niemetal' },
      { item: 'Srebro', category: 'Metal' },
      { item: 'Hel', category: 'Niemetal' },
    ],
  } as MiniGameSort,

  // === NEW CONNECT GAMES ===
  {
    type: 'connect',
    title: 'Połącz wynalazki z ich twórcami',
    pairs: [
      { left: 'Żarówka', right: 'Thomas Edison' },
      { left: 'Telefon', right: 'Alexander Graham Bell' },
      { left: 'Dynamit', right: 'Alfred Nobel' },
      { left: 'Radio', right: 'Guglielmo Marconi' },
      { left: 'Penicylina', right: 'Alexander Fleming' },
      { left: 'Termometr', right: 'Daniel Fahrenheit' },
      { left: 'Piorunochron', right: 'Benjamin Franklin' },
    ],
  } as MiniGameConnect,
  {
    type: 'connect',
    title: 'Połącz filmy z reżyserami',
    pairs: [
      { left: 'Pianista', right: 'Roman Polański' },
      { left: 'Człowiek z żelaza', right: 'Andrzej Wajda' },
      { left: 'Trzy kolory', right: 'Krzysztof Kieślowski' },
      { left: 'Titanic', right: 'James Cameron' },
      { left: 'Pulp Fiction', right: 'Quentin Tarantino' },
      { left: 'Incepcja', right: 'Christopher Nolan' },
    ],
  } as MiniGameConnect,
  {
    type: 'connect',
    title: 'Połącz kraje z ich flagami (opis)',
    pairs: [
      { left: 'Biało-czerwona (poziomo)', right: 'Polska' },
      { left: 'Trzy pasy: niebieski-biały-czerwony', right: 'Francja' },
      { left: 'Czarno-czerwono-złota', right: 'Niemcy' },
      { left: 'Zielono-biało-czerwona (pionowo)', right: 'Włochy' },
      { left: 'Czerwona z białym krzyżem', right: 'Szwajcaria' },
      { left: 'Niebiesko-żółta', right: 'Ukraina' },
      { left: 'Biało-niebieska z krzyżem', right: 'Finlandia' },
    ],
  } as MiniGameConnect,

  // === NEW SORT GAMES ===
  {
    type: 'sort',
    title: 'Kraj w UE czy poza UE?',
    categories: ['Unia Europejska', 'Poza UE'],
    items: [
      { item: 'Polska', category: 'Unia Europejska' },
      { item: 'Norwegia', category: 'Poza UE' },
      { item: 'Francja', category: 'Unia Europejska' },
      { item: 'Szwajcaria', category: 'Poza UE' },
      { item: 'Hiszpania', category: 'Unia Europejska' },
      { item: 'Wielka Brytania', category: 'Poza UE' },
      { item: 'Chorwacja', category: 'Unia Europejska' },
      { item: 'Serbia', category: 'Poza UE' },
    ],
  } as MiniGameSort,
  {
    type: 'sort',
    title: 'Energia odnawialna czy nieodnawialna?',
    categories: ['Odnawialna', 'Nieodnawialna'],
    items: [
      { item: 'Energia słoneczna', category: 'Odnawialna' },
      { item: 'Węgiel kamienny', category: 'Nieodnawialna' },
      { item: 'Energia wiatrowa', category: 'Odnawialna' },
      { item: 'Ropa naftowa', category: 'Nieodnawialna' },
      { item: 'Energia geotermalna', category: 'Odnawialna' },
      { item: 'Gaz ziemny', category: 'Nieodnawialna' },
      { item: 'Energia wodna', category: 'Odnawialna' },
      { item: 'Uran (energia jądrowa)', category: 'Nieodnawialna' },
    ],
  } as MiniGameSort,
  {
    type: 'sort',
    title: 'Planeta czy planeta karłowata?',
    categories: ['Planeta', 'Planeta karłowata'],
    items: [
      { item: 'Ziemia', category: 'Planeta' },
      { item: 'Pluton', category: 'Planeta karłowata' },
      { item: 'Mars', category: 'Planeta' },
      { item: 'Ceres', category: 'Planeta karłowata' },
      { item: 'Jowisz', category: 'Planeta' },
      { item: 'Eris', category: 'Planeta karłowata' },
      { item: 'Saturn', category: 'Planeta' },
      { item: 'Haumea', category: 'Planeta karłowata' },
    ],
  } as MiniGameSort,
];

// ===== HOST COMMENTS =====
export const hostComments = {
  gameStart: [
    'Witajcie w Wiedza to Potęga! Czas sprawdzić, kto wie więcej!',
    'Zaczynamy! Niech wygra mądrzejszy!',
    'Wiedza to Potęga - 1 na 1! Gotowi na pojedynek umysłów?',
    'Uwaga, uwaga! Turniej wiedzy czas zacząć!',
    'Kto pierwszy, ten lepszy! A kto mądrzejszy, ten wygrywa!',
  ],
  correctBoth: [
    'Obaj wiedzą! Ale kto był szybszy?',
    'Brawo! Wiedza na wysokim poziomie!',
    'Dwie poprawne odpowiedzi! Liczy się szybkość!',
    'Ekspresowe odpowiedzi! Imponujące!',
    'Obaj gracze w formie! To się robi ciekawe!',
  ],
  correctOne: [
    'Tylko jeden zdobywa punkty! Trzeba nadrabiać!',
    'Jest różnica! Jeden prowadzi!',
    'Wiedza to potęga... ale nie dla wszystkich!',
    'Punkt dla jednego! Drugi musi się sprężyć!',
    'Oj, ktoś musi powtórzyć lekcje!',
  ],
  bothWrong: [
    'Ojej! Nikt nie trafił! To było trudne pytanie.',
    'Hmm, żadna poprawna odpowiedź. Trudna kategoria!',
    'Pusto! Może następne pytanie będzie łatwiejsze.',
    'Oho, zawieje! Nikt nie wiedział!',
    'To pytanie pokonało obu graczy!',
  ],
  powerUpUsed: [
    'Zagrywka w akcji! To powinno utrudnić sprawę!',
    'Oj, ktoś nie gra fair... a może po prostu strategicznie?',
    'Przeszkadzajka! Czy przeciwnik sobie poradzi?',
    'Sabotaż! Ciekawe, jak to wpłynie na wynik!',
    'Ktoś lubi grać ostro! Zagrywka aktywowana!',
  ],
  miniGameStart: [
    'Czas na mini grę! Szybkość i wiedza!',
    'Przerwa od pytań - ale nie od myślenia!',
    'Mini gra! Kto zdobędzie bonus?',
    'Zmiana tempa! Czas na mini wyzwanie!',
    'Bonus do zdobycia! Kto będzie szybszy?',
  ],
  pyramidStart: [
    'Czas na finał! Piramida Wiedzy!',
    'Ostatnia szansa na odwrócenie wyniku! Piramida Wiedzy!',
    'Finałowa piramida! Wszystko się może zmienić!',
    'Wielki finał! Kto zdobędzie szczyt piramidy?',
    'Piramida Wiedzy! Tu rozstrzygnie się wszystko!',
  ],
  closeGame: [
    'Wyrównany pojedynek! Emocje sięgają zenitu!',
    'Niemal remis! Każdy punkt na wagę złota!',
    'Zacięta rywalizacja! Kto pęknie pierwszy?',
    'Punkt za punkt! Nerwy ze stali potrzebne!',
  ],
  bigLead: [
    'Zdecydowane prowadzenie! Czy da się jeszcze odrobić?',
    'Duża przewaga! Ale w Piramidzie wszystko jest możliwe!',
    'Dominacja! Ale mecz jeszcze trwa!',
    'Nokaut? Jeszcze za wcześnie, by się poddawać!',
  ],
};

export const funFacts: string[] = [
  'Mózg ludzki zużywa około 20% energii całego ciała, mimo że stanowi tylko 2% masy.',
  'Miód nigdy się nie psuje - znaleziono jadalny miód w egipskich grobowcach sprzed 3000 lat.',
  'Ośmiornice mają trzy serca i niebieską krew.',
  'Wieża Eiffla może "urosnąć" nawet o 15 cm w upalne dni z powodu rozszerzalności cieplnej.',
  'Ludzki nos może rozróżnić ponad 1 bilion zapachów.',
  'Każdy człowiek ma unikalny odcisk języka, podobnie jak odcisk palca.',
  'Banan jest botanicznie jagodą, a truskawka nie jest.',
  'Serce człowieka bije około 100 000 razy dziennie.',
  'Światło Słońca potrzebuje około 8 minut i 20 sekund, aby dotrzeć do Ziemi.',
  'Oktopusy potrafią zmieniać kolor w ułamku sekundy.',
  'Koala śpi nawet 22 godziny dziennie.',
  'Na Saturnie i Jowiszu pada deszcz z diamentów.',
  'Rekiny istnieją dłużej niż drzewa - pojawiły się około 400 milionów lat temu.',
  'Ludzkie ciało zawiera wystarczająco dużo żelaza, by zrobić mały gwóźdź.',
  'Wenecja stoi na 118 małych wyspach połączonych ponad 400 mostami.',
  'Język programowania Python nie został nazwany od węża, lecz od "Latającego Cyrku Monty Pythona".',
  'Płuca człowieka, gdyby je rozłożyć, miałyby powierzchnię kortu tenisowego.',
  'Japonia ma więcej kotów domowych niż dzieci poniżej 15 roku życia.',
  'DNA człowieka i banana jest zgodne w około 60%.',
  'Najkrótszą wojną w historii była wojna angielsko-zanzibarską - trwała 38 minut.',
];

// ===== HELPERS =====
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getHostComment(key: keyof typeof hostComments): string {
  return randomPick(hostComments[key]);
}

export function getRandomFunFact(): string {
  return randomPick(funFacts);
}

export async function getQuestions(count: number, difficulty?: string): Promise<Question[]> {
  let pool = [...builtInQuestions];
  if (difficulty && difficulty !== 'mixed') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }
  return shuffleArray(pool).slice(0, count);
}

export function getAvailableCategories(questions: Question[]): string[] {
  const categories = [...new Set(questions.map((q) => q.category))];
  return shuffleArray(categories).slice(0, 4);
}

export function getMiniGames(): MiniGameDef[] {
  const shuffled = shuffleArray(miniGamesPool);
  // One connect + one sort
  const connect = shuffled.find((g) => g.type === 'connect') || miniGamesPool[0];
  const sort = shuffled.find((g) => g.type === 'sort') || miniGamesPool[2];
  return [connect, sort];
}
