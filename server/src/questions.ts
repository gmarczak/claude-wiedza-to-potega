import { Question, MiniGameConnect, MiniGameSort, MiniGameDef } from './types';

export const builtInQuestions: Question[] = [
  // === EASY ===
  { id: 'pl-1', question: 'Jaka jest stolica Polski?', answers: ['Kraków', 'Warszawa', 'Gdańsk', 'Wrocław'], correctIndex: 1, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-2', question: 'Kto napisał "Pan Tadeusz"?', answers: ['Juliusz Słowacki', 'Henryk Sienkiewicz', 'Adam Mickiewicz', 'Bolesław Prus'], correctIndex: 2, category: 'Literatura', difficulty: 'easy' },
  { id: 'pl-3', question: 'W którym roku Polska odzyskała niepodległość?', answers: ['1918', '1920', '1910', '1945'], correctIndex: 0, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-4', question: 'Jaka jest najdłuższa rzeka w Polsce?', answers: ['Odra', 'Bug', 'Wisła', 'Warta'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-5', question: 'Ile wynosi pierwiastek kwadratowy z 144?', answers: ['10', '11', '12', '14'], correctIndex: 2, category: 'Matematyka', difficulty: 'easy' },
  { id: 'pl-6', question: 'Który polski naukowiec odkrył polon i rad?', answers: ['Mikołaj Kopernik', 'Maria Skłodowska-Curie', 'Jan Czochralski', 'Marian Smoluchowski'], correctIndex: 1, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-9', question: 'Jaki gaz stanowi największą część atmosfery Ziemi?', answers: ['Tlen', 'Dwutlenek węgla', 'Azot', 'Argon'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-10', question: 'Który planet jest najbliżej Słońca?', answers: ['Wenus', 'Mars', 'Merkury', 'Ziemia'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-12', question: 'Ile nóg ma pająk?', answers: ['6', '8', '10', '12'], correctIndex: 1, category: 'Biologia', difficulty: 'easy' },
  { id: 'pl-13', question: 'Jaka jest waluta Japonii?', answers: ['Yuan', 'Won', 'Jen', 'Rupia'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-14', question: 'Który ocean jest największy?', answers: ['Atlantycki', 'Indyjski', 'Arktyczny', 'Spokojny'], correctIndex: 3, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-15', question: 'W jakim roku człowiek po raz pierwszy stanął na Księżycu?', answers: ['1965', '1969', '1971', '1973'], correctIndex: 1, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-17', question: 'Kto jest autorem teorii względności?', answers: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Max Planck'], correctIndex: 2, category: 'Nauka', difficulty: 'easy' },
  { id: 'pl-18', question: 'Ile wynosi liczba Pi (π) zaokrąglona do dwóch miejsc po przecinku?', answers: ['3.14', '3.16', '3.12', '3.18'], correctIndex: 0, category: 'Matematyka', difficulty: 'easy' },
  { id: 'pl-19', question: 'Która góra jest najwyższa na świecie?', answers: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-21', question: 'W którym roku rozpoczęła się II wojna światowa?', answers: ['1937', '1938', '1939', '1940'], correctIndex: 2, category: 'Historia', difficulty: 'easy' },
  { id: 'pl-23', question: 'Ile jest kontynentów na Ziemi?', answers: ['5', '6', '7', '8'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-29', question: 'Jaki jest wzór chemiczny wody?', answers: ['HO', 'H2O', 'H2O2', 'OH2'], correctIndex: 1, category: 'Chemia', difficulty: 'easy' },
  { id: 'pl-30', question: 'W którym mieście znajduje się Wawel?', answers: ['Warszawa', 'Poznań', 'Kraków', 'Gdańsk'], correctIndex: 2, category: 'Geografia', difficulty: 'easy' },
  { id: 'pl-33', question: 'Ile planet jest w Układzie Słonecznym?', answers: ['7', '8', '9', '10'], correctIndex: 1, category: 'Nauka', difficulty: 'easy' },

  // === MEDIUM ===
  { id: 'pl-7', question: 'Jaki jest najwyższy szczyt w Polsce?', answers: ['Śnieżka', 'Rysy', 'Babia Góra', 'Kasprowy Wierch'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-8', question: 'W którym roku odbyła się bitwa pod Grunwaldem?', answers: ['1385', '1410', '1466', '1525'], correctIndex: 1, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-11', question: 'Kto namalował "Bitwę pod Grunwaldem"?', answers: ['Jan Matejko', 'Stanisław Wyspiański', 'Jacek Malczewski', 'Józef Chełmoński'], correctIndex: 0, category: 'Sztuka', difficulty: 'medium' },
  { id: 'pl-16', question: 'Jaki pierwiastek chemiczny oznaczamy symbolem "Fe"?', answers: ['Fluor', 'Fosfor', 'Żelazo', 'Francium'], correctIndex: 2, category: 'Chemia', difficulty: 'medium' },
  { id: 'pl-20', question: 'Jaki jest symbol chemiczny złota?', answers: ['Ag', 'Au', 'Zn', 'Cu'], correctIndex: 1, category: 'Chemia', difficulty: 'medium' },
  { id: 'pl-22', question: 'Który kompozytor jest autorem "Etiud Rewolucyjnych"?', answers: ['Ludwig van Beethoven', 'Fryderyk Chopin', 'Wolfgang Amadeus Mozart', 'Franz Liszt'], correctIndex: 1, category: 'Muzyka', difficulty: 'medium' },
  { id: 'pl-24', question: 'Jaki jest największy organ w ludzkim ciele?', answers: ['Serce', 'Wątroba', 'Płuca', 'Skóra'], correctIndex: 3, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-25', question: 'Kto napisał "Quo Vadis"?', answers: ['Bolesław Prus', 'Henryk Sienkiewicz', 'Stefan Żeromski', 'Władysław Reymont'], correctIndex: 1, category: 'Literatura', difficulty: 'medium' },
  { id: 'pl-26', question: 'Jaka jest prędkość światła w próżni (w przybliżeniu)?', answers: ['200 000 km/s', '300 000 km/s', '400 000 km/s', '150 000 km/s'], correctIndex: 1, category: 'Fizyka', difficulty: 'medium' },
  { id: 'pl-27', question: 'Ile kości ma dorosły człowiek?', answers: ['186', '206', '226', '246'], correctIndex: 1, category: 'Biologia', difficulty: 'medium' },
  { id: 'pl-28', question: 'Który kraj ma największą populację na świecie?', answers: ['Chiny', 'Indie', 'USA', 'Indonezja'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-31', question: 'Kto był pierwszym prezydentem USA?', answers: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], correctIndex: 2, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-32', question: 'Jak nazywa się najgłębszy punkt na Ziemi?', answers: ['Rów Mariański', 'Rów Jawajski', 'Rów Filipiński', 'Rów Tonga'], correctIndex: 0, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-34', question: 'Jaki język programowania stworzył Guido van Rossum?', answers: ['Java', 'Ruby', 'Python', 'JavaScript'], correctIndex: 2, category: 'Informatyka', difficulty: 'medium' },
  { id: 'pl-37', question: 'Kto wynalazł telefon?', answers: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'], correctIndex: 2, category: 'Historia', difficulty: 'medium' },
  { id: 'pl-38', question: 'Jak nazywa się najdłuższa rzeka na świecie?', answers: ['Amazonka', 'Nil', 'Jangcy', 'Missisipi'], correctIndex: 1, category: 'Geografia', difficulty: 'medium' },
  { id: 'pl-39', question: 'Ile chromosomów ma człowiek?', answers: ['23', '44', '46', '48'], correctIndex: 2, category: 'Biologia', difficulty: 'medium' },

  // === HARD ===
  { id: 'pl-35', question: 'Który metal jest najlżejszy?', answers: ['Aluminium', 'Lit', 'Magnez', 'Sód'], correctIndex: 1, category: 'Chemia', difficulty: 'hard' },
  { id: 'pl-36', question: 'Ile trwa rok świetlny w ziemskich latach?', answers: ['To nie jednostka czasu', '100 lat', '1000 lat', '1 rok'], correctIndex: 0, category: 'Nauka', difficulty: 'hard' },
  { id: 'pl-40', question: 'Która bitwa zakończyła epokę napoleońską?', answers: ['Bitwa pod Austerlitz', 'Bitwa pod Waterloo', 'Bitwa pod Lipskiem', 'Bitwa pod Borodino'], correctIndex: 1, category: 'Historia', difficulty: 'hard' },

  // === IMAGE QUESTIONS ===
  { id: 'img-1', question: 'Które zwierzę jest największym ssakiem lądowym?', answers: ['Nosorożec biały', 'Słoń afrykański', 'Hipopotam', 'Żyrafa'], correctIndex: 1, category: 'Biologia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/African_Elephant.jpg/320px-African_Elephant.jpg' },
  { id: 'img-2', question: 'Jaki budynek przedstawia to zdjęcie?', answers: ['Koloseum', 'Partenon', 'Panteon', 'Amfiteatr w Pompejach'], correctIndex: 0, category: 'Historia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/320px-Colosseo_2020.jpg' },
  { id: 'img-3', question: 'Który to instrument muzyczny?', answers: ['Flet', 'Klarnet', 'Obój', 'Saksofon'], correctIndex: 3, category: 'Muzyka', difficulty: 'medium', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Yamaha_Saxophone_YAS-62.jpg/120px-Yamaha_Saxophone_YAS-62.jpg' },
  { id: 'img-4', question: 'Jaka planeta jest widoczna na zdjęciu?', answers: ['Mars', 'Jowisz', 'Saturn', 'Neptun'], correctIndex: 2, category: 'Nauka', difficulty: 'medium', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg' },
  { id: 'img-5', question: 'Które miasto przedstawia to zdjęcie?', answers: ['Nowy Jork', 'Londyn', 'Paryż', 'Tokio'], correctIndex: 2, category: 'Geografia', difficulty: 'easy', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/200px-Tour_Eiffel_Wikimedia_Commons.jpg' },
];

// ===== MINI GAMES =====
export const miniGamesPool: MiniGameDef[] = [
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
];

// ===== HOST COMMENTS =====
export const hostComments = {
  gameStart: [
    'Witajcie w Wiedza to Potęga! Czas sprawdzić, kto wie więcej!',
    'Zaczynamy! Niech wygra mądrzejszy!',
    'Wiedza to Potęga - 1 na 1! Gotowi na pojedynek umysłów?',
  ],
  correctBoth: [
    'Obaj wiedzą! Ale kto był szybszy?',
    'Brawo! Wiedza na wysokim poziomie!',
    'Dwie poprawne odpowiedzi! Liczy się szybkość!',
  ],
  correctOne: [
    'Tylko jeden zdobywa punkty! Trzeba nadrabiać!',
    'Jest różnica! Jeden prowadzi!',
    'Wiedza to potęga... ale nie dla wszystkich!',
  ],
  bothWrong: [
    'Ojej! Nikt nie trafił! To było trudne pytanie.',
    'Hmm, żadna poprawna odpowiedź. Trudna kategoria!',
    'Pusto! Może następne pytanie będzie łatwiejsze.',
  ],
  powerUpUsed: [
    'Zagrywka w akcji! To powinno utrudnić sprawę!',
    'Oj, ktoś nie gra fair... a może po prostu strategicznie?',
    'Przeszkadzajka! Czy przeciwnik sobie poradzi?',
  ],
  miniGameStart: [
    'Czas na mini grę! Szybkość i wiedza!',
    'Przerwa od pytań - ale nie od myślenia!',
    'Mini gra! Kto zdobędzie bonus?',
  ],
  pyramidStart: [
    'Czas na finał! Piramida Wiedzy!',
    'Ostatnia szansa na odwrócenie wyniku! Piramida Wiedzy!',
    'Finałowa piramida! Wszystko się może zmienić!',
  ],
  closeGame: [
    'Wyrównany pojedynek! Emocje sięgają zenitu!',
    'Niemal remis! Każdy punkt na wagę złota!',
  ],
  bigLead: [
    'Zdecydowane prowadzenie! Czy da się jeszcze odrobić?',
    'Duża przewaga! Ale w Piramidzie wszystko jest możliwe!',
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

interface OpenTriviaQuestion {
  category: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

function decodeHtml(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü');
}

async function fetchFromOpenTriviaDB(amount: number, difficulty?: string): Promise<Question[]> {
  try {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
    if (difficulty && difficulty !== 'mixed') {
      url += `&difficulty=${difficulty}`;
    }
    const response = await fetch(url);
    const data = await response.json() as { response_code: number; results: OpenTriviaQuestion[] };
    if (data.response_code !== 0) return [];

    return data.results.map((q: OpenTriviaQuestion, index: number): Question => {
      const answers = shuffleArray([q.correct_answer, ...q.incorrect_answers].map(decodeHtml));
      const correctIndex = answers.indexOf(decodeHtml(q.correct_answer));
      return {
        id: `otdb-${Date.now()}-${index}`,
        question: decodeHtml(q.question),
        answers,
        correctIndex,
        category: decodeHtml(q.category),
        difficulty: q.difficulty as Question['difficulty'],
      };
    });
  } catch {
    return [];
  }
}

export async function getQuestions(count: number, difficulty?: string): Promise<Question[]> {
  const apiCount = Math.ceil(count / 2);
  const builtInCount = count - apiCount;

  const [apiQuestions, shuffledBuiltIn] = await Promise.all([
    fetchFromOpenTriviaDB(apiCount, difficulty),
    Promise.resolve(shuffleArray(builtInQuestions).slice(0, builtInCount)),
  ]);

  let questions: Question[];
  if (apiQuestions.length >= apiCount) {
    questions = shuffleArray([...apiQuestions, ...shuffledBuiltIn]);
  } else {
    const extraBuiltIn = shuffleArray(builtInQuestions).slice(0, count - apiQuestions.length);
    questions = shuffleArray([...apiQuestions, ...extraBuiltIn]);
  }

  return questions.slice(0, count);
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
