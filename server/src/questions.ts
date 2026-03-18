import { Question } from './types';

// Built-in Polish questions
export const builtInQuestions: Question[] = [
  {
    id: 'pl-1',
    question: 'Jaka jest stolica Polski?',
    answers: ['Kraków', 'Warszawa', 'Gdańsk', 'Wrocław'],
    correctIndex: 1,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-2',
    question: 'Kto napisał "Pan Tadeusz"?',
    answers: ['Juliusz Słowacki', 'Henryk Sienkiewicz', 'Adam Mickiewicz', 'Bolesław Prus'],
    correctIndex: 2,
    category: 'Literatura',
    difficulty: 'easy',
  },
  {
    id: 'pl-3',
    question: 'W którym roku Polska odzyskała niepodległość?',
    answers: ['1918', '1920', '1910', '1945'],
    correctIndex: 0,
    category: 'Historia',
    difficulty: 'easy',
  },
  {
    id: 'pl-4',
    question: 'Jaki jest najdłuższy rzeka w Polsce?',
    answers: ['Odra', 'Bug', 'Wisła', 'Warta'],
    correctIndex: 2,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-5',
    question: 'Ile wynosi pierwiastek kwadratowy z 144?',
    answers: ['10', '11', '12', '14'],
    correctIndex: 2,
    category: 'Matematyka',
    difficulty: 'easy',
  },
  {
    id: 'pl-6',
    question: 'Który polski naukowiec odkrył polon i rad?',
    answers: ['Mikołaj Kopernik', 'Maria Skłodowska-Curie', 'Jan Czochralski', 'Marian Smoluchowski'],
    correctIndex: 1,
    category: 'Nauka',
    difficulty: 'easy',
  },
  {
    id: 'pl-7',
    question: 'Jaki jest najwyższy szczyt w Polsce?',
    answers: ['Śnieżka', 'Rysy', 'Babia Góra', 'Kasprowy Wierch'],
    correctIndex: 1,
    category: 'Geografia',
    difficulty: 'medium',
  },
  {
    id: 'pl-8',
    question: 'W którym roku odbyła się bitwa pod Grunwaldem?',
    answers: ['1385', '1410', '1466', '1525'],
    correctIndex: 1,
    category: 'Historia',
    difficulty: 'medium',
  },
  {
    id: 'pl-9',
    question: 'Jaki gaz stanowi największą część atmosfery Ziemi?',
    answers: ['Tlen', 'Dwutlenek węgla', 'Azot', 'Argon'],
    correctIndex: 2,
    category: 'Nauka',
    difficulty: 'easy',
  },
  {
    id: 'pl-10',
    question: 'Który planet jest najbliżej Słońca?',
    answers: ['Wenus', 'Mars', 'Merkury', 'Ziemia'],
    correctIndex: 2,
    category: 'Nauka',
    difficulty: 'easy',
  },
  {
    id: 'pl-11',
    question: 'Kto namalował "Bitwę pod Grunwaldem"?',
    answers: ['Jan Matejko', 'Stanisław Wyspiański', 'Jacek Malczewski', 'Józef Chełmoński'],
    correctIndex: 0,
    category: 'Sztuka',
    difficulty: 'medium',
  },
  {
    id: 'pl-12',
    question: 'Ile nóg ma pająk?',
    answers: ['6', '8', '10', '12'],
    correctIndex: 1,
    category: 'Biologia',
    difficulty: 'easy',
  },
  {
    id: 'pl-13',
    question: 'Jaka jest waluta Japonii?',
    answers: ['Yuan', 'Won', 'Jen', 'Rupia'],
    correctIndex: 2,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-14',
    question: 'Który ocean jest największy?',
    answers: ['Atlantycki', 'Indyjski', 'Arktyczny', 'Spokojny'],
    correctIndex: 3,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-15',
    question: 'W jakim roku człowiek po raz pierwszy stanął na Księżycu?',
    answers: ['1965', '1969', '1971', '1973'],
    correctIndex: 1,
    category: 'Historia',
    difficulty: 'easy',
  },
  {
    id: 'pl-16',
    question: 'Jaki pierwiastek chemiczny oznaczamy symbolem "Fe"?',
    answers: ['Fluor', 'Fosfor', 'Żelazo', 'Francium'],
    correctIndex: 2,
    category: 'Chemia',
    difficulty: 'medium',
  },
  {
    id: 'pl-17',
    question: 'Kto jest autorem teorii względności?',
    answers: ['Isaac Newton', 'Niels Bohr', 'Albert Einstein', 'Max Planck'],
    correctIndex: 2,
    category: 'Nauka',
    difficulty: 'easy',
  },
  {
    id: 'pl-18',
    question: 'Ile wynosi liczba Pi (π) zaokrąglona do dwóch miejsc po przecinku?',
    answers: ['3.14', '3.16', '3.12', '3.18'],
    correctIndex: 0,
    category: 'Matematyka',
    difficulty: 'easy',
  },
  {
    id: 'pl-19',
    question: 'Która góra jest najwyższa na świecie?',
    answers: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
    correctIndex: 2,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-20',
    question: 'Jaki jest symbol chemiczny złota?',
    answers: ['Ag', 'Au', 'Zn', 'Cu'],
    correctIndex: 1,
    category: 'Chemia',
    difficulty: 'medium',
  },
  {
    id: 'pl-21',
    question: 'W którym roku rozpoczęła się II wojna światowa?',
    answers: ['1937', '1938', '1939', '1940'],
    correctIndex: 2,
    category: 'Historia',
    difficulty: 'easy',
  },
  {
    id: 'pl-22',
    question: 'Który kompozytor jest autorem "Etiud Rewolucyjnych"?',
    answers: ['Ludwig van Beethoven', 'Fryderyk Chopin', 'Wolfgang Amadeus Mozart', 'Franz Liszt'],
    correctIndex: 1,
    category: 'Muzyka',
    difficulty: 'medium',
  },
  {
    id: 'pl-23',
    question: 'Ile jest kontynentów na Ziemi?',
    answers: ['5', '6', '7', '8'],
    correctIndex: 2,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-24',
    question: 'Jaki jest największy organ w ludzkim ciele?',
    answers: ['Serce', 'Wątroba', 'Płuca', 'Skóra'],
    correctIndex: 3,
    category: 'Biologia',
    difficulty: 'medium',
  },
  {
    id: 'pl-25',
    question: 'Kto napisał "Quo Vadis"?',
    answers: ['Bolesław Prus', 'Henryk Sienkiewicz', 'Stefan Żeromski', 'Władysław Reymont'],
    correctIndex: 1,
    category: 'Literatura',
    difficulty: 'medium',
  },
  {
    id: 'pl-26',
    question: 'Jaka jest prędkość światła w próżni (w przybliżeniu)?',
    answers: ['200 000 km/s', '300 000 km/s', '400 000 km/s', '150 000 km/s'],
    correctIndex: 1,
    category: 'Fizyka',
    difficulty: 'medium',
  },
  {
    id: 'pl-27',
    question: 'Ile kości ma dorosły człowiek?',
    answers: ['186', '206', '226', '246'],
    correctIndex: 1,
    category: 'Biologia',
    difficulty: 'medium',
  },
  {
    id: 'pl-28',
    question: 'Który kraj ma największą populację na świecie?',
    answers: ['Chiny', 'Indie', 'USA', 'Indonezja'],
    correctIndex: 1,
    category: 'Geografia',
    difficulty: 'medium',
  },
  {
    id: 'pl-29',
    question: 'Jaki jest wzór chemiczny wody?',
    answers: ['HO', 'H2O', 'H2O2', 'OH2'],
    correctIndex: 1,
    category: 'Chemia',
    difficulty: 'easy',
  },
  {
    id: 'pl-30',
    question: 'W którym mieście znajduje się Wawel?',
    answers: ['Warszawa', 'Poznań', 'Kraków', 'Gdańsk'],
    correctIndex: 2,
    category: 'Geografia',
    difficulty: 'easy',
  },
  {
    id: 'pl-31',
    question: 'Kto był pierwszym prezydentem USA?',
    answers: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
    correctIndex: 2,
    category: 'Historia',
    difficulty: 'medium',
  },
  {
    id: 'pl-32',
    question: 'Jak nazywa się najgłębszy punkt na Ziemi?',
    answers: ['Rów Mariański', 'Rów Jawajski', 'Rów Filipiński', 'Rów Tonga'],
    correctIndex: 0,
    category: 'Geografia',
    difficulty: 'medium',
  },
  {
    id: 'pl-33',
    question: 'Ile planet jest w Układzie Słonecznym?',
    answers: ['7', '8', '9', '10'],
    correctIndex: 1,
    category: 'Nauka',
    difficulty: 'easy',
  },
  {
    id: 'pl-34',
    question: 'Jaki język programowania stworzył Guido van Rossum?',
    answers: ['Java', 'Ruby', 'Python', 'JavaScript'],
    correctIndex: 2,
    category: 'Informatyka',
    difficulty: 'medium',
  },
  {
    id: 'pl-35',
    question: 'Który metal jest najlżejszy?',
    answers: ['Aluminium', 'Lit', 'Magnez', 'Sód'],
    correctIndex: 1,
    category: 'Chemia',
    difficulty: 'hard',
  },
  {
    id: 'pl-36',
    question: 'Ile trwa rok świetlny w ziemskich latach?',
    answers: ['To nie jednostka czasu', '100 lat', '1000 lat', '1 rok'],
    correctIndex: 0,
    category: 'Nauka',
    difficulty: 'hard',
  },
  {
    id: 'pl-37',
    question: 'Kto wynalazł telefon?',
    answers: ['Thomas Edison', 'Nikola Tesla', 'Alexander Graham Bell', 'Guglielmo Marconi'],
    correctIndex: 2,
    category: 'Historia',
    difficulty: 'medium',
  },
  {
    id: 'pl-38',
    question: 'Jak nazywa się najdłuższa rzeka na świecie?',
    answers: ['Amazonka', 'Nil', 'Jangcy', 'Missisipi'],
    correctIndex: 1,
    category: 'Geografia',
    difficulty: 'medium',
  },
  {
    id: 'pl-39',
    question: 'Ile chromosomów ma człowiek?',
    answers: ['23', '44', '46', '48'],
    correctIndex: 2,
    category: 'Biologia',
    difficulty: 'medium',
  },
  {
    id: 'pl-40',
    question: 'Która bitwa zakończyła epokę napoleońską?',
    answers: ['Bitwa pod Austerlitz', 'Bitwa pod Waterloo', 'Bitwa pod Lipskiem', 'Bitwa pod Borodino'],
    correctIndex: 1,
    category: 'Historia',
    difficulty: 'hard',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
    const data = await response.json();

    if (data.response_code !== 0) {
      console.warn('Open Trivia DB returned non-zero response code:', data.response_code);
      return [];
    }

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
  } catch (error) {
    console.error('Failed to fetch from Open Trivia DB:', error);
    return [];
  }
}

export async function getQuestions(count: number, difficulty?: string): Promise<Question[]> {
  // Try to get half from API, half from built-in
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
    // If API fails, use more built-in questions
    const extraBuiltIn = shuffleArray(builtInQuestions).slice(0, count - apiQuestions.length);
    questions = shuffleArray([...apiQuestions, ...extraBuiltIn]);
  }

  return questions.slice(0, count);
}
